import Web3 from "web3";
import GafinConfig from "@/constant/config/index";
import FARMING_SMC_ABI from "@/constant/abi/FarmingContract.abi.json";
import STAKING_SMC_ABI from "@/constant/abi/StakingContract.abi.json";
import TOP_SMC_ABI from "@/constant/abi/TopContract.abi.json";
import LP_ABI from "@/constant/abi/LpContract.abi.json";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import axios from "axios";
import PoolSingle from "./SinglePool";
import PoolLp from "./LpPool";
import PoolStaking from "./StakingPool";

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
      ABI: LP_ABI,
    },
    tokenReward: {
      name: "TOP",
    },
  },
});

const pool1Staking = new PoolStaking({
  _poolId: 0,
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

const pool2Staking = new PoolStaking({
  _poolId: 1,
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

const pool3Staking = new PoolStaking({
  _poolId: 2,
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

const pool4Staking = new PoolStaking({
  _poolId: 3,
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

const pool5Staking = new PoolStaking({
  _poolId: 4,
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

const pool6Staking = new PoolStaking({
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

const pool7Staking = new PoolStaking({
  _poolId: 6,
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
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [4],
        },
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [5],
        },
        {
          reference: "getPoolInfo1",
          methodName: "getPoolInfo",
          methodParameters: [6],
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

  /** @initializing pools*/
  await pool1.calculate();
  await pool2.calculate();
  await pool1Staking.calculate();
  await pool2Staking.calculate();
  await pool3Staking.calculate();
  await pool4Staking.calculate();
  await pool5Staking.calculate();
  await pool6Staking.calculate();
  await pool7Staking.calculate();

  /** @loggingInfo pools*/
  // console.log({ pool1: pool1.APR, pool2: pool2.APR });

  return {
    pools: [pool1, pool2],
    poolsStaking: [
      pool1Staking,
      pool2Staking,
      pool3Staking,
      pool4Staking,
      pool5Staking,
      pool6Staking,
      pool7Staking,
    ],
  };
};

export default useFetchFarmingInfo;
