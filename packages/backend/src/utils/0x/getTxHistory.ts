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

export interface Transaction {
  timestamp: string | number;
  fromSymbol: string;
  fromAmount: number;
  toSymbol: string;
  toAmount: number;
  transactionHash: string;
}

interface CommonDecimals {
  [addr: string]: string;
}
export const COMMON_DECIMALS: CommonDecimals = {
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": "18",
  "0xd6ca869a4ec9ed2c7e618062cdc45306d8dbbc14": "18",
  "0x3ad707da309f3845cd602059901e39c4dcd66473": "18",
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": "8",
  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": "18",
  "0xf287d97b6345bad3d88856b26fb7c0ab3f2c7976": "18",
  "0xe5417af564e4bfda1c483642db72007871397896": "18",
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7": "18",
  "0x831753dd7087cac61ab5644b308642cc1c33dc13": "18",
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff": "18",
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548": "18",
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344": "18",
  "0x07a79127182a1c303d11ecda951310ec1c2e1444": "18",
  "0xb87352b4c3eb9daed09cd4996dff85c122394912": "18",
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": "6",
  "0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb": "18",
  "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344": "18",
  "0x07A79127182a1c303d11eCDa951310EC1C2E1444": "18",
  "0xb87352B4C3EB9daEd09cD4996dFf85c122394912": "18",
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f": "18",
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421": "18",
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2": "18",
  "0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a": "18",
  "0x62135f85899d97aed95f4405d710208e68b99f39": "18",
  "0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b": "18",
  "0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568": "18",
  "0x3c0744E72abb3A312122c2118F01F9EE2EB79d43": "18",
  "0x330FF0aFE63f42eb478c92dA79B0ce0c69070183": "18",
  "0x4315C720Cad5aa41D7535902b58B015EEA6F97B0": "18",
  "0xDFdDd9811796F72bA32a031724f5B1403CD48B91": "18",
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026": "18",
  "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548": "18",
  "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff": "18",
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70": "18",
  "0x9984d846a3dc77aa0488f3758976b149e8475995": "18",
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244": "18",
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19": "18",
  "0x99Dd5231314005f26ce147E50F9BAC2365217fCe": "18",
  "0xb656D21E3BFa5Aed5405760b891BA539f4CEb976": "18",
  "0x25ad32265c9354c29e145c902ae876f6b69806f2": "18",
  "0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc": "18",
  "0xaee24d5296444c007a532696aada9de5ce6cafd0": "18",
  "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a": "18",
  "0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6": "18",
  "0xdc8d88d9e57cc7be548f76e5e413c4838f953018": "18",
};

