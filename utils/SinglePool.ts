import Vue from "vue";
import Web3 from "web3";
import GafinCrypto from "./GafinCrypto";
interface ITokenInfo {
  tokenDeposit: {
    name: string;
    ADDRESS: string;
    ABI: unknown;
    fiatPrice?: any;
  };
  tokenReward: {
    name: string;
    fiatPrice?: any;
  };
}
/** get stake token balance của pool từ hàm get bên class wallet gafin crypto */
export default class PoolSingle {
  private poolId = null as unknown as number;
  private poolData: any;
  private poolStartTime = 0;
  private poolEndTime = 0;
  private rewardPerSec = 0;
  private totalReward = 0;
  private totalDeposit = 0;
  public tokenBalance = 0;
  /**
   * @APR -> chỉ số APR của pool
   * @DEPOSIT_TOKEN_CONTRACT_ADDRESS -> trả về address của token deposit
   * @DEPOSIT_TOKEN_ABI -> trả về ABI JSON của token deposit
   */
  public APR = 0;
  public allowance = false;
  public allowanceLoading = false;
  public harvestAmount = 0;
  /* return pool info */
  public tokenInfo: ITokenInfo = {
    tokenDeposit: {
      name: "",
      fiatPrice: 0,
      ADDRESS: "",
      ABI: null as unknown,
    },
    tokenReward: {
      name: "",
      fiatPrice: 0,
    },
  };

  public async updateRealTimeInfo({
    _poolData,
    tokenDepositFiat,
    tokenRewardFiat,
  }: {
    _poolData: any;
    tokenDepositFiat: number;
    tokenRewardFiat: number;
  }) {
    this.poolData = _poolData;
    this.tokenInfo.tokenDeposit.fiatPrice = tokenDepositFiat;
    this.tokenInfo.tokenReward.fiatPrice = tokenRewardFiat;
  }

  constructor({
    _poolId,
    _tokenInfo,
  }: {
    _poolId: number;
    _tokenInfo: ITokenInfo;
  }) {
    this.poolId = _poolId;
    this.tokenInfo = {
      tokenDeposit: {
        name: _tokenInfo.tokenDeposit.name,
        ADDRESS: _tokenInfo.tokenDeposit.ADDRESS,
        ABI: _tokenInfo.tokenDeposit.ABI,
      },
      tokenReward: {
        name: _tokenInfo.tokenReward.name,
      },
    };
  }

  public async getTokenBalance() {
    this.tokenBalance = await GafinCrypto.getTokenBalance({
      SMC_ABI: this.tokenInfo.tokenDeposit.ABI,
      SMC_ADDRESS: this.tokenInfo.tokenDeposit.ADDRESS,
    });
  }

  public async initUserInfoInPool() {
    if (GafinCrypto.address) {
      console.log("initialize pool's user info");
      await this.getTokenBalance();
      this.harvestAmount = Number(
        (await GafinCrypto.getHarvestAmount({ poolId: this.poolId })).toFixed(8)
      );
    }
  }

  public async calculate() {
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
    const TOTAL_REWARD_FIAT =
      this.totalReward * this.tokenInfo.tokenReward.fiatPrice;
    const TOTAL_DEPOSIT_FIAT =
      this.totalDeposit * this.tokenInfo.tokenDeposit.fiatPrice;

    /** @calculate APR */
    const TOTAL_DAY = (this.poolEndTime - this.poolStartTime) / 86400;
    console.log({ TOTAL_DAY, TOTAL_REWARD_FIAT, TOTAL_DEPOSIT_FIAT });
    this.APR = (TOTAL_REWARD_FIAT * 365) / (TOTAL_DEPOSIT_FIAT * TOTAL_DAY);

    /** @reinitialize user info in pool to fetch reward info*/
    await this.initUserInfoInPool();
  }

  public async checkAllowance() {
    this.allowance = await GafinCrypto.getAllowance({
      SMC_ADDRESS: this.tokenInfo.tokenDeposit.ADDRESS,
      SMC_ABI: this.tokenInfo.tokenDeposit.ABI,
    });
  }

  public async setAllowance() {
    this.allowanceLoading = true;
    await GafinCrypto.approveContract({
      SMC_ADDRESS: this.tokenInfo.tokenDeposit.ADDRESS,
      SMC_ABI: this.tokenInfo.tokenDeposit.ABI,
      callback: async (data: any) => {
        if (data.status === "EXECUTE_APPROVE_SUCCESS") {
          Vue.$toast.open("Approved !");
          this.allowance = true;
          this.allowanceLoading = false;
        } else if (data.status === "EXECUTE_APPROVE_FAIL") {
          Vue.$toast.error(`Approve token failed !`);
          this.allowanceLoading = false;
        }
      },
    });
    await this.initUserInfoInPool();
  }

  public async stake(amount: number) {
    await GafinCrypto.stake({
      poolId: this.poolId,
      amount,
      callback: async (data: any) => {
        if (data.status === "EXECUTE_STAKE_SUCCESS") {
          Vue.$toast.open("Stake success !");
          this.allowance = true;
          this.allowanceLoading = false;
        } else if (data.status === "EXECUTE_STAKE_FAIL") {
          Vue.$toast.error(`Stake failed !`);
          this.allowanceLoading = false;
        }
      },
    });
    await this.initUserInfoInPool();
  }

  public async unStake() {
    await GafinCrypto.unStake({
      poolId: this.poolId,
      callback: async (data: any) => {
        if (data.status === "EXECUTE_UN_STAKE_SUCCESS") {
          Vue.$toast.open("Withdraw success !");
          this.allowance = true;
          this.allowanceLoading = false;
        } else if (data.status === "EXECUTE_UN_STAKE_FAIL") {
          Vue.$toast.error(`Withdraw failed !`);
          this.allowanceLoading = false;
        }
      },
    });
    await this.initUserInfoInPool();
  }

  public async harvest() {
    await GafinCrypto.harvest({
      poolId: this.poolId,
      callback: async (data: any) => {
        if (data.status === "EXECUTE_HARVEST_SUCCESS") {
          Vue.$toast.open("Harvest success !");
        } else if (data.status === "EXECUTE_HARVEST_FAIL") {
          Vue.$toast.error(`Harvest failed !`);
        }
      },
    });
    await this.initUserInfoInPool();
  }
}
