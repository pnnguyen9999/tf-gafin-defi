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
import { poolFarming_HERA_BUSD, poolStaking_HERA } from "~/pools/pools";
export interface FarmingInfoData {
  pools: PoolSingle[];
  poolsStaking: PoolStaking[];
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
          reference: "getPoolInfo1Farming",
          methodName: "getPoolInfo",
          methodParameters: [1],
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
          methodParameters: [1],
        },
      ],
    },
  ];
  const results: ContractCallResults = await multicall.call(
    contractCallContext
  );
  console.log(results);
  const INFO_POOL_HERA_STAKING =
    results.results.SMC_CONTRACT_STAKING.callsReturnContext[0].returnValues;
  const INFO_POOL_HERA_BUSD =
    results.results.SMC_CONTRACT.callsReturnContext[0].returnValues;
  /**
   * @poolCalculating -----------
   */

  /** @updateDataRealTime pools*/
  await poolStaking_HERA.updateRealTimeInfo({
    _poolData: INFO_POOL_HERA_STAKING,
  });
  await poolFarming_HERA_BUSD.updateRealTimeInfo({
    _poolData: INFO_POOL_HERA_BUSD,
  });

  /** @initializing pools*/
  await poolStaking_HERA.calculate();
  await poolFarming_HERA_BUSD.calculate();

  /** @loggingInfo pools*/
  // console.log({ pool1: pool1.APR, pool2: pool2.APR });

  EventBus.$emit("fetching-completed");

  return {
    pools: [poolFarming_HERA_BUSD],
    poolsStaking: [poolStaking_HERA],
  };
};

export default useFetchFarmingInfo;
