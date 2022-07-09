import axios from "axios";
import { baseUrl0x } from "../../settings";
import { asyncForEach, BuySellMap, SYMBOLS, Transaction } from "./exports";

const getValueFromBlock = async (
  address: string,
  blockNumber: number,
  decimals: number
) => {
  const price = await axios
    .post(baseUrl0x + `/history`, {
      buyTokens: [{ decimals, tokenAddress: address }],
      startBlock: blockNumber,
    })
    .then((response) => {
      return response.data; // return price and decimals
    })
    .catch((err) => console.log(err.response.data));
  return price[0].prices[0]; // returns [price, decimals] returned from const price = axios
};

const filterTx = async (
  tx: Transaction,
  k: "to" | "from",
  nK: "to" | "from",
  buySell: BuySellMap
) => {
  const symbol: "fromSymbol" | "toSymbol" = `${k}Symbol`;
  const amount: "fromAmount" | "toAmount" = `${k}Amount`;
  let address: "fromAddress" | "toAddress" = `${nK}Address`;
  let decimals: "fromDecimals" | "toDecimals" = `${nK}Decimals`;
  let amount2: "fromAmount" | "toAmount" = `${nK}Amount`;
  if (tx[address] === "") {
    address = `${k}Address`;
    decimals = `${k}Decimals`;
    amount2 = amount;
  }
  const value =
    (await getValueFromBlock(tx[address], tx.blockNumber, tx[decimals])) *
    tx[amount2];
  if (SYMBOLS.includes(tx[symbol])) {
    if (tx[symbol] in buySell) {
      buySell[tx[symbol]].push({
        amount: tx[amount],
        timestamp: tx.timestamp,
        value,
      });
    } else {
      buySell[tx[symbol]] = [
        { amount: tx[amount], timestamp: tx.timestamp, value },
      ];
    }
  }
};
const portfolioCharts = async (txHistory: Transaction[]) => {
  const buy: BuySellMap = {};
  const sell: BuySellMap = {};
  await asyncForEach(txHistory, async (tx) => {
    await filterTx(tx, "from", "to", sell);
    await filterTx(tx, "to", "from", buy);
  });

  return [buy, sell];
};

export default portfolioCharts;
