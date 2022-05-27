/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PerpV2TestAggregatorV3,
  PerpV2TestAggregatorV3Interface,
} from "../PerpV2TestAggregatorV3";

const _abi = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80",
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256",
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    gas: "0x01ba8140",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506101e9806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c8063313ce5671461005c57806354fd4d501461007a5780637284e4161461008f5780639a6fc8f5146100a4578063feaf968c146100c8575b600080fd5b6100646100d0565b60405161007191906101a5565b60405180910390f35b6100826100d0565b604051610071919061016c565b6100976100d7565b6040516100719190610119565b6100b76100b23660046100eb565b6100de565b604051610071959493929190610175565b6100b76100de565b6000806000fd5b6060600080fd5b6000806000806000806000fd5b6000602082840312156100fc578081fd5b81356001600160501b0381168114610112578182fd5b9392505050565b6000602080835283518082850152825b8181101561014557858101830151858201604001528201610129565b818111156101565783604083870101525b50601f01601f1916929092016040019392505050565b90815260200190565b6001600160501b039586168152602081019490945260408401929092526060830152909116608082015260a00190565b60ff9190911681526020019056fea26469706673582212203753f98b73a9090957ed70bfb25c49d2457f004d91f7f96f778e6e2f31abb8ab64736f6c63430007060033";

type PerpV2TestAggregatorV3ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PerpV2TestAggregatorV3ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PerpV2TestAggregatorV3__factory extends ContractFactory {
  constructor(...args: PerpV2TestAggregatorV3ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PerpV2TestAggregatorV3> {
    return super.deploy(overrides || {}) as Promise<PerpV2TestAggregatorV3>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PerpV2TestAggregatorV3 {
    return super.attach(address) as PerpV2TestAggregatorV3;
  }
  connect(signer: Signer): PerpV2TestAggregatorV3__factory {
    return super.connect(signer) as PerpV2TestAggregatorV3__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PerpV2TestAggregatorV3Interface {
    return new utils.Interface(_abi) as PerpV2TestAggregatorV3Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PerpV2TestAggregatorV3 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PerpV2TestAggregatorV3;
  }
}