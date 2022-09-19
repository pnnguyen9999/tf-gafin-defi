import Web3 from "web3";
import GafinConfig from "@/constant/config/index";

class GafinCryptoClass {
  public web3: Web3;
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
          await this.initInfo();
        } catch (err) {
          console.log(err);
          return false;
        }
      } else {
        /* -> right chain ID */
        /* -> set web3Info */
        this.web3 = new Web3(window.ethereum);
        await this.initInfo();
      }
    }
  };
  getAllowance = async ({
    SMC_ADDRESS,
    SMC_ABI,
  }: {
    SMC_ADDRESS: string;
    SMC_ABI: any;
  }) => {
    console.log({ SMC_ADDRESS, SMC_ABI });
    const contract = new this.web3.eth.Contract(SMC_ABI, SMC_ADDRESS);
    const contractAllowance = await contract.methods
      .allowance(this.address, GafinConfig.FARMING_CONTRACT_ADDRESS)
      .call();
    console.log(contractAllowance != 0);
    return contractAllowance != 0;
  };
  approveContract = async ({
    SMC_ADDRESS,
    SMC_ABI,
    callback,
  }: {
    SMC_ADDRESS: string;
    SMC_ABI: any;
    callback: any;
  }) => {
    const contract = new this.web3.eth.Contract(SMC_ABI, SMC_ADDRESS);
    const totalSupply = await contract.methods.totalSupply().call();
    const executeApproveResult = await contract.methods
      .approve(GafinConfig.FARMING_CONTRACT_ADDRESS, totalSupply)
      .send({ from: this.address })
      .on("transactionHash", (hash: any) => {
        callback({
          status: "EXECUTE_APPROVE_SUBMIT",
          txID: hash,
        });
      })
      .on("error", (error: any) => {
        callback({
          status: "EXECUTE_APPROVE_FAIL",
          error: error.message,
        });
      })
      .then(async (receipt: any) => {
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_APPROVE_SUCCESS",
            txID: receipt.transactionHash,
          });
        }
      })
      .catch((err: any) => {
        callback({ status: "EXECUTE_APPROVE_FAIL", error: err.message });
      });
    return executeApproveResult;
  };
}
const GafinCrypto = new GafinCryptoClass();
export default GafinCrypto;
