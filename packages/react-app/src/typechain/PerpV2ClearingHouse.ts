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
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type AddLiquidityParamsStruct = {
  baseToken: string;
  base: BigNumberish;
  quote: BigNumberish;
  lowerTick: BigNumberish;
  upperTick: BigNumberish;
  minBase: BigNumberish;
  minQuote: BigNumberish;
  useTakerBalance: boolean;
  deadline: BigNumberish;
};

export type AddLiquidityParamsStructOutput = [
  string,
  BigNumber,
  BigNumber,
  number,
  number,
  BigNumber,
  BigNumber,
  boolean,
  BigNumber
] & {
  baseToken: string;
  base: BigNumber;
  quote: BigNumber;
  lowerTick: number;
  upperTick: number;
  minBase: BigNumber;
  minQuote: BigNumber;
  useTakerBalance: boolean;
  deadline: BigNumber;
};

export type AddLiquidityResponseStruct = {
  base: BigNumberish;
  quote: BigNumberish;
  fee: BigNumberish;
  liquidity: BigNumberish;
};

export type AddLiquidityResponseStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & { base: BigNumber; quote: BigNumber; fee: BigNumber; liquidity: BigNumber };

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

export type RemoveLiquidityParamsStruct = {
  baseToken: string;
  lowerTick: BigNumberish;
  upperTick: BigNumberish;
  liquidity: BigNumberish;
  minBase: BigNumberish;
  minQuote: BigNumberish;
  deadline: BigNumberish;
};

export type RemoveLiquidityParamsStructOutput = [
  string,
  number,
  number,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  baseToken: string;
  lowerTick: number;
  upperTick: number;
  liquidity: BigNumber;
  minBase: BigNumber;
  minQuote: BigNumber;
  deadline: BigNumber;
};

export type RemoveLiquidityResponseStruct = {
  base: BigNumberish;
  quote: BigNumberish;
  fee: BigNumberish;
};

export type RemoveLiquidityResponseStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber
] & { base: BigNumber; quote: BigNumber; fee: BigNumber };

