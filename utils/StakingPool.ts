import axios from "axios";
import Web3 from "web3";
import GafinConfig from "~/constant/config";
import PoolSingle, { ITokenInfo } from "./SinglePool";
import LP_ABI from "@/constant/abi/LpContract.abi.json";
import GafinCrypto from "./GafinCrypto";
import Vue from "vue";

export default class PoolStaking extends PoolSingle {
  constructor({
    _poolId,
    _tokenInfo,
  }: {
    _poolId: number;
    _tokenInfo: ITokenInfo;
  }) {
    super({
      _poolId,
      _tokenInfo,
    });
  }

  public async initUserInfoInPool() {
    if (GafinCrypto.address) {
      console.log(
        `initialize pool's user info - ${this.tokenInfo.tokenDeposit.name}`
      );
      await this.getTokenBalance();
      this.harvestAmount = Number(
        (
          await GafinCrypto.getHarvestAmountStaking({ poolId: this.poolId })
        ).toFixed(8)
      );
    }
  }

  public async updateRealTimeInfo({ _poolData }: { _poolData: any }) {
    this.poolData = _poolData;
    this.tokenInfo.tokenDeposit.ADDRESS = await this.poolData[4];
    this.tokenInfo.tokenReward.ADDRESS = this.tokenInfo.tokenDeposit.ADDRESS;
    this.tokenInfo.tokenDeposit.fiatPrice =
      this.tokenInfo.tokenReward.fiatPrice = await axios
        .get(
          `https://api.pancakeswap.info/api/v2/tokens/${this.tokenInfo.tokenDeposit.ADDRESS}`
        )
        .then((res) => {
          return res.data.data.price;
        });
  }

  public async calculate() {
    this.poolEndTime = Web3.utils.hexToNumber(this.poolData[2].hex);
    this.APR = Number(Web3.utils.hexToNumber(this.poolData[7][0][0].hex)) / 100;
    this.liquidity = Number(Web3.utils.fromWei(this.poolData[3].hex, "ether"));
    // /** @reinitialize user info in pool to fetch reward info*/
    await this.initUserInfoInPool();
  }

  public async checkAllowance() {
    this.allowance = await GafinCrypto.getAllowanceStaking({
      SMC_ADDRESS: this.tokenInfo.tokenDeposit.ADDRESS,
      SMC_ABI: this.tokenInfo.tokenDeposit.ABI,
    });
  }

  public async setAllowance() {
    this.allowanceLoading = true;
    await GafinCrypto.approveContractStaking({
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
}
