import PoolSingle from "~/utils/SinglePool";
import TOP_SMC_ABI from "@/constant/abi/TopContract.abi.json";
import LP_ABI from "@/constant/abi/LpContract.abi.json";
import PoolStaking from "~/utils/StakingPool";
import PoolLp from "~/utils/LpPool";
export interface PoolsExternalInfo {
  getCoinUrl: string;
  viewContract: string;
  pairInfo: string;
}
const poolExternalUrlInfo_FARM_TOP_TOP: PoolsExternalInfo = {
  getCoinUrl:
    "https://api.pancakeswap.info/api/v2/tokens/0x0A927Ab3B0F48826210Ad4A43A953277AA7da8f7",
  pairInfo: "",
  viewContract:
    "https://bscscan.com/address/0x6513be137c48f02ca2752ef947a3a4b89b2625fb",
};
const poolExternalUrlInfo_FARM_TOP_WBNB: PoolsExternalInfo = {
  getCoinUrl:
    "https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  pairInfo: "",
  viewContract:
    "https://bscscan.com/address/0x6513be137c48f02ca2752ef947a3a4b89b2625fb",
};
const poolExternalUrlInfo_STAKE_TOP_TOP: PoolsExternalInfo = {
  getCoinUrl:
    "https://api.pancakeswap.info/api/v2/tokens/0x0A927Ab3B0F48826210Ad4A43A953277AA7da8f7",
  pairInfo: "",
  viewContract:
    "https://bscscan.com/address/0x66ca0b85fbef88efbe8fb98fb2c9fd60c2431581#readContract",
};
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
  _externalUrlInfo: poolExternalUrlInfo_FARM_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_FARM_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_FARM_TOP_WBNB,
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
  _externalUrlInfo: poolExternalUrlInfo_FARM_TOP_WBNB,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
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
  _externalUrlInfo: poolExternalUrlInfo_STAKE_TOP_TOP,
});
