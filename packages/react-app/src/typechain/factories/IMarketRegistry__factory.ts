/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IMarketRegistry,
  IMarketRegistryInterface,
} from "../IMarketRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
    ],
    name: "getPool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [],
    name: "getQuoteToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [],
    name: "getUniswapV3Factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "baseToken",
        type: "address",
      },
    ],
    name: "hasPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
];

export class IMarketRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): IMarketRegistryInterface {
    return new utils.Interface(_abi) as IMarketRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMarketRegistry {
    return new Contract(address, _abi, signerOrProvider) as IMarketRegistry;
  }
}