/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  INAVIssuanceModule,
  INAVIssuanceModuleInterface,
} from "../INAVIssuanceModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ISetToken",
        name: "_setToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_reserveAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_reserveAssetQuantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minSetTokenReceiveQuantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "issue",
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
        internalType: "address",
        name: "_reserveAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_setTokenQuantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minReserveReceiveQuantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
    gas: "0x01ba8140",
  },
];

export class INAVIssuanceModule__factory {
  static readonly abi = _abi;
  static createInterface(): INAVIssuanceModuleInterface {
    return new utils.Interface(_abi) as INAVIssuanceModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): INAVIssuanceModule {
    return new Contract(address, _abi, signerOrProvider) as INAVIssuanceModule;
  }
}
