import Web3 from "web3";
import GafinCrypto from "./GafinCrypto";
interface ITokenInfo {
  tokenDeposit: {
    name: string;
    fiatPrice: number;
    ADDRESS: string;
    ABI: unknown;
  };
  tokenReward: {
    name: string;
    fiatPrice: number;
  };
}
export default class PoolSingle {
  private poolData: any;
  private poolStartTime = 0;
  private poolEndTime = 0;
  private rewardPerSec = 0;
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

  constructor({
    _poolData,
    _tokenInfo,
  }: {
    _poolData: any;
    _tokenInfo: ITokenInfo;
  }) {
    this.poolData = _poolData;
    this.tokenInfo = {
      tokenDeposit: {
        name: _tokenInfo.tokenDeposit.name,
        fiatPrice: _tokenInfo.tokenDeposit.fiatPrice,
        ADDRESS: _tokenInfo.tokenDeposit.ADDRESS,
        ABI: _tokenInfo.tokenDeposit.ABI,
      },
      tokenReward: {
        name: _tokenInfo.tokenReward.name,
        fiatPrice: _tokenInfo.tokenReward.fiatPrice,
      },
    };
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
    const TOTAL_REWARD_FIAT =
      this.totalReward * this.tokenInfo.tokenReward.fiatPrice;
    const TOTAL_DEPOSIT_FIAT =
      this.totalDeposit * this.tokenInfo.tokenDeposit.fiatPrice;

    /** @calculating APR */
    const TOTAL_DAY = (this.poolEndTime - this.poolStartTime) / 86400;
    console.log({ TOTAL_DAY, TOTAL_REWARD_FIAT, TOTAL_DEPOSIT_FIAT });
    this.APR = (TOTAL_REWARD_FIAT * 365) / (TOTAL_DEPOSIT_FIAT * TOTAL_DAY);
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
