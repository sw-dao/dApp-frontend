import { web3 } from "../../bin/www";
import { toChecksumAddress, AbiItem } from "web3-utils";
// import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { SwappableTokens, TokenProducts } from "../../settings";
import {
  AssetTransfersCategory,
  AssetTransfersParams,
  AssetTransfersResult,
  createAlchemyWeb3,
} from "@alch/alchemy-web3";
import { Log } from "web3-core";
import { ALL_ADDRESSES, COMMON_DECIMALS, Transaction } from "./exports";
import portfolioCharts from "./portfolioChart";

const callGetAssetTransfers = async (
  a: string | undefined,
  b: string | undefined
) => {
  return await web3.alchemy.getAssetTransfers({
    maxCount: 1000,
    excludeZeroValue: false,
    fromBlock: "0x0",
    fromAddress: a,
    toAddress: b,

    contractAddresses: Object.values(TokenProducts["0x89"]),
    category: [AssetTransfersCategory.ERC20],
  });
};

const getDecimals = async (address: string) => {
  let decimals: number = 0;
  for (const i of Object.keys(COMMON_DECIMALS)) {
    if (decimals === 0 && toChecksumAddress(i) === address) {
      decimals = COMMON_DECIMALS[i.toLowerCase()];
    }
    if (decimals !== 0) {
      break;
    }
  }
  if (decimals === 0) {
    const tokenContract = new web3.eth.Contract(ERC20ABI as AbiItem[], address);
    decimals = parseInt(await tokenContract.methods.decimals().call(), 10);
  }

  return decimals;
};
const getSymbol = async (address: string) => {
  let symbol: string = "NaN";
  for (const i of Object.keys(ALL_ADDRESSES)) {
    if (
      symbol === "NaN" &&
      toChecksumAddress(ALL_ADDRESSES[i.toLowerCase()]) === address
    ) {
      symbol = i;
    }
    if (symbol !== "NaN") {
      break;
    }
  }
  if (symbol === "NaN") {
    const tokenContract = new web3.eth.Contract(ERC20ABI as AbiItem[], address);
    symbol = await tokenContract.methods.symbol().call();
  }
  return symbol;
};

const getTxHistoryMain = async (address: string) => {
  const res1 = await callGetAssetTransfers(address, undefined);
  const res2 = await callGetAssetTransfers(undefined, address);
  const res: AssetTransfersResult[] = [];
  for (const tr of res1.transfers) {
    res.push(tr);
  }
  for (const tr of res2.transfers) {
    let temp = false;
    for (const i of res) {
      if (i.hash === tr.hash) {
        temp = true;
      }
    }
    if (!temp) {
      res.push(tr);
    }
  }
  const masterObj: Transaction[] = [];
  const promises = [];
  console.log("Getting Total Transactions: ", res.length);
  for (const i of res) {
    promises.push(mainLoop(i, address, masterObj));
  }
  return await Promise.all(promises)
    .then(() => {
      //   console.log(masterObj);
      return masterObj;
    })
    .catch((e) => console.log(e));
  // console.log(masterObj);
  // return masterObj;
};

const mainLoop = async (
  i: AssetTransfersResult,
  address: string,
  masterObj: any[]
) => {
  // for (const i of res) {
  // const i = res[t];
  const paddedAddress = web3.utils.padLeft(address, 64);
  //   console.log(i.hash);
  const tx = await web3.eth.getTransactionReceipt(i.hash);
  const obj: Transaction = {
    timestamp: 0,
    fromSymbol: "",
    fromAmount: 0,
    fromAddress: "",
    fromDecimals: 0,
    toSymbol: "",
    toAmount: 0,
    toAddress: "",
    toDecimals: 0,
    transactionHash: "",
    blockNumber: 0,
  };
  for (const logs of tx.logs) {
    //   const logs = tx.logs[l];
    // 0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65
    if (
      logs.topics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    ) {
      if (logs.topics.length === 3) {
        //   console.log(web3.utils.leftPad(logs.topics[1], 40));
        //   console.log(typeof paddedAddress);
        address = toChecksumAddress(address);
        const address1 = toChecksumAddress("0x" + logs.topics[1].slice(26));
        const address2 = toChecksumAddress("0x" + logs.topics[2].slice(26));
        await processTxTopic(logs, address, address1, address2, obj);
      }
    }
    // if (
    //   logs.topics[0] ===
    //   "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65"
    // ) {
    //   const decimals = await getDecimals(logs.address);
    //   obj.toDecimals = decimals;
    //   obj.toAmount =
    //     parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
    //   obj.toSymbol = await getSymbol(logs.address);
    //   obj.toAddress = logs.address;
    // }
    if (
      logs.topics[0] ===
      "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
    ) {
      const decimals = await getDecimals(logs.address);
      obj.fromDecimals = decimals;
      obj.fromAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
      obj.fromSymbol = await getSymbol(logs.address);
      obj.fromAddress = logs.address;
    }
    //   if (
    //     logs.topics[0] ===
    //     "0x44b3b16472a909f781f712646232271ffd156fff642d4895b700146a40462601"
    //   ) {
    //   }
  }
  obj.transactionHash = tx.transactionHash;
  let ts = (await web3.eth.getBlock(tx.blockNumber)).timestamp;
  if (typeof ts === "string") {
    ts = parseInt(ts, 10);
  }
  obj.timestamp = ts;
  obj.blockNumber = tx.blockNumber;
  masterObj.push(obj);
  // console.log(obj);
  // return obj;
  // }
};

const processTxTopic = async (
  logs: Log,
  address: string,
  address1: string,
  address2: string,
  obj: Transaction
) => {
  if (address1 === address) {
    if (obj.fromSymbol === "") {
      obj.fromSymbol = await getSymbol(logs.address);
      const decimals = await getDecimals(logs.address);
      obj.fromDecimals = decimals;
      obj.fromAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
      obj.fromAddress = logs.address;
    }
  }

  if (address2 === address) {
    if (
      obj.toSymbol === "" ||
      address1 !==
        toChecksumAddress("0x1c0c05a2aa31692e5dc9511b04f651db9e4d8320")
    ) {
      obj.toSymbol = await getSymbol(logs.address);
      const decimals = await getDecimals(logs.address);
      obj.toDecimals = decimals;
      obj.toAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
      obj.toAddress = logs.address;
    }
  }
};

const getTxHistory = async (address: string) => {
  const txHistory = await getTxHistoryMain(address);
  if (txHistory) {
    const charts = await portfolioCharts(txHistory);
    return { txHistory, charts };
  }
  return;
};

export default getTxHistory;
