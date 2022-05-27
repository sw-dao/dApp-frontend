/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PerpV2, PerpV2Interface } from "../PerpV2";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "IVault",
      },
      {
        internalType: "contract IERC20",
        name: "_asset",
        type: "IERC20",
      },
      {
        internalType: "uint256",
        name: "_amountNotional",
        type: "uint256",
      },
    ],
    name: "getDepositCalldata",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "contract IClearingHouse",
        name: "_clearingHouse",
        type: "IClearingHouse",
      },
      {
        components: [
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isBaseToQuote",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isExactInput",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "oppositeAmountBound",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
          {
            internalType: "bytes32",
            name: "referralCode",
            type: "bytes32",
          },
        ],
        internalType: "struct IClearingHouse.OpenPositionParams",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "getOpenPositionCalldata",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "contract IQuoter",
        name: "_quoter",
        type: "IQuoter",
      },
      {
        components: [
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isBaseToQuote",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isExactInput",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct IQuoter.SwapParams",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "getSwapCalldata",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
    gas: "0x01ba8140",
  },
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "IVault",
      },
      {
        internalType: "contract IERC20",
        name: "_asset",
        type: "IERC20",
      },
      {
        internalType: "uint256",
        name: "_amountNotional",
        type: "uint256",
      },
    ],
    name: "getWithdrawCalldata",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
    gas: "0x01ba8140",
  },
];

