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
import PoolSingle from "./SinglePool";

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

/** @newPoolInstance */
const pool1 = new PoolSingle({
  _poolId: 1,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP",
      ADDRESS: GafinConfig.TOP_ADDRESS,
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "HERA",
    },
  },
});
const pool2 = new PoolSingle({
  _poolId: 2,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP",
      ADDRESS: GafinConfig.TOP_ADDRESS,
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "HERA",
    },
  },
});
const pool3 = new PoolSingle({
  _poolId: 3,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP",
      ADDRESS: GafinConfig.TOP_ADDRESS,
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "HERA",
    },
  },
});

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

  /** @updateDataRealTime pools*/
  pool1.updateRealTimeInfo({
    _poolData: INFO_POOL1,
    tokenDepositFiat: TOP_PRICE,
    tokenRewardFiat: HERA_PRICE,
  });
  pool2.updateRealTimeInfo({
    _poolData: INFO_POOL2,
    tokenDepositFiat: HERA_PRICE,
    tokenRewardFiat: TOP_PRICE,
  });
  pool3.updateRealTimeInfo({
    _poolData: INFO_POOL3,
    tokenDepositFiat: TOP_PRICE,
    tokenRewardFiat: HERA_PRICE,
  });

  /** @initializing pools*/
  pool1.calculate();
  pool2.calculate();
  pool3.calculate();

  /** @loggingInfo pools*/
  console.log(pool1.APR);
  console.log(pool2.APR);
  console.log(pool3.APR);

  return {
    singlePools: [pool1, pool2, pool3],
  };
};

export default useFetchFarmingInfo;
