export interface CommonDecimals {
  [addr: string]: number;
}

export interface Transaction {
  timestamp: number;
  fromSymbol: string;
  fromAmount: number;
  fromAddress: string;
  fromDecimals: number;
  toSymbol: string;
  toAmount: number;
  toAddress: string;
  toDecimals: number;
  transactionHash: string;
  blockNumber: number;
}

export interface Positions {
  [addr: string]: number;
}

export interface BuySell {
  amount: number;
  timestamp: number;
  value: number;
}
export interface BuySellMap {
  [symbol: string]: BuySell[];
}
export async function asyncForEach<T>(
  array: T[],
  callback: (item: T, index: number) => Promise<void>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index);
  }
}

export const ADDRESSES = [
  "0x25ad32265c9354c29e145c902ae876f6b69806f2", // # alpha portfolio
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026", // # macro trend btc
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548", // # macro trend eth
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70", // # quantum momentum btc
  "0x9984d846a3dc77aa0488f3758976b149e8475995", // # quantum momentum eth
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244", // # quantum momentum matic
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344", // # buy the dip btc
  "0x07a79127182a1c303d11ecda951310ec1c2e1444", // # buy the dip eth
  "0xb87352b4c3eb9daed09cd4996dff85c122394912", // # buy the dip matic
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f", // # discretionary btc
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421", // # discretionary eth
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2", // # discretionary matic
  "0x62135f85899d97aed95f4405d710208e68b99f39", // # defi value index
  "0xb4f78a05ab16cd3e6d0100112d0cc431942859bb", // # btc momentum index
  "0xd3ef811331a98d24a2b2fb64cebeea5af31b2568", // # eth momentum index
  "0xdfddd9811796f72ba32a031724f5b1403cd48b91", // # matic momentum index
  "0xb5253c58b8a361d9901922b23ec9fb9e7d38c98a", // # dpi momentum index
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19", // # swd momentum index
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff", // # polygon ecosystem index
]; // # contract addresS

export const COMMON_DECIMALS: CommonDecimals = {
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": 18,
  "0xd6ca869a4ec9ed2c7e618062cdc45306d8dbbc14": 18,
  "0x3ad707da309f3845cd602059901e39c4dcd66473": 18,
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": 8,
  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": 18,
  "0xf287d97b6345bad3d88856b26fb7c0ab3f2c7976": 18,
  "0xe5417af564e4bfda1c483642db72007871397896": 18,
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7": 18,
  "0x831753dd7087cac61ab5644b308642cc1c33dc13": 18,
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff": 18,
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548": 18,
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344": 18,
  "0x07a79127182a1c303d11ecda951310ec1c2e1444": 18,
  "0xb87352b4c3eb9daed09cd4996dff85c122394912": 18,
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 6,
  "0xb4f78a05ab16cd3e6d0100112d0cc431942859bb": 18,
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f": 18,
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421": 18,
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2": 18,
  "0xb5253c58b8a361d9901922b23ec9fb9e7d38c98a": 18,
  "0x62135f85899d97aed95f4405d710208e68b99f39": 18,
  "0xd3c5406b4c0e7ef5d325f47fa6ee08371d100b2b": 18,
  "0xd3ef811331a98d24a2b2fb64cebeea5af31b2568": 18,
  "0x3c0744e72abb3a312122c2118f01f9ee2eb79d43": 18,
  "0x330ff0afe63f42eb478c92da79b0ce0c69070183": 18,
  "0x4315c720cad5aa41d7535902b58b015eea6f97b0": 18,
  "0xdfddd9811796f72ba32a031724f5b1403cd48b91": 18,
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026": 18,
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70": 18,
  "0x9984d846a3dc77aa0488f3758976b149e8475995": 18,
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244": 18,
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19": 18,
  "0x99dd5231314005f26ce147e50f9bac2365217fce": 18,
  "0xb656d21e3bfa5aed5405760b891ba539f4ceb976": 18,
  "0x25ad32265c9354c29e145c902ae876f6b69806f2": 18,
  "0xe525deec6eb2566c29c272bb69eed2e8a46389dc": 18,
  "0xaee24d5296444c007a532696aada9de5ce6cafd0": 18,
  "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a": 18,
  "0x2c9227bf5fc806f94601ecaf5bc027cad801b3b6": 18,
  "0xdc8d88d9e57cc7be548f76e5e413c4838f953018": 18,
  "0x24ec3c300ff53b96937c39b686844db9e471421e": 18,
};

export const PRECISION_REQUIRED = [
  "0x340f412860da7b7823df372a2b59ff78b7ae6abc",
  "0x130ce4e4f76c2265f94a961d70618562de0bb8d2",
  "0x4f025829c4b13df652f38abd2ab901185ff1e609",
];

