import Web3 from "web3";
import GafinConfig from "@/constant/config/index";
import FARMING_SMC_ABI from "@/constant/abi/FarmingContract.abi.json";
import TOP_SMC_ABI from "@/constant/abi/TopContract.abi.json";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import axios from "axios";
import GafinCrypto from "./GafinCrypto";

export interface FarmingInfoData {
  singlePools: PoolSingle[];
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

export class PoolSingle {
  private poolData: any;
  private poolStartTime = 0;
  private poolEndTime = 0;
  private rewardPerSec = 0;
  private rewardTokenFiatPrice = 0;
  private depositTokenFiatPrice = 0;
  private totalReward = 0;
  private totalDeposit = 0;
  /**
   * @APR -> chỉ số APR của pool
   * @DEPOSIT_TOKEN_CONTRACT_ADDRESS -> trả về address của token deposit
   * @DEPOSIT_TOKEN_ABI -> trả về ABI JSON của token deposit
   */
  public APR = 0;
  public allowance = false;
  public allowanceLoading = false;
  /* return pool info */
  public DEPOSIT_TOKEN_CONTRACT_ADDRESS = "";
  public DEPOSIT_TOKEN_ABI = null as unknown;

  constructor({
    _poolData,
    _rewardTokenFiatPrice,
    _depositTokenFiatPrice,
    _DEPOSIT_TOKEN_CONTRACT_ADDRESS,
    _DEPOSIT_TOKEN_ABI,
  }: {
    _poolData: any;
    _rewardTokenFiatPrice: number;
    _depositTokenFiatPrice: number;
    _DEPOSIT_TOKEN_CONTRACT_ADDRESS: string;
    _DEPOSIT_TOKEN_ABI: unknown;
  }) {
    this.poolData = _poolData;
    this.rewardTokenFiatPrice = _rewardTokenFiatPrice;
    this.depositTokenFiatPrice = _depositTokenFiatPrice;
    this.DEPOSIT_TOKEN_CONTRACT_ADDRESS = _DEPOSIT_TOKEN_CONTRACT_ADDRESS;
    this.DEPOSIT_TOKEN_ABI = _DEPOSIT_TOKEN_ABI;
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
  public async checkAllowance() {
    this.allowance = await GafinCrypto.getAllowance({
      SMC_ADDRESS: this.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
      SMC_ABI: this.DEPOSIT_TOKEN_ABI,
    });
  }

  public async setAllowance() {
    this.allowanceLoading = true;
    await GafinCrypto.approveContract({
      SMC_ADDRESS: this.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
      SMC_ABI: this.DEPOSIT_TOKEN_ABI,
      callback: async (data: any) => {
        if (data.status === "EXECUTE_APPROVE_SUCCESS") {
          console.log("approved");
          this.allowance = true;
          this.allowanceLoading = false;
        } else if (data.status === "EXECUTE_APPROVE_FAIL") {
          console.log("execute fail");
          this.allowanceLoading = false;
        }
      },
    });
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
    results.results.SMC_CONTRACT.callsReturnContext[PoolNumber.POOL1]
      .returnValues;
  const INFO_POOL2 =
    results.results.SMC_CONTRACT.callsReturnContext[PoolNumber.POOL2]
      .returnValues;
  const INFO_POOL3 =
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
  /**
   * @poolCalculating -----------
   */
  /** @newPoolInstance */
  const pool1 = new PoolSingle({
    _poolData: INFO_POOL1,
    _rewardTokenFiatPrice: HERA_PRICE,
    _depositTokenFiatPrice: TOP_PRICE,
    _DEPOSIT_TOKEN_CONTRACT_ADDRESS: GafinConfig.TOP_ADDRESS,
    _DEPOSIT_TOKEN_ABI: TOP_SMC_ABI,
  });
  const pool2 = new PoolSingle({
    _poolData: INFO_POOL2,
    _rewardTokenFiatPrice: HERA_PRICE,
    _depositTokenFiatPrice: TOP_PRICE,
    _DEPOSIT_TOKEN_CONTRACT_ADDRESS: GafinConfig.HERA_ADDRESS,
    _DEPOSIT_TOKEN_ABI: TOP_SMC_ABI,
  });
  const pool3 = new PoolSingle({
    _poolData: INFO_POOL3,
    _rewardTokenFiatPrice: HERA_PRICE,
    _depositTokenFiatPrice: TOP_PRICE,
    _DEPOSIT_TOKEN_CONTRACT_ADDRESS: GafinConfig.TOP_ADDRESS,
    _DEPOSIT_TOKEN_ABI: TOP_SMC_ABI,
  });

  /** @initializing pool*/
  pool1.init();
  pool2.init();
  pool3.init();

  /** @loggingInfo */
  console.log(pool1.APR);
  console.log(pool2.APR);
  console.log(pool3.APR);

  return {
    singlePools: [pool1, pool2, pool3],
  };
};

export default useFetchFarmingInfo;