const _bytecode =
  "0x610af9610026600b82828239805160001a60731461001957fe5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100925760003560e01c80635567d1de116100655780635567d1de1461010a57806384e88afe1461012a578063892d5a6e1461013d578063d3a5c2851461016a57610092565b80630293a12814610097578063178642a4146100c25780632130ef5e146100e45780633f3876eb146100f7575b600080fd5b6100aa6100a536600461081d565b610198565b6040516100b993929190610903565b60405180910390f35b8180156100ce57600080fd5b506100e26100dd3660046107cd565b6101ea565b005b6100aa6100f236600461071b565b61028b565b6100aa6101053660046106e5565b6102da565b81801561011657600080fd5b506100e26101253660046107cd565b610329565b6100aa61013836600461081d565b610332565b81801561014957600080fd5b5061015d61015836600461078f565b610384565b6040516100b991906109fa565b81801561017657600080fd5b5061018a610185366004610747565b610445565b6040516100b9929190610a38565b60008060608085856040516024016101b1929190610933565b60408051601f198184030181529190526020810180516001600160e01b03166311f9fbc960e21b17905296976000979650945050505050565b60606101f7848484610198565b6040516347b7819960e11b81529093506001600160a01b0388169250638f6f0332915061022d9087906000908690600401610903565b600060405180830381600087803b15801561024757600080fd5b505af115801561025b573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102839190810190610659565b505050505050565b600080606080846040516024016102a291906109b5565b60408051601f198184030181529190526020810180516001600160e01b0316630a856f9360e31b179052959660009695509350505050565b600080606080846040516024016102f1919061094c565b60408051601f198184030181529190526020810180516001600160e01b031663b6b1b6c360e01b179052959660009695509350505050565b60606101f78484845b600080606080858560405160240161034b929190610933565b60408051601f198184030181529190526020810180516001600160e01b031663f3fef3a360e01b17905296976000979650945050505050565b61038c610505565b6060610398848461028b565b925050506060856001600160a01b0316638f6f0332866000856040518463ffffffff1660e01b81526004016103cf93929190610903565b600060405180830381600087803b1580156103e957600080fd5b505af11580156103fd573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104259190810190610659565b90508080602001905181019061043b919061085d565b9695505050505050565b600080606061045485856102da565b925050506060866001600160a01b0316638f6f0332876000856040518463ffffffff1660e01b815260040161048b93929190610903565b600060405180830381600087803b1580156104a557600080fd5b505af11580156104b9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104e19190810190610659565b9050808060200190518101906104f791906108b4565b935093505050935093915050565b6040518060a001604052806000815260200160008152602001600081526020016000815260200160006001600160a01b031681525090565b8035801515811461054d57600080fd5b92915050565b6000610100808385031215610566578182fd5b61056f81610a46565b915050813561057d81610a9d565b815261058c836020840161053d565b602082015261059e836040840161053d565b6040820152606082013560608201526080820135608082015260a082013560a082015260c08201356105cf81610a9d565b8060c08301525060e082013560e082015292915050565b600060a082840312156105f7578081fd5b61060160a0610a46565b9050813561060e81610a9d565b8152602082013561061e81610ab5565b6020820152604082013561063181610ab5565b604082015260608281013590820152608082013561064e81610a9d565b608082015292915050565b60006020828403121561066a578081fd5b815167ffffffffffffffff80821115610681578283fd5b81840185601f820112610692578384fd5b80519250818311156106a2578384fd5b6106b5601f8401601f1916602001610a46565b91508282528560208483010111156106cb578384fd5b6106dc836020840160208401610a6d565b50949350505050565b60008061012083850312156106f8578081fd5b823561070381610a9d565b91506107128460208501610553565b90509250929050565b60008060c0838503121561072d578182fd5b823561073881610a9d565b915061071284602085016105e6565b6000806000610140848603121561075c578081fd5b833561076781610a9d565b9250602084013561077781610a9d565b91506107868560408601610553565b90509250925092565b600080600060e084860312156107a3578283fd5b83356107ae81610a9d565b925060208401356107be81610a9d565b915061078685604086016105e6565b600080600080608085870312156107e2578081fd5b84356107ed81610a9d565b935060208501356107fd81610a9d565b9250604085013561080d81610a9d565b9396929550929360600135925050565b600080600060608486031215610831578081fd5b833561083c81610a9d565b9250602084013561084c81610a9d565b929592945050506040919091013590565b600060a0828403121561086e578081fd5b61087860a0610a46565b8251815260208301516020820152604083015160408201526060830151606082015260808301516108a881610a9d565b60808201529392505050565b600080604083850312156108c6578182fd5b505080516020909101519092909150565b600081518084526108ef816020860160208601610a6d565b601f01601f19169290920160200192915050565b600060018060a01b03851682528360208301526060604083015261092a60608301846108d7565b95945050505050565b6001600160a01b03929092168252602082015260400190565b60006101008201905060018060a01b03808451168352602084015115156020840152604084015115156040840152606084015160608401526080840151608084015260a084015160a08401528060c08501511660c08401525060e083015160e083015292915050565b81516001600160a01b03908116825260208084015115159083015260408084015115159083015260608084015190830152608092830151169181019190915260a00190565b815181526020808301519082015260408083015190820152606080830151908201526080918201516001600160a01b03169181019190915260a00190565b918252602082015260400190565b60405181810167ffffffffffffffff81118282101715610a6557600080fd5b604052919050565b60005b83811015610a88578181015183820152602001610a70565b83811115610a97576000848401525b50505050565b6001600160a01b0381168114610ab257600080fd5b50565b8015158114610ab257600080fdfea2646970667358221220e5f84f53868c842453e49c9ba54bc1b19d40382bad24d7d87c2829fb127631a564736f6c634300060a0033";

type PerpV2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PerpV2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PerpV2__factory extends ContractFactory {
  constructor(...args: PerpV2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PerpV2> {
    return super.deploy(overrides || {}) as Promise<PerpV2>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PerpV2 {
    return super.attach(address) as PerpV2;
  }
  connect(signer: Signer): PerpV2__factory {
    return super.connect(signer) as PerpV2__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PerpV2Interface {
    return new utils.Interface(_abi) as PerpV2Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): PerpV2 {
    return new Contract(address, _abi, signerOrProvider) as PerpV2;
  }
}