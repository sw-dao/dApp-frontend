/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  SetTokenAccessible,
  SetTokenAccessibleInterface,
} from "../SetTokenAccessible";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IController",
        name: "_controller",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "_anySetAllowed",
        type: "bool",
      },
    ],
    name: "AnySetAllowedUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISetToken",
        name: "_setToken",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_added",
        type: "bool",
      },
    ],
    name: "SetTokenStatusUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract ISetToken",
        name: "",
        type: "address",
      },
    ],
    name: "allowedSetTokens",
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
  {
    inputs: [],
    name: "anySetAllowed",
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
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "contract ISetToken",
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
    ],
    name: "updateAllowedSetToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_anySetAllowed",
        type: "bool",
      },
    ],
    name: "updateAnySetAllowed",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "0x01ba8140",
  },
];

export class SetTokenAccessible__factory {
  static readonly abi = _abi;
  static createInterface(): SetTokenAccessibleInterface {
    return new utils.Interface(_abi) as SetTokenAccessibleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SetTokenAccessible {
    return new Contract(address, _abi, signerOrProvider) as SetTokenAccessible;
  }
}
