/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface BalancerV1IndexExchangeAdapterInterface
  extends utils.Interface {
  functions: {
    "balancerProxy()": FunctionFragment;
    "getSpender()": FunctionFragment;
    "getTradeCalldata(address,address,address,bool,uint256,uint256,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "balancerProxy",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSpender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTradeCalldata",
    values: [
      string,
      string,
      string,
      boolean,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "balancerProxy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getSpender", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTradeCalldata",
    data: BytesLike
  ): Result;

  events: {};
}

export interface BalancerV1IndexExchangeAdapter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BalancerV1IndexExchangeAdapterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    balancerProxy(overrides?: CallOverrides): Promise<[string]>;

    getSpender(overrides?: CallOverrides): Promise<[string]>;

    getTradeCalldata(
      _sourceToken: string,
      _destinationToken: string,
      arg2: string,
      _isSendTokenFixed: boolean,
      _sourceQuantity: BigNumberish,
      _destinationQuantity: BigNumberish,
      arg6: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber, string]>;
  };

  balancerProxy(overrides?: CallOverrides): Promise<string>;

  getSpender(overrides?: CallOverrides): Promise<string>;

  getTradeCalldata(
    _sourceToken: string,
    _destinationToken: string,
    arg2: string,
    _isSendTokenFixed: boolean,
    _sourceQuantity: BigNumberish,
    _destinationQuantity: BigNumberish,
    arg6: BytesLike,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber, string]>;

  callStatic: {
    balancerProxy(overrides?: CallOverrides): Promise<string>;

    getSpender(overrides?: CallOverrides): Promise<string>;

    getTradeCalldata(
      _sourceToken: string,
      _destinationToken: string,
      arg2: string,
      _isSendTokenFixed: boolean,
      _sourceQuantity: BigNumberish,
      _destinationQuantity: BigNumberish,
      arg6: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber, string]>;
  };

  filters: {};

  estimateGas: {
    balancerProxy(overrides?: CallOverrides): Promise<BigNumber>;

    getSpender(overrides?: CallOverrides): Promise<BigNumber>;

    getTradeCalldata(
      _sourceToken: string,
      _destinationToken: string,
      arg2: string,
      _isSendTokenFixed: boolean,
      _sourceQuantity: BigNumberish,
      _destinationQuantity: BigNumberish,
      arg6: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    balancerProxy(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSpender(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTradeCalldata(
      _sourceToken: string,
      _destinationToken: string,
      arg2: string,
      _isSendTokenFixed: boolean,
      _sourceQuantity: BigNumberish,
      _destinationQuantity: BigNumberish,
      arg6: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
