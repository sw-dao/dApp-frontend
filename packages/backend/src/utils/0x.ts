import ERC20ABI from "erc-20-abi";
import { ethers } from "ethers";
import { Request } from "express";
import NodeCache from "node-cache";

import {
  ERC20,
  SwappableTokens,
  TokenProducts,
  alchemyApiKey,
  buyTokenPercentageFee,
  feeRecipient,
  infuraApiKey,
  infuraProjectId,
  providerConfig,
} from "../settings";
import { SWD_CHECK_DISABLED } from "../settings";
import { SwapRequest } from "../types";

// @ts-ignore

let provider: ethers.providers.JsonRpcProvider;
if (alchemyApiKey) {
  console.log('Using Alchemy RPC');
  provider = new ethers.providers.AlchemyProvider({
    name: providerConfig.name,
    chainId: providerConfig.chainId,
  }, alchemyApiKey);
} else {
  console.log('Using Infura RPC');
  provider = new ethers.providers.InfuraProvider(providerConfig.name, infuraProjectId);
}

const SWDContractForChain = (chainId: string) => {
  return new ethers.Contract(
    SwappableTokens.TokenProducts[chainId].SWD,
    ERC20ABI,
    provider,
  );
}

const TokenProductsForChain = (chainId: string) => SwappableTokens.TokenProducts[chainId];
const ERC20ForChain = (chainId: string) => SwappableTokens.ERC20[chainId];

const cache = new NodeCache({ stdTTL: 30 });

const hasQualifyingSWDBalance = async (
  chainId: string,
  walletAddress: string
): Promise<boolean> => {
  if (SWD_CHECK_DISABLED) {
    return true;
  }
  if (walletAddress) {
    const key = `has_qual_swd_balance_${walletAddress}`;
    if (cache.has(key)) {
      return !!cache.get(key);
    }

    const balance = await SWDContractForChain(chainId).balanceOf(walletAddress);
    const readableBalance = Number(ethers.utils.formatUnits(balance, "ether"));
    const result =  readableBalance > 500;
    cache.set(key, result, 60);  // 1 minute
    return result;
  }
  return false;
};

const getSwapParameters = async (req: Request, skipValidation: boolean = true): Promise<SwapRequest> => {
  // Get values for the swap request from the api request parameters ("/:buyToken/:sellToken...")
  // TODO validate token/amount values. Possibly with yup?
  const { buyToken, sellToken, sellAmount } = req.params;
  const chainId = req?.body?.chainId || req?.query?.chainId;

  const walletAddress = req.body?.data?.account;
  let shouldSkipFee = false;
  try {
    shouldSkipFee = await hasQualifyingSWDBalance(chainId, walletAddress);
  } catch (error) {
    console.log(error);
  }

  const swapData: SwapRequest = {
    buyToken,
    sellToken,
    sellAmount,
    feeRecipient,
    slippagePercentage: 0.005,
    // buyTokenPercentageFee: shouldSkipFee ? 0 : buyTokenPercentageFee,
    buyTokenPercentageFee: 0,  // Charging a fee is failing with WalletExecuteDelegateCallFailedError. TODO
    skipValidation,
    takerAddress: walletAddress,
  };

  return swapData;
};

const validToken = (chainId: string, token: string): boolean => {
  if (
    !Object.values(TokenProductsForChain(chainId)).includes(token) &&
    !Object.values(ERC20ForChain(chainId)).includes(token)
  ) {
    throw new Error("Token address is invalid.");
  }

  return true;
};

// TODO better typing
const validSwap = (
  chainId: string,
  buyToken: keyof typeof ERC20 | keyof typeof TokenProducts,
  sellToken: keyof typeof ERC20 | keyof typeof TokenProducts
): boolean => {
  if (!chainId) {
    throw new Error("Chain ID is required.");
  }

  if (buyToken === sellToken) {
    throw new Error("Cannot swap the same token.");
  }

  const chainTokens = Object.values(TokenProductsForChain(chainId));
  const chainErc20 = Object.values(ERC20ForChain(chainId));

  const buyIsProduct = chainTokens.includes(buyToken as string);
  const sellIsProduct = chainTokens.includes(sellToken as string);
  const buyIsErc20 = chainErc20.includes(buyToken as string);
  const sellIsErc20 = chainErc20.includes(sellToken as string);

  if (buyIsErc20 && sellIsErc20) {
    throw new Error("Cannot swap ERC20 for ERC20.");
  }

  const hasBuy = buyIsProduct || buyIsErc20;
  const hasSell = sellIsProduct || sellIsErc20;
  if (!hasBuy && !hasSell) {
    throw new Error("couldn't find either token");
  }
  if (!hasBuy) {
    throw new Error("couldn't find buy token");
  }
  if (!hasSell) {
    throw new Error("couldn't find sell token");
  }
  return true;
};

export { getSwapParameters, validToken, validSwap };
