import PoolSingle from "~/utils/SinglePool";
import TOP_SMC_ABI from "@/constant/abi/TopContract.abi.json";
import LP_ABI from "@/constant/abi/LpContract.abi.json";
import PoolStaking from "~/utils/StakingPool";
import PoolLp from "~/utils/LpPool";
/** @newPoolInstance */
export const pool1 = new PoolSingle({
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

export const pool3 = new PoolSingle({
  _poolId: 6,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP",
      ABI: LP_ABI,
    },
    tokenReward: {
      name: "TOP",
    },
  },
});

export const pool4 = new PoolLp({
  _poolId: 7,
  _tokenInfo: {
    tokenDeposit: {
      name: "TOP / WBNB",
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "TOP",
    },
  },
});

export const pool2 = new PoolLp({
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

export const pool1Staking = new PoolStaking({
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

export const pool2Staking = new PoolStaking({
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

export const pool3Staking = new PoolStaking({
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

export const pool4Staking = new PoolStaking({
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

export const pool5Staking = new PoolStaking({
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

export const pool6Staking = new PoolStaking({
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

export const pool7Staking = new PoolStaking({
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

export const pool8Staking = new PoolStaking({
  _poolId: 7,
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
