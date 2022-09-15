import Web3 from "web3";
import GafinConfig from "@/constant/config/index";
import FARMING_SMC_ABI from "@/constant/abi/FarmingContract.abi.json";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
  ContractCallReturnContext,
} from "ethereum-multicall";
import axios from "axios";

export interface FarmingInfoData {
  result: {
    [key: string]: ContractCallReturnContext;
  };
}
enum PoolNumber {
  POOL1 = 0,
  POOL2 = 1,
  POOL3 = 2,
}
const multicall = new Multicall({
  nodeUrl: GafinConfig.BSC_RPC,
  tryAggregate: false,
});

class PoolSingle {
  private poolData: any;
  private poolStartTime = 0;
  private poolEndTime = 0;
  private rewardPerSec = 0;
  private rewardTokenFiatPrice = 0;
  private depositTokenFiatPrice = 0;
  private totalReward = 0;
  private totalDeposit = 0;
  public APR = 0;

  constructor({
    _poolData,
    _rewardTokenFiatPrice,
    _depositTokenFiatPrice,
  }: {
    _poolData: any;
    _rewardTokenFiatPrice: number;
    _depositTokenFiatPrice: number;
  }) {
    this.poolData = _poolData;
    this.rewardTokenFiatPrice = _rewardTokenFiatPrice;
    this.depositTokenFiatPrice = _depositTokenFiatPrice;
  }

  public async init() {
    this.poolStartTime = Web3.utils.hexToNumber(this.poolData[5].hex);
    this.poolEndTime = Web3.utils.hexToNumber(this.poolData[6].hex);
    this.totalDeposit = Number(
      Web3.utils.fromWei(this.poolData[3].hex, "ether")
    );
    this.rewardPerSec = Number(
      Web3.utils.fromWei(this.poolData[4].hex, "ether")
    );

    /** @set totalReward */
    this.totalReward =
      (this.poolEndTime - this.poolStartTime) * this.rewardPerSec;

    /** @convert to fiat */
    const TOTAL_REWARD_FIAT = this.totalReward * this.rewardTokenFiatPrice;
    const TOTAL_DEPOSIT_FIAT = this.totalDeposit * this.depositTokenFiatPrice;

    /** @calculating APR */
    const TOTAL_DAY = (this.poolEndTime - this.poolStartTime) / 86400;
    console.log({ TOTAL_DAY, TOTAL_REWARD_FIAT, TOTAL_DEPOSIT_FIAT });
    this.APR = (TOTAL_REWARD_FIAT * 365) / (TOTAL_DEPOSIT_FIAT * TOTAL_DAY);
  }
}

const useFetchFarmingInfo = async (): Promise<FarmingInfoData> => {
  const contractCallContext: ContractCallContext[] = [
    {
      reference: "SMC_CONTRACT",
      contractAddress: GafinConfig.FARMING_CONTRACT_ADDRESS,
      abi: FARMING_SMC_ABI,
      calls: [
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [1],
        },
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [2],
        },
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [3],
        },
      ],
    },
  ];
  const results: ContractCallResults = await multicall.call(
    contractCallContext
  );
  const INFO_POOL1 =
    results.results.SMC_CONTRACT.callsReturnContext[PoolNumber.POOL3]
      .returnValues;

  /** @getFiatPrice */
  const HERA_PRICE = await axios
    .get(GafinConfig.FIAT_CONVERT_HERA_URL)
    .then((res) => {
      return res.data.data.price;
    });
  const TOP_PRICE = await axios
    .get(GafinConfig.FIAT_CONVERT_TOP_URL)
    .then((res) => {
      return res.data.data.price;
    });

  /** @newPoolInstance */
  const pool1 = new PoolSingle({
    _poolData: INFO_POOL1,
    _rewardTokenFiatPrice: HERA_PRICE,
    _depositTokenFiatPrice: TOP_PRICE,
  });

  /** @initializing pool 1*/
  pool1.init();

  /** @loggingInfo */
  console.log(pool1.APR);

  return {
    result: results.results,
  };
};

export default useFetchFarmingInfo;