export interface PerpV2ClearingHouseInterface extends utils.Interface {
  functions: {
    "addLiquidity((address,uint256,uint256,int24,int24,uint256,uint256,bool,uint256))": FunctionFragment;
    "cancelAllExcessOrders(address,address)": FunctionFragment;
    "cancelExcessOrders(address,address,bytes32[])": FunctionFragment;
    "candidate()": FunctionFragment;
    "closePosition((address,uint160,uint256,uint256,bytes32))": FunctionFragment;
    "getAccountBalance()": FunctionFragment;
    "getAccountValue(address)": FunctionFragment;
    "getClearingHouseConfig()": FunctionFragment;
    "getExchange()": FunctionFragment;
    "getInsuranceFund()": FunctionFragment;
    "getOrderBook()": FunctionFragment;
    "getQuoteToken()": FunctionFragment;
    "getTrustedForwarder()": FunctionFragment;
    "getUniswapV3Factory()": FunctionFragment;
    "getVault()": FunctionFragment;
    "initialize(address,address,address,address,address,address,address)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
    "liquidate(address,address)": FunctionFragment;
    "openPosition((address,bool,bool,uint256,uint256,uint256,uint160,bytes32))": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "removeLiquidity((address,int24,int24,uint128,uint256,uint256,uint256))": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setOwner(address)": FunctionFragment;
    "setTrustedForwarder(address)": FunctionFragment;
    "settleAllFunding(address)": FunctionFragment;
    "uniswapV3MintCallback(uint256,uint256,bytes)": FunctionFragment;
    "uniswapV3SwapCallback(int256,int256,bytes)": FunctionFragment;
    "unpause()": FunctionFragment;
    "updateOwner()": FunctionFragment;
    "versionRecipient()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [AddLiquidityParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelAllExcessOrders",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelExcessOrders",
    values: [string, string, BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "candidate", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "closePosition",
    values: [ClosePositionParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountValue",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getClearingHouseConfig",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getExchange",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getInsuranceFund",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOrderBook",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getQuoteToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTrustedForwarder",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUniswapV3Factory",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getVault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "liquidate",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "openPosition",
    values: [OpenPositionParamsStruct]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [RemoveLiquidityParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "settleAllFunding",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV3MintCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapV3SwapCallback",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "updateOwner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "versionRecipient",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelAllExcessOrders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelExcessOrders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "candidate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "closePosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClearingHouseConfig",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExchange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInsuranceFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOrderBook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getQuoteToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUniswapV3Factory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "liquidate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "openPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settleAllFunding",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV3MintCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapV3SwapCallback",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "versionRecipient",
    data: BytesLike
  ): Result;

  events: {
    "FundingPaymentSettled(address,address,int256)": EventFragment;
    "LiquidityChanged(address,address,address,int24,int24,int256,int256,int128,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "PositionChanged(address,address,int256,int256,uint256,int256,int256,uint256)": EventFragment;
    "PositionLiquidated(address,address,uint256,uint256,uint256,address)": EventFragment;
    "ReferredPositionChanged(bytes32)": EventFragment;
    "TrustedForwarderChanged(address)": EventFragment;
    "TrustedForwarderUpdated(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FundingPaymentSettled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LiquidityChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PositionLiquidated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReferredPositionChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TrustedForwarderChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TrustedForwarderUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export type FundingPaymentSettledEvent = TypedEvent<
  [string, string, BigNumber],
  { trader: string; baseToken: string; fundingPayment: BigNumber }
>;

export type FundingPaymentSettledEventFilter = TypedEventFilter<FundingPaymentSettledEvent>;

export type LiquidityChangedEvent = TypedEvent<
  [
    string,
    string,
    string,
    number,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
  {
    maker: string;
    baseToken: string;
    quoteToken: string;
    lowerTick: number;
    upperTick: number;
    base: BigNumber;
    quote: BigNumber;
    liquidity: BigNumber;
    quoteFee: BigNumber;
  }
>;

export type LiquidityChangedEventFilter = TypedEventFilter<LiquidityChangedEvent>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export type PausedEvent = TypedEvent<[string], { account: string }>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export type PositionChangedEvent = TypedEvent<
  [
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ],
  {
    trader: string;
    baseToken: string;
    exchangedPositionSize: BigNumber;
    exchangedPositionNotional: BigNumber;
    fee: BigNumber;
    openNotional: BigNumber;
    realizedPnl: BigNumber;
    sqrtPriceAfterX96: BigNumber;
  }
>;

export type PositionChangedEventFilter = TypedEventFilter<PositionChangedEvent>;

export type PositionLiquidatedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber, string],
  {
    trader: string;
    baseToken: string;
    positionNotional: BigNumber;
    positionSize: BigNumber;
    liquidationFee: BigNumber;
    liquidator: string;
  }
>;

export type PositionLiquidatedEventFilter = TypedEventFilter<PositionLiquidatedEvent>;

export type ReferredPositionChangedEvent = TypedEvent<
  [string],
  { referralCode: string }
>;

export type ReferredPositionChangedEventFilter = TypedEventFilter<ReferredPositionChangedEvent>;

export type TrustedForwarderChangedEvent = TypedEvent<
  [string],
  { forwarder: string }
>;

export type TrustedForwarderChangedEventFilter = TypedEventFilter<TrustedForwarderChangedEvent>;

export type TrustedForwarderUpdatedEvent = TypedEvent<
  [string],
  { trustedForwarder: string }
>;

export type TrustedForwarderUpdatedEventFilter = TypedEventFilter<TrustedForwarderUpdatedEvent>;

export type UnpausedEvent = TypedEvent<[string], { account: string }>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface PerpV2ClearingHouse extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PerpV2ClearingHouseInterface;

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
    addLiquidity(
      params: AddLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelAllExcessOrders(
      maker: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    cancelExcessOrders(
      maker: string,
      baseToken: string,
      orderIds: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    candidate(overrides?: CallOverrides): Promise<[string]>;

    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAccountBalance(overrides?: CallOverrides): Promise<[string]>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getClearingHouseConfig(overrides?: CallOverrides): Promise<[string]>;

    getExchange(overrides?: CallOverrides): Promise<[string]>;

    getInsuranceFund(overrides?: CallOverrides): Promise<[string]>;

    getOrderBook(overrides?: CallOverrides): Promise<[string]>;

    getQuoteToken(overrides?: CallOverrides): Promise<[string]>;

    getTrustedForwarder(overrides?: CallOverrides): Promise<[string]>;

    getUniswapV3Factory(overrides?: CallOverrides): Promise<[string]>;

    getVault(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      clearingHouseConfigArg: string,
      vaultArg: string,
      quoteTokenArg: string,
      uniV3FactoryArg: string,
      exchangeArg: string,
      accountBalanceArg: string,
      insuranceFundArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    liquidate(
      trader: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    removeLiquidity(
      params: RemoveLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTrustedForwarder(
      trustedForwarderArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settleAllFunding(
      trader: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    versionRecipient(overrides?: CallOverrides): Promise<[string]>;
  };

  addLiquidity(
    params: AddLiquidityParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelAllExcessOrders(
    maker: string,
    baseToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  cancelExcessOrders(
    maker: string,
    baseToken: string,
    orderIds: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  candidate(overrides?: CallOverrides): Promise<string>;

  closePosition(
    params: ClosePositionParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAccountBalance(overrides?: CallOverrides): Promise<string>;

  getAccountValue(
    trader: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getClearingHouseConfig(overrides?: CallOverrides): Promise<string>;

  getExchange(overrides?: CallOverrides): Promise<string>;

  getInsuranceFund(overrides?: CallOverrides): Promise<string>;

  getOrderBook(overrides?: CallOverrides): Promise<string>;

  getQuoteToken(overrides?: CallOverrides): Promise<string>;

  getTrustedForwarder(overrides?: CallOverrides): Promise<string>;

  getUniswapV3Factory(overrides?: CallOverrides): Promise<string>;

  getVault(overrides?: CallOverrides): Promise<string>;

  initialize(
    clearingHouseConfigArg: string,
    vaultArg: string,
    quoteTokenArg: string,
    uniV3FactoryArg: string,
    exchangeArg: string,
    accountBalanceArg: string,
    insuranceFundArg: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isTrustedForwarder(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  liquidate(
    trader: string,
    baseToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  openPosition(
    params: OpenPositionParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  removeLiquidity(
    params: RemoveLiquidityParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTrustedForwarder(
    trustedForwarderArg: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settleAllFunding(
    trader: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapV3MintCallback(
    amount0Owed: BigNumberish,
    amount1Owed: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapV3SwapCallback(
    amount0Delta: BigNumberish,
    amount1Delta: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateOwner(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  versionRecipient(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    addLiquidity(
      params: AddLiquidityParamsStruct,
      overrides?: CallOverrides
    ): Promise<AddLiquidityResponseStructOutput>;

    cancelAllExcessOrders(
      maker: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    cancelExcessOrders(
      maker: string,
      baseToken: string,
      orderIds: BytesLike[],
      overrides?: CallOverrides
    ): Promise<void>;

    candidate(overrides?: CallOverrides): Promise<string>;

    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { base: BigNumber; quote: BigNumber }>;

    getAccountBalance(overrides?: CallOverrides): Promise<string>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClearingHouseConfig(overrides?: CallOverrides): Promise<string>;

    getExchange(overrides?: CallOverrides): Promise<string>;

    getInsuranceFund(overrides?: CallOverrides): Promise<string>;

    getOrderBook(overrides?: CallOverrides): Promise<string>;

    getQuoteToken(overrides?: CallOverrides): Promise<string>;

    getTrustedForwarder(overrides?: CallOverrides): Promise<string>;

    getUniswapV3Factory(overrides?: CallOverrides): Promise<string>;

    getVault(overrides?: CallOverrides): Promise<string>;

    initialize(
      clearingHouseConfigArg: string,
      vaultArg: string,
      quoteTokenArg: string,
      uniV3FactoryArg: string,
      exchangeArg: string,
      accountBalanceArg: string,
      insuranceFundArg: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    liquidate(
      trader: string,
      baseToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber] & { base: BigNumber; quote: BigNumber }>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    removeLiquidity(
      params: RemoveLiquidityParamsStruct,
      overrides?: CallOverrides
    ): Promise<RemoveLiquidityResponseStructOutput>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setOwner(newOwner: string, overrides?: CallOverrides): Promise<void>;

    setTrustedForwarder(
      trustedForwarderArg: string,
      overrides?: CallOverrides
    ): Promise<void>;

    settleAllFunding(trader: string, overrides?: CallOverrides): Promise<void>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    updateOwner(overrides?: CallOverrides): Promise<void>;

    versionRecipient(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "FundingPaymentSettled(address,address,int256)"(
      trader?: string | null,
      baseToken?: string | null,
      fundingPayment?: null
    ): FundingPaymentSettledEventFilter;
    FundingPaymentSettled(
      trader?: string | null,
      baseToken?: string | null,
      fundingPayment?: null
    ): FundingPaymentSettledEventFilter;

    "LiquidityChanged(address,address,address,int24,int24,int256,int256,int128,uint256)"(
      maker?: string | null,
      baseToken?: string | null,
      quoteToken?: string | null,
      lowerTick?: null,
      upperTick?: null,
      base?: null,
      quote?: null,
      liquidity?: null,
      quoteFee?: null
    ): LiquidityChangedEventFilter;
    LiquidityChanged(
      maker?: string | null,
      baseToken?: string | null,
      quoteToken?: string | null,
      lowerTick?: null,
      upperTick?: null,
      base?: null,
      quote?: null,
      liquidity?: null,
      quoteFee?: null
    ): LiquidityChangedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "PositionChanged(address,address,int256,int256,uint256,int256,int256,uint256)"(
      trader?: string | null,
      baseToken?: string | null,
      exchangedPositionSize?: null,
      exchangedPositionNotional?: null,
      fee?: null,
      openNotional?: null,
      realizedPnl?: null,
      sqrtPriceAfterX96?: null
    ): PositionChangedEventFilter;
    PositionChanged(
      trader?: string | null,
      baseToken?: string | null,
      exchangedPositionSize?: null,
      exchangedPositionNotional?: null,
      fee?: null,
      openNotional?: null,
      realizedPnl?: null,
      sqrtPriceAfterX96?: null
    ): PositionChangedEventFilter;

    "PositionLiquidated(address,address,uint256,uint256,uint256,address)"(
      trader?: string | null,
      baseToken?: string | null,
      positionNotional?: null,
      positionSize?: null,
      liquidationFee?: null,
      liquidator?: null
    ): PositionLiquidatedEventFilter;
    PositionLiquidated(
      trader?: string | null,
      baseToken?: string | null,
      positionNotional?: null,
      positionSize?: null,
      liquidationFee?: null,
      liquidator?: null
    ): PositionLiquidatedEventFilter;

    "ReferredPositionChanged(bytes32)"(
      referralCode?: BytesLike | null
    ): ReferredPositionChangedEventFilter;
    ReferredPositionChanged(
      referralCode?: BytesLike | null
    ): ReferredPositionChangedEventFilter;

    "TrustedForwarderChanged(address)"(
      forwarder?: string | null
    ): TrustedForwarderChangedEventFilter;
    TrustedForwarderChanged(
      forwarder?: string | null
    ): TrustedForwarderChangedEventFilter;

    "TrustedForwarderUpdated(address)"(
      trustedForwarder?: null
    ): TrustedForwarderUpdatedEventFilter;
    TrustedForwarderUpdated(
      trustedForwarder?: null
    ): TrustedForwarderUpdatedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };

  estimateGas: {
    addLiquidity(
      params: AddLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelAllExcessOrders(
      maker: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    cancelExcessOrders(
      maker: string,
      baseToken: string,
      orderIds: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    candidate(overrides?: CallOverrides): Promise<BigNumber>;

    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAccountBalance(overrides?: CallOverrides): Promise<BigNumber>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClearingHouseConfig(overrides?: CallOverrides): Promise<BigNumber>;

    getExchange(overrides?: CallOverrides): Promise<BigNumber>;

    getInsuranceFund(overrides?: CallOverrides): Promise<BigNumber>;

    getOrderBook(overrides?: CallOverrides): Promise<BigNumber>;

    getQuoteToken(overrides?: CallOverrides): Promise<BigNumber>;

    getTrustedForwarder(overrides?: CallOverrides): Promise<BigNumber>;

    getUniswapV3Factory(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      clearingHouseConfigArg: string,
      vaultArg: string,
      quoteTokenArg: string,
      uniV3FactoryArg: string,
      exchangeArg: string,
      accountBalanceArg: string,
      insuranceFundArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    liquidate(
      trader: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    removeLiquidity(
      params: RemoveLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTrustedForwarder(
      trustedForwarderArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settleAllFunding(
      trader: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    versionRecipient(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      params: AddLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelAllExcessOrders(
      maker: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    cancelExcessOrders(
      maker: string,
      baseToken: string,
      orderIds: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    candidate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    closePosition(
      params: ClosePositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAccountBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAccountValue(
      trader: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClearingHouseConfig(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getExchange(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getInsuranceFund(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOrderBook(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getQuoteToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTrustedForwarder(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUniswapV3Factory(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      clearingHouseConfigArg: string,
      vaultArg: string,
      quoteTokenArg: string,
      uniV3FactoryArg: string,
      exchangeArg: string,
      accountBalanceArg: string,
      insuranceFundArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    liquidate(
      trader: string,
      baseToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    openPosition(
      params: OpenPositionParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeLiquidity(
      params: RemoveLiquidityParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTrustedForwarder(
      trustedForwarderArg: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settleAllFunding(
      trader: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapV3MintCallback(
      amount0Owed: BigNumberish,
      amount1Owed: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapV3SwapCallback(
      amount0Delta: BigNumberish,
      amount1Delta: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateOwner(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    versionRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
