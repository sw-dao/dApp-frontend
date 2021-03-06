/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type ClosePositionParamsStruct = {
  baseToken: string;
  sqrtPriceLimitX96: BigNumberish;
  oppositeAmountBound: BigNumberish;
  deadline: BigNumberish;
  referralCode: BytesLike;
};

export type ClosePositionParamsStructOutput = [
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  string
] & {
  baseToken: string;
  sqrtPriceLimitX96: BigNumber;
  oppositeAmountBound: BigNumber;
  deadline: BigNumber;
  referralCode: string;
};

export type OpenPositionParamsStruct = {
  baseToken: string;
  isBaseToQuote: boolean;
  isExactInput: boolean;
  amount: BigNumberish;
  oppositeAmountBound: BigNumberish;
  deadline: BigNumberish;
  sqrtPriceLimitX96: BigNumberish;
  referralCode: BytesLike;
};

export type OpenPositionParamsStructOutput = [
  string,
  boolean,
  boolean,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  string
] & {
  baseToken: string;
  isBaseToQuote: boolean;
  isExactInput: boolean;
  amount: BigNumber;
  oppositeAmountBound: BigNumber;
  deadline: BigNumber;
  sqrtPriceLimitX96: BigNumber;
  referralCode: string;
};

export interface IClearingHouseInterface extends utils.Interface {
  functions: {
    "closePosition((address,uint160,uint256,uint256,bytes32))": FunctionFragment;
    "getAccountValue(address)": FunctionFragment;
    "getNetQuoteBalance(address)": FunctionFragment;
    "getOpenNotional(address,address)": FunctionFragment;
    "getOwedRealizedPnl(address)": FunctionFragment;
    "getPositionSize(address,address)": FunctionFragment;
    "getPositionValue(address,address)": FunctionFragment;
    "getTotalInitialMarginRequirement(address)": FunctionFragment;
    "getTotalUnrealizedPnl(address)": FunctionFragment;
    "openPosition((address,bool,bool,uint256,uint256,uint256,uint160,bytes32))": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "closePosition",
    values: [ClosePositionParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountValue",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getNetQuoteBalance",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getOpenNotional",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getOwedRealizedPnl",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionSize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionValue",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalInitialMarginRequirement",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalUnrealizedPnl",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "openPosition",
    values: [OpenPositionParamsStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "closePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNetQuoteBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOpenNotional",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOwedRealizedPnl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPositionSize",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPositionValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalInitialMarginRequirement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalUnrealizedPnl",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "openPosition",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IClearingHouse extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IClearingHouseInterface;

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
    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getNetQuoteBalance(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOpenNotional(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOwedRealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPositionSize(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPositionValue(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTotalInitialMarginRequirement(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTotalUnrealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  closePosition(
    params: ClosePositionParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAccountValue(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getNetQuoteBalance(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOpenNotional(
    trader: string,
    baseToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOwedRealizedPnl(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPositionSize(
    trader: string,
    baseToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPositionValue(
    trader: string,
    baseToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalInitialMarginRequirement(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTotalUnrealizedPnl(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  openPosition(
    params: OpenPositionParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { deltaBase: BigNumber; deltaQuote: BigNumber }
    >;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNetQuoteBalance(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOpenNotional(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwedRealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionSize(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionValue(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalInitialMarginRequirement(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalUnrealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { deltaBase: BigNumber; deltaQuote: BigNumber }
    >;
  };

  filters: {};

  estimateGas: {
    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNetQuoteBalance(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOpenNotional(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwedRealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionSize(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionValue(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalInitialMarginRequirement(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalUnrealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNetQuoteBalance(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOpenNotional(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwedRealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPositionSize(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPositionValue(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalInitialMarginRequirement(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalUnrealizedPnl(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
