import axios from "axios";
import Web3 from "web3";
import GafinConfig from "~/constant/config";
import PoolSingle, { ITokenInfo } from "./SinglePool";
import LP_ABI from "@/constant/abi/LpContract.abi.json";

export default class PoolLp extends PoolSingle {
  private token0Fiat = 0;
  private token1Fiat = 0;
  private token0Reserve = 0;
  private token1Reserve = 0;
  private totalSupplyContractFarmLP = 0;
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
  public async updateRealTimeInfo({ _poolData }: { _poolData: any }) {
    this.poolData = _poolData;
    this.tokenInfo.tokenDeposit.ADDRESS = await this.poolData[0];
    this.tokenInfo.tokenReward.ADDRESS = await this.poolData[1];

    /** @getEachTokenInContract contractToken0 contractToken1 */
    const web3 = new Web3(GafinConfig.BSC_RPC);
    let contractLP = new web3.eth.Contract(
      LP_ABI as any,
      this.tokenInfo.tokenDeposit.ADDRESS
    );
    this.totalSupplyContractFarmLP = await contractLP.methods
      .totalSupply()
      .call();
    const reserveLP = await contractLP.methods.getReserves().call();
    this.token0Reserve = reserveLP[0];
    this.token1Reserve = reserveLP[1];
    const token0Address = await contractLP.methods.token0().call();
    const token1Address = await contractLP.methods.token1().call();

    /** @getFiatPrice Token0 Token1 */
    this.token0Fiat = await axios
      .get(`https://api.pancakeswap.info/api/v2/tokens/${token0Address}`)
      .then((res) => {
        return res.data.data.price;
      });

    this.token1Fiat = await axios
      .get(`https://api.pancakeswap.info/api/v2/tokens/${token1Address}`)
      .then((res) => {
        return res.data.data.price;
      });

    console.log({ token0Fiat: this.token0Fiat, token1Fiat: this.token1Fiat });

    /** @getFiatPrice Deposit */
    this.tokenInfo.tokenReward.fiatPrice = await axios
      .get(
        `https://api.pancakeswap.info/api/v2/tokens/${this.tokenInfo.tokenReward.ADDRESS}`
      )
      .then((res) => {
        return res.data.data.price;
      });
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

    const totalDepositToken0 =
      (this.token0Reserve * this.totalDeposit) / this.totalSupplyContractFarmLP;
    const totalDepositToken1 =
      (this.token1Reserve * this.totalDeposit) / this.totalSupplyContractFarmLP;
    const liquidityLPFiat =
      totalDepositToken0 * this.token0Fiat +
      totalDepositToken1 * this.token1Fiat;
    this.liquidity = liquidityLPFiat;
    const TOTAL_REWARD_FIAT =
      this.totalReward * this.tokenInfo.tokenReward.fiatPrice;

    /** @calculate APR */
    const TOTAL_DAY = (this.poolEndTime - this.poolStartTime) / 86400;
    console.log({ TOTAL_DAY, TOTAL_REWARD_FIAT, liquidityLPFiat });
    this.APR = (TOTAL_REWARD_FIAT * 365) / (liquidityLPFiat * TOTAL_DAY);

    /** @reinitialize user info in pool to fetch reward info*/
    await this.initUserInfoInPool();
  }
}
