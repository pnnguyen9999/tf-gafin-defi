import PoolSingle from "~/utils/SinglePool";
import TOP_SMC_ABI from "@/constant/abi/TopContract.abi.json";

import LP_ABI from "@/constant/abi/LpContract.abi.json";
import PoolStaking from "~/utils/StakingPool";
import PoolLp from "~/utils/LpPool";
import LpPool from "~/utils/LpPool";
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
const poolExternalUrlInfo_STAKE_HERA_HERA: PoolsExternalInfo = {
  getCoinUrl:
    "https://pancakeswap.finance/swap?outputCurrency=0x49c7295ff86eabf5bf58c6ebc858db4805738c01",
  pairInfo: "",
  viewContract:
    "https://bscscan.com/token/0x49c7295ff86eabf5bf58c6ebc858db4805738c01",
};

const poolExternalUrlInfo_FARMING_HERA_BUSD: PoolsExternalInfo = {
  getCoinUrl:
    "https://pancakeswap.finance/swap?outputCurrency=0x49c7295ff86eabf5bf58c6ebc858db4805738c01",
  pairInfo:
    "https://pancakeswap.finance/swap?outputCurrency=0x49c7295ff86eabf5bf58c6ebc858db4805738c01",
  viewContract:
    "https://bscscan.com/address/0xbcabbaa789fd1a503d139c857499e21b4909d69a",
};
/** @newPoolInstance */

export const poolStaking_HERA = new PoolStaking({
  _poolId: 1,
  _tokenInfo: {
    tokenDeposit: {
      name: "HERA",
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "HERA",
    },
  },
  _externalUrlInfo: poolExternalUrlInfo_STAKE_HERA_HERA,
});

export const poolFarming_HERA_BUSD = new LpPool({
  _poolId: 1,
  _tokenInfo: {
    tokenDeposit: {
      name: "HERA/BUSD LP",
      ABI: TOP_SMC_ABI,
    },
    tokenReward: {
      name: "HERA",
    },
  },
  _externalUrlInfo: poolExternalUrlInfo_FARMING_HERA_BUSD,
});
