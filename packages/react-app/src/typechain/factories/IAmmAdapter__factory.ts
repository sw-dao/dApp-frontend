/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IAmmAdapter, IAmmAdapterInterface } from "../IAmmAdapter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_components",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_maxTokensIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_minLiquidity",
        type: "uint256",
      },
    ],
    name: "getProvideLiquidityCalldata",
    outputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
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
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_component",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_maxTokenIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minLiquidity",
        type: "uint256",
      },
    ],
    name: "getProvideLiquiditySingleAssetCalldata",
    outputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
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
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_components",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_minTokensOut",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_liquidity",
        type: "uint256",
      },
    ],
    name: "getRemoveLiquidityCalldata",
    outputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
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
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address",
        name: "_component",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_minTokenOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_liquidity",
        type: "uint256",
      },
    ],
    name: "getRemoveLiquiditySingleAssetCalldata",
    outputs: [
      {
        internalType: "address",
        name: "_target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_calldata",
        type: "bytes",
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
        name: "_pool",
        type: "address",
      },
    ],
    name: "getSpenderAddress",
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
        name: "_pool",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_components",
        type: "address[]",
      },
    ],
    name: "isValidPool",
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

export class IAmmAdapter__factory {
  static readonly abi = _abi;
  static createInterface(): IAmmAdapterInterface {
    return new utils.Interface(_abi) as IAmmAdapterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAmmAdapter {
    return new Contract(address, _abi, signerOrProvider) as IAmmAdapter;
  }
}
