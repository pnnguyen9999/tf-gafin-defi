import Web3 from "web3";
import GafinConfig from "@/constant/config/index";

class GafinCryptoClass {
  private web3: Web3;
  public address: string;
  public currentBalance: string;
  constructor() {
    this.web3 = null as unknown as Web3;
    this.address = null as unknown as string;
    this.currentBalance = null as unknown as string;
  }
  initInfo = async () => {
    this.web3 = new Web3(window.ethereum);
    this.address = (await this.web3.eth.getAccounts())[0];
    this.currentBalance = Web3.utils.fromWei(
      `${await this.web3.eth.getBalance(this.address)}`,
      "ether"
    );
  };
  connect = async () => {
    if (window.ethereum) {
      if (window.ethereum.networkVersion !== GafinConfig.CHAIN_ID) {
        /* -> wrong chain ID, call wallet to change network */
        console.log("wrong chain");
        const chainID_HEX = await Web3.utils.numberToHex(GafinConfig.CHAIN_ID);
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID_HEX }],
          });
          /* -> set web3Info */
          this.initInfo();
        } catch (err) {
          console.log(err);
          return false;
        }
      } else {
        /* -> right chain ID */
        /* -> set web3Info */
        this.web3 = new Web3(window.ethereum);
        this.initInfo();
      }
    }
  };
}
const GafinCrypto = new GafinCryptoClass();
export default GafinCrypto;
