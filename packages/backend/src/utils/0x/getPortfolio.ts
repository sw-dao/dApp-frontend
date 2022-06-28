import { web3 } from "../../bin/www";
import { AbiItem } from "web3-utils";
// import TokenSetABI from "../../abi/TokenSetABI.json";
import ERC20ABI from "../../abi/ERC20.json";
import { SwappableTokens, TokenProducts } from "../../settings";

interface Positions {
  [addr: string]: number;
}

export const getPositions = async (address: string) => {
  const portfolio: Positions = {};
  const tokens = TokenProducts["0x89"];
  for (const symbol in tokens) {
    if (tokens.hasOwnProperty(symbol)) {
      const p = tokens[symbol];
      const contract = new web3.eth.Contract(ERC20ABI as AbiItem[], p);
      await contract.methods.balanceOf(address).call((err: any, res: any) => {
        if (err) {
          console.log("[GET PORFOLIO POSITONS]", err);
        }
        if (parseInt(res, 10) > 0) {
          portfolio[symbol] = parseInt(res, 10) / 10 ** 18;
        }
      });
    }
  }
  return Promise.resolve(portfolio);
};
