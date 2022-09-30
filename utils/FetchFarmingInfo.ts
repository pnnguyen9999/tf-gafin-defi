import Web3 from "web3";
import GafinConfig from "@/constant/config/index";
import FARMING_SMC_ABI from "@/constant/abi/FarmingContract.abi.json";
import STAKING_SMC_ABI from "@/constant/abi/StakingContract.abi.json";

import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import axios from "axios";
import PoolSingle from "./SinglePool";
import PoolLp from "./LpPool";
import PoolStaking from "./StakingPool";
import Vue from "vue";
import EventBus from "~/event/EventBus";
import {
  pool1,
  pool2,
  pool3,
  pool4,
  pool1Staking,
  pool2Staking,
  pool3Staking,
  pool4Staking,
  pool5Staking,
  pool6Staking,
  pool7Staking,
  pool8Staking,
} from "~/pools/pools";
export interface FarmingInfoData {
  pools: PoolSingle[];
  poolsStaking: PoolStaking[];
}
enum PoolNumber {
  POOL1 = 0,
  POOL2 = 1,
}
const multicall = new Multicall({
  nodeUrl: GafinConfig.BSC_RPC,
  tryAggregate: true,
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
        {
          reference: "getPoolInfo3",
          methodName: "getPoolInfo",
          methodParameters: [6],
        },
        {
          reference: "getPoolInfo4",
          methodName: "getPoolInfo",
          methodParameters: [7],
        },
      ],
    },
    {
      reference: "SMC_CONTRACT_STAKING",
      contractAddress: GafinConfig.STAKING_CONTRACT_ADDRESS,
      abi: STAKING_SMC_ABI,
      calls: [
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [0],
        },
        {
          reference: "getPoolInfo2",
          methodName: "getPoolInfo",
          methodParameters: [1],
        },
        {
          reference: "getPoolInfo3",
          methodName: "getPoolInfo",
          methodParameters: [2],
        },
        {
          reference: "getPoolInfo4",
          methodName: "getPoolInfo",
          methodParameters: [3],
        },
        {
          reference: "getPoolInfo5",
          methodName: "getPoolInfo",
          methodParameters: [4],
        },
        {
          reference: "getPoolInfo6",
          methodName: "getPoolInfo",
          methodParameters: [5],
        },
        {
          reference: "getPoolInfo7",
          methodName: "getPoolInfo",
          methodParameters: [6],
        },
        {
          reference: "getPoolInfo8",
          methodName: "getPoolInfo",
          methodParameters: [7],
        },
      ],
    },
  ];
  const results: ContractCallResults = await multicall.call(
    contractCallContext
  );
  console.log(results);
  const INFO_POOL1 =
    results.results.SMC_CONTRACT.callsReturnContext[PoolNumber.POOL1]
      .returnValues;

  const INFO_POOL2 =
    results.results.SMC_CONTRACT.callsReturnContext[PoolNumber.POOL2]
      .returnValues;

  const INFO_POOL3 =
    results.results.SMC_CONTRACT.callsReturnContext[2].returnValues;

  const INFO_POOL4 =
    results.results.SMC_CONTRACT.callsReturnContext[3].returnValues;

  const INFO_POOL1_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[0].returnValues;
  const INFO_POOL2_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[1].returnValues;
  const INFO_POOL3_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[2].returnValues;
  const INFO_POOL4_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[3].returnValues;
  const INFO_POOL5_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[4].returnValues;
  const INFO_POOL6_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[5].returnValues;
  const INFO_POOL7_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[6].returnValues;
  const INFO_POOL8_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[7].returnValues;
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
  await pool3.updateRealTimeInfo({
    _poolData: INFO_POOL3,
  });
  await pool4.updateRealTimeInfo({
    _poolData: INFO_POOL4,
  });
  await pool1Staking.updateRealTimeInfo({
    _poolData: INFO_POOL1_STAKING,
  });
  await pool2Staking.updateRealTimeInfo({
    _poolData: INFO_POOL2_STAKING,
  });
  await pool3Staking.updateRealTimeInfo({
    _poolData: INFO_POOL3_STAKING,
  });
  await pool4Staking.updateRealTimeInfo({
    _poolData: INFO_POOL4_STAKING,
  });
  await pool5Staking.updateRealTimeInfo({
    _poolData: INFO_POOL5_STAKING,
  });
  await pool6Staking.updateRealTimeInfo({
    _poolData: INFO_POOL6_STAKING,
  });
  await pool7Staking.updateRealTimeInfo({
    _poolData: INFO_POOL7_STAKING,
  });
  await pool8Staking.updateRealTimeInfo({
    _poolData: INFO_POOL8_STAKING,
  });

  /** @initializing pools*/
  await pool1.calculate();
  await pool2.calculate();
  await pool3.calculate();
  await pool4.calculate();
  await pool1Staking.calculate();
  await pool2Staking.calculate();
  await pool3Staking.calculate();
  await pool4Staking.calculate();
  await pool5Staking.calculate();
  await pool6Staking.calculate();
  await pool7Staking.calculate();
  await pool8Staking.calculate();

  /** @loggingInfo pools*/
  // console.log({ pool1: pool1.APR, pool2: pool2.APR });

  EventBus.$emit("fetching-completed");

  return {
    pools: [pool1, pool2, pool3, pool4],
    poolsStaking: [
      pool1Staking,
      pool2Staking,
      pool3Staking,
      pool4Staking,
      pool5Staking,
      pool6Staking,
      pool7Staking,
      pool8Staking,
    ],
  };
};

export default useFetchFarmingInfo;
