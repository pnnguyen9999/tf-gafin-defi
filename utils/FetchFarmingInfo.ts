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
import PoolLp from "./LpPool";

export interface FarmingInfoData {
  singlePools: PoolSingle[];
}
enum PoolNumber {
  POOL1 = 0,
  POOL2 = 1,
}
const multicall = new Multicall({
  nodeUrl: GafinConfig.BSC_RPC,
  tryAggregate: true,
});

/** @newPoolInstance */
const pool1 = new PoolSingle({
  _poolId: 5,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP",
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "TOP",
    },
  },
});

const pool2 = new PoolLp({
  _poolId: 4,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP / WBNB",
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "WBNB",
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
          methodParameters: [5],
        },
        {
          reference: "getPoolInfo2",
          methodName: "getPoolInfo",
          methodParameters: [4],
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

  /**
   * @poolCalculating -----------
   */

  /** @updateDataRealTime pools*/
  await pool1.updateRealTimeInfo({
    _poolData: INFO_POOL1,
  });
  await pool2.updateRealTimeInfo({
    _poolData: INFO_POOL2,
  });

  /** @initializing pools*/
  await pool1.calculate();
  await pool2.calculate();

  /** @loggingInfo pools*/
  console.log({ pool1: pool1.APR, pool2: pool2.APR });

  return {
    singlePools: [pool1, pool2],
  };
};

export default useFetchFarmingInfo;
