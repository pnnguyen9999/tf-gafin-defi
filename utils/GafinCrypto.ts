import Web3 from "web3";
import GafinConfig from "@/constant/config/index";
import FARMING_SMC_ABI from "@/constant/abi/FarmingContract.abi.json";
import STAKING_SMC_ABI from "@/constant/abi/StakingContract.abi.json";
import BigNumber from "bignumber.js";
import Vue from "vue";

class GafinCryptoClass {
  public web3: Web3;
  public address: string;
  public currentBalance: string;
  constructor() {
    this.web3 = null as unknown as Web3;
    this.address = null as unknown as string;
    this.currentBalance = null as unknown as string;
  }

  reset() {
    this.web3 = null as unknown as Web3;
    this.address = null as unknown as string;
    this.currentBalance = null as unknown as string;
  }

  initInfo = async () => {
    this.web3 = new Web3(window.ethereum);
    this.address = (await this.web3.eth.requestAccounts())[0];
    this.currentBalance = Web3.utils.fromWei(
      `${await this.web3.eth.getBalance(this.address)}`,
      "ether"
    );
    Vue.$toast.open("Wallet connected !");
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
    } else {
      Vue.$toast.error("Your browser does not support ethereum env");
    }
  };

  getAllowance = async ({
    SMC_ADDRESS,
    SMC_ABI,
  }: {
    SMC_ADDRESS: string;
    SMC_ABI: any;
  }) => {
    const contract = new this.web3.eth.Contract(SMC_ABI, SMC_ADDRESS);
    const contractAllowance = await contract.methods
      .allowance(this.address, GafinConfig.FARMING_CONTRACT_ADDRESS)
      .call();
    console.log(contractAllowance != 0);
    return contractAllowance != 0;
  };

  getAllowanceStaking = async ({
    SMC_ADDRESS,
    SMC_ABI,
  }: {
    SMC_ADDRESS: string;
    SMC_ABI: any;
  }) => {
    const contract = new this.web3.eth.Contract(SMC_ABI, SMC_ADDRESS);
    const contractAllowance = await contract.methods
      .allowance(this.address, GafinConfig.STAKING_CONTRACT_ADDRESS)
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

  approveContractStaking = async ({
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
      .approve(GafinConfig.STAKING_CONTRACT_ADDRESS, totalSupply)
      .send({ from: this.address })
      .on("transactionHash", (hash: any) => {
        callback({
          status: "EXECUTE_APPROVE_SUBMIT",
          txID: hash,
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

  getTokenBalance = async ({
    SMC_ADDRESS,
    SMC_ABI,
  }: {
    SMC_ADDRESS: string;
    SMC_ABI: any;
  }) => {
    const contract = new this.web3.eth.Contract(SMC_ABI, SMC_ADDRESS);
    const balance = new BigNumber(
      await contract.methods.balanceOf(this.address).call()
    );
    return Number(this.web3.utils.fromWei(`${balance.toFixed()}`, "ether"));
  };

  getHarvestAmountStaking = async ({ poolId }: { poolId: number }) => {
    const contract = new this.web3.eth.Contract(
      STAKING_SMC_ABI as any,
      GafinConfig.STAKING_CONTRACT_ADDRESS
    );
    console.log(this.address);
    const reward = new BigNumber(
      await contract.methods
        .getUserDividendsHarvest(this.address, poolId)
        .call()
    );
    return Number(this.web3.utils.fromWei(`${reward.toFixed()}`, "ether"));
  };

  getHarvestAmount = async ({ poolId }: { poolId: number }) => {
    const contract = new this.web3.eth.Contract(
      FARMING_SMC_ABI as any,
      GafinConfig.FARMING_CONTRACT_ADDRESS
    );
    const reward = new BigNumber(
      await contract.methods.calculateUserReward(poolId, this.address).call()
    );
    return Number(this.web3.utils.fromWei(`${reward.toFixed()}`, "ether"));
  };

  harvestStaking = async ({
    poolId,
    callback,
  }: {
    poolId: number;
    callback: any;
  }) => {
    const contract = new this.web3.eth.Contract(
      STAKING_SMC_ABI as any,
      GafinConfig.STAKING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .harvest(poolId)
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_HARVEST_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_HARVEST_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_HARVEST_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_HARVEST_FAIL", error: err.message });
      });
    return executeResult;
  };

  harvest = async ({ poolId, callback }: { poolId: number; callback: any }) => {
    const contract = new this.web3.eth.Contract(
      FARMING_SMC_ABI as any,
      GafinConfig.FARMING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .harvest(poolId)
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_HARVEST_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_HARVEST_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_HARVEST_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_HARVEST_FAIL", error: err.message });
      });
    return executeResult;
  };

  investStaking = async ({
    poolId,
    amount,
    callback,
  }: {
    poolId: number;
    amount: any;
    callback: any;
  }) => {
    console.log({ poolId, amount });
    const contract = new this.web3.eth.Contract(
      STAKING_SMC_ABI as any,
      GafinConfig.STAKING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .invest(poolId, this.web3.utils.toWei(amount.toString(), "ether"))
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_STAKE_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_STAKE_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_STAKE_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_STAKE_FAIL", error: err.message });
      });
    return executeResult;
  };

  stake = async ({
    poolId,
    amount,
    callback,
  }: {
    poolId: number;
    amount: any;
    callback: any;
  }) => {
    console.log({ poolId, amount });
    const contract = new this.web3.eth.Contract(
      FARMING_SMC_ABI as any,
      GafinConfig.FARMING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .stake(poolId, this.web3.utils.toWei(amount.toString(), "ether"))
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_STAKE_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_STAKE_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_STAKE_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_STAKE_FAIL", error: err.message });
      });
    return executeResult;
  };

  unStake = async ({ poolId, callback }: { poolId: number; callback: any }) => {
    console.log({ poolId });
    const contract = new this.web3.eth.Contract(
      FARMING_SMC_ABI as any,
      GafinConfig.FARMING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .unstake(poolId)
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_UN_STAKE_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_UN_STAKE_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_UN_STAKE_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_UN_STAKE_FAIL", error: err.message });
      });
    return executeResult;
  };

  unStakeStaking = async ({
    poolId,
    callback,
  }: {
    poolId: number;
    callback: any;
  }) => {
    console.log({ poolId });
    const contract = new this.web3.eth.Contract(
      STAKING_SMC_ABI as any,
      GafinConfig.STAKING_CONTRACT_ADDRESS
    );
    const executeResult = await contract.methods
      .unStake(poolId)
      .send({
        from: this.address,
      })
      .on("transactionHash", (hash: any) => {
        console.log("transactionHash", hash);
        callback({
          status: "EXECUTE_UN_STAKE_SUBMIT",
          txID: hash,
        });
        console.log("transactionHash EXECUTE_UN_STAKE_SUBMIT", hash);
      })
      .then((receipt: any) => {
        console.log("receipt", receipt);
        if (receipt.status === true) {
          callback({
            status: "EXECUTE_UN_STAKE_SUCCESS",
            txID: receipt.transactionHash,
            gasUsed: receipt.gasUsed,
          });
        }
      })
      .catch((err: any) => {
        console.log(err);
        callback({ status: "EXECUTE_UN_STAKE_FAIL", error: err.message });
      });
    return executeResult;
  };
}
const GafinCrypto = new GafinCryptoClass();
export default GafinCrypto;