const ALL_ADDRESSES: { [key: string]: string } = {
  BMI: "0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb",
  BTBTC: "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344",
  BTETH: "0x07A79127182a1c303d11eCDa951310EC1C2E1444",
  BTMAT: "0xb87352B4C3EB9daEd09cD4996dFf85c122394912",
  DBTC: "0xf2aa5ccea80c246a71e97b418173fcc956408d3f",
  DETH: "0x72b467cacbdbec5918d8eec0371ca33e6fd42421",
  DMATI: "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2",
  DMI: "0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a",
  DVI: "0x62135f85899d97aed95f4405d710208e68b99f39",
  EIGHT: "0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b",
  EMI: "0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568",
  FOMO: "0x3c0744E72abb3A312122c2118F01F9EE2EB79d43",
  HORSE: "0x330FF0aFE63f42eb478c92dA79B0ce0c69070183",
  KEV: "0x4315C720Cad5aa41D7535902b58B015EEA6F97B0",
  MMI: "0xDFdDd9811796F72bA32a031724f5B1403CD48B91",
  MTBTC: "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026",
  MTETH: "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548",
  PEI: "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff",
  QMB: "0xabcc2102065ba01c6df1a5a5a57158f452403b70",
  QME: "0x9984d846a3dc77aa0488f3758976b149e8475995",
  QMM: "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244",
  SMI: "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19",
  SSPOTS: "0x99Dd5231314005f26ce147E50F9BAC2365217fCe",
  SURF: "0xb656D21E3BFa5Aed5405760b891BA539f4CEb976",
  SWAP: "0x25ad32265c9354c29e145c902ae876f6b69806f2",
  SWBYF: "0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc",
  SWD: "0xaee24d5296444c007a532696aada9de5ce6cafd0",
  SWEYF: "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a",
  SWMYF: "0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6",
  SWYF: "0xdc8d88d9e57cc7be548f76e5e413c4838f953018",
};
const CONTRACT_ADDRESSES = [
  "0xB4f78a05ab16CD3e6d0100112D0CC431942859Bb",
  "0x58f7C5707Ba8E09B5e61ceBe8821f65434372344",
  "0x07A79127182a1c303d11eCDa951310EC1C2E1444",
  "0xb87352B4C3EB9daEd09cD4996dFf85c122394912",
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f",
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421",
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2",
  "0xB5253C58b8a361d9901922b23eC9fB9E7d38C98a",
  "0x62135f85899d97aed95f4405d710208e68b99f39",
  "0xD3C5406b4C0e7EF5d325F47fa6ee08371d100B2b",
  "0xd3ef811331a98d24a2B2FB64cEBeEa5aF31b2568",
  "0x3c0744E72abb3A312122c2118F01F9EE2EB79d43",
  "0x330FF0aFE63f42eb478c92dA79B0ce0c69070183",
  "0x4315C720Cad5aa41D7535902b58B015EEA6F97B0",
  "0xDFdDd9811796F72bA32a031724f5B1403CD48B91",
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026",
  "0x72Ca52512b93E8D67309aF0C14C1A225bcbd3548",
  "0x55a40b33CFf2eb062e7aa76506B7De711F2B2aff",
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70",
  "0x9984d846a3dc77aa0488f3758976b149e8475995",
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244",
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19",
  "0x99Dd5231314005f26ce147E50F9BAC2365217fCe",
  "0xb656D21E3BFa5Aed5405760b891BA539f4CEb976",
  "0x25ad32265c9354c29e145c902ae876f6b69806f2",
  "0xE525deeC6eB2566c29C272BB69eEd2E8A46389dc",
  "0xaee24d5296444c007a532696aada9de5ce6cafd0",
  "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a",
  "0x2C9227bf5FC806f94601eCAf5BC027CAd801b3B6",
  "0xdc8d88d9e57cc7be548f76e5e413c4838f953018",
];

const callGetAssetTransfers = async (
  a: string | undefined,
  b: string | undefined
) => {
  return await web3.alchemy.getAssetTransfers({
    // maxCount: 1,
    excludeZeroValue: false,
    fromBlock: "0x0",
    fromAddress: a,
    toAddress: b,

    contractAddresses: CONTRACT_ADDRESSES,
    category: [AssetTransfersCategory.ERC20],
  });
};

const getDecimals = async (address: string) => {
  let decimals: number = 0;
  for (const i of Object.keys(COMMON_DECIMALS)) {
    if (decimals === 0 && toChecksumAddress(i) === address) {
      decimals = parseInt(COMMON_DECIMALS[i], 10);
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
    if (symbol === "NaN" && toChecksumAddress(ALL_ADDRESSES[i]) === address) {
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

const getTxHistory = async (address: string) => {
  const res1 = await callGetAssetTransfers(address, undefined);
  const res2 = await callGetAssetTransfers(undefined, address);
  const res: AssetTransfersResult[] = [];
  for (const tr of res1.transfers) {
    res.push(tr);
  }
  for (const tr of res2.transfers) {
    res.push(tr);
  }
  const masterObj: any[] = [];
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
    timestamp: "",
    fromSymbol: "",
    fromAmount: 0,
    toSymbol: "",
    toAmount: 0,
    transactionHash: "",
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
    if (
      logs.topics[0] ===
      "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65"
    ) {
      const decimals = await getDecimals(logs.address);
      obj.toAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
      obj.toSymbol = await getSymbol(logs.address);
    }
    if (
      logs.topics[0] ===
      "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
    ) {
      const decimals = await getDecimals(logs.address);
      obj.fromAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
      obj.fromSymbol = await getSymbol(logs.address);
    }
    //   if (
    //     logs.topics[0] ===
    //     "0x44b3b16472a909f781f712646232271ffd156fff642d4895b700146a40462601"
    //   ) {
    //   }
  }
  obj.transactionHash = tx.transactionHash;
  obj.timestamp = (await web3.eth.getBlock(tx.blockNumber)).timestamp;
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
      obj.fromAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
    }
  }

  if (address2 === address) {
    if (obj.toSymbol === "") {
      obj.toSymbol = await getSymbol(logs.address);
      const decimals = await getDecimals(logs.address);
      obj.toAmount =
        parseInt(web3.utils.hexToNumberString(logs.data), 10) / 10 ** decimals;
    }
  }
};

export default getTxHistory;