export const CONTRACT_ADDRESSES = [
  "0xb4f78a05ab16cd3e6d0100112d0cc431942859bb",
  "0x58f7c5707ba8e09b5e61cebe8821f65434372344",
  "0x07a79127182a1c303d11ecda951310ec1c2e1444",
  "0xb87352b4c3eb9daed09cd4996dff85c122394912",
  "0xf2aa5ccea80c246a71e97b418173fcc956408d3f",
  "0x72b467cacbdbec5918d8eec0371ca33e6fd42421",
  "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2",
  "0xb5253c58b8a361d9901922b23ec9fb9e7d38c98a",
  "0x62135f85899d97aed95f4405d710208e68b99f39",
  "0xd3c5406b4c0e7ef5d325f47fa6ee08371d100b2b",
  "0xd3ef811331a98d24a2b2fb64cebeea5af31b2568",
  "0x3c0744e72abb3a312122c2118f01f9ee2eb79d43",
  "0x330ff0afe63f42eb478c92da79b0ce0c69070183",
  "0x4315c720cad5aa41d7535902b58b015eea6f97b0",
  "0xdfddd9811796f72ba32a031724f5b1403cd48b91",
  "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026",
  "0x72ca52512b93e8d67309af0c14c1a225bcbd3548",
  "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff",
  "0xabcc2102065ba01c6df1a5a5a57158f452403b70",
  "0x9984d846a3dc77aa0488f3758976b149e8475995",
  "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244",
  "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19",
  "0x99dd5231314005f26ce147e50f9bac2365217fce",
  "0xb656d21e3bfa5aed5405760b891ba539f4ceb976",
  "0x25ad32265c9354c29e145c902ae876f6b69806f2",
  "0xe525deec6eb2566c29c272bb69eed2e8a46389dc",
  "0xaee24d5296444c007a532696aada9de5ce6cafd0",
  "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a",
  "0x2c9227bf5fc806f94601ecaf5bc027cad801b3b6",
  "0xdc8d88d9e57cc7be548f76e5e413c4838f953018",
  // "0x24ec3c300ff53b96937c39b686844db9e471421e",
];

export const ALL_ADDRESSES: { [key: string]: string } = {
  BMI: "0xb4f78a05ab16cd3e6d0100112d0cc431942859bb",
  BTBTC: "0x58f7c5707ba8e09b5e61cebe8821f65434372344",
  BTETH: "0x07a79127182a1c303d11ecda951310ec1c2e1444",
  BTMAT: "0xb87352b4c3eb9daed09cd4996dff85c122394912",
  DBTC: "0xf2aa5ccea80c246a71e97b418173fcc956408d3f",
  DETH: "0x72b467cacbdbec5918d8eec0371ca33e6fd42421",
  DMATI: "0xab80a6e2909c8089ebd84f331c05bbefa3276cd2",
  DMI: "0xb5253c58b8a361d9901922b23ec9fb9e7d38c98a",
  DVI: "0x62135f85899d97aed95f4405d710208e68b99f39",
  EIGHT: "0xd3c5406b4c0e7ef5d325f47fa6ee08371d100b2b",
  EMI: "0xd3ef811331a98d24a2b2fb64cebeea5af31b2568",
  FOMO: "0x3c0744e72abb3a312122c2118f01f9ee2eb79d43",
  HORSE: "0x330ff0afe63f42eb478c92da79b0ce0c69070183",
  KEV: "0x4315c720cad5aa41d7535902b58b015eea6f97b0",
  MMI: "0xdfddd9811796f72ba32a031724f5b1403cd48b91",
  MTBTC: "0x71b41b3b19aac53ca4063aec2d17fc3caeb38026",
  MTETH: "0x72ca52512b93e8d67309af0c14c1a225bcbd3548",
  PEI: "0x55a40b33cff2eb062e7aa76506b7de711f2b2aff",
  QMB: "0xabcc2102065ba01c6df1a5a5a57158f452403b70",
  QME: "0x9984d846a3dc77aa0488f3758976b149e8475995",
  QMM: "0x20ab4cb8f8da39582bc92da954ab1bb128f4e244",
  SMI: "0xad2b726fd2bd3a7f8f4b3929152438eba637ef19",
  SSPOTS: "0x99dd5231314005f26ce147e50f9bac2365217fce",
  SURF: "0xb656d21e3bfa5aed5405760b891ba539f4ceb976",
  SWAP: "0x25ad32265c9354c29e145c902ae876f6b69806f2",
  SWBYF: "0xe525deec6eb2566c29c272bb69eed2e8a46389dc",
  SWD: "0xaee24d5296444c007a532696aada9de5ce6cafd0",
  SWEYF: "0x8fcdd8372b5bcd27524546ad02b198c899d8ab2a",
  SWMYF: "0x2c9227bf5fc806f94601ecaf5bc027cad801b3b6",
  SWYF: "0xdc8d88d9e57cc7be548f76e5e413c4838f953018",
  // SWX: "0x24ec3c300ff53b96937c39b686844db9e471421e",
};

export const SYMBOLS = [
  "BMI",
  "BTBTC",
  "BTETH",
  "BTMAT",
  "DBTC",
  "DETH",
  "DMATI",
  "DMI",
  "DVI",
  "EIGHT",
  "EMI",
  "FOMO",
  "HORSE",
  "KEV",
  "MMI",
  "MTBTC",
  "MTETH",
  "PEI",
  "QMB",
  "QME",
  "QMM",
  "SMI",
  "SSPOTS",
  "SURF",
  "SWAP",
  "SWBYF",
  "SWD",
  "SWEYF",
  "SWMYF",
  "SWYF",
  //   "SWX"
];
