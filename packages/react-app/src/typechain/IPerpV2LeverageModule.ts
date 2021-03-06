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

export type AccountInfoStruct = {
  collateralBalance: BigNumberish;
  owedRealizedPnl: BigNumberish;
  pendingFundingPayments: BigNumberish;
  netQuoteBalance: BigNumberish;
};

export type AccountInfoStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  collateralBalance: BigNumber;
  owedRealizedPnl: BigNumber;
  pendingFundingPayments: BigNumber;
  netQuoteBalance: BigNumber;
};

export type PositionNotionalInfoStruct = {
  baseToken: string;
  baseBalance: BigNumberish;
  quoteBalance: BigNumberish;
};

export type PositionNotionalInfoStructOutput = [
  string,
  BigNumber,
  BigNumber
] & { baseToken: string; baseBalance: BigNumber; quoteBalance: BigNumber };

export type PositionUnitInfoStruct = {
  baseToken: string;
  baseUnit: BigNumberish;
  quoteUnit: BigNumberish;
};

export type PositionUnitInfoStructOutput = [string, BigNumber, BigNumber] & {
  baseToken: string;
  baseUnit: BigNumber;
  quoteUnit: BigNumber;
};

export interface IPerpV2LeverageModuleInterface extends utils.Interface {
  functions: {
    "collateralDecimals()": FunctionFragment;
    "collateralToken()": FunctionFragment;
    "deposit(address,uint256)": FunctionFragment;
    "getAMMSpotPrice(address)": FunctionFragment;
    "getAccountInfo(address)": FunctionFragment;
    "getIssuanceAdjustments(address,uint256)": FunctionFragment;
    "getPositionNotionalInfo(address)": FunctionFragment;
    "getPositionUnitInfo(address)": FunctionFragment;
    "getRedemptionAdjustments(address,uint256)": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "perpAccountBalance()": FunctionFragment;
    "perpClearingHouse()": FunctionFragment;
    "perpExchange()": FunctionFragment;
    "perpMarketRegistry()": FunctionFragment;
    "perpQuoter()": FunctionFragment;
    "perpVault()": FunctionFragment;
    "trade(address,address,int256,uint256)": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "collateralDecimals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "collateralToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAMMSpotPrice",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getAccountInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getIssuanceAdjustments",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionNotionalInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionUnitInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRedemptionAdjustments",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(
    functionFragment: "perpAccountBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "perpClearingHouse",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "perpExchange",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "perpMarketRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "perpQuoter",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "perpVault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "trade",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "collateralDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAMMSpotPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAccountInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getIssuanceAdjustments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPositionNotionalInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPositionUnitInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRedemptionAdjustments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "perpAccountBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "perpClearingHouse",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "perpExchange",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "perpMarketRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "perpQuoter", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "perpVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "trade", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "CollateralDeposited(address,address,uint256)": EventFragment;
    "CollateralWithdrawn(address,address,uint256)": EventFragment;
    "PerpTraded(address,address,uint256,uint256,uint256,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollateralDeposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "CollateralWithdrawn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PerpTraded"): EventFragment;
}

export type CollateralDepositedEvent = TypedEvent<
  [string, string, BigNumber],
  { _setToken: string; _collateralToken: string; _amountDeposited: BigNumber }
>;

export type CollateralDepositedEventFilter = TypedEventFilter<CollateralDepositedEvent>;

export type CollateralWithdrawnEvent = TypedEvent<
  [string, string, BigNumber],
  { _setToken: string; _collateralToken: string; _amountWithdrawn: BigNumber }
>;

export type CollateralWithdrawnEventFilter = TypedEventFilter<CollateralWithdrawnEvent>;

export type PerpTradedEvent = TypedEvent<
  [string, string, BigNumber, BigNumber, BigNumber, boolean],
  {
    _setToken: string;
    _baseToken: string;
    _deltaBase: BigNumber;
    _deltaQuote: BigNumber;
    _protocolFee: BigNumber;
    _isBuy: boolean;
  }
>;

export type PerpTradedEventFilter = TypedEventFilter<PerpTradedEvent>;

export interface IPerpV2LeverageModule extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPerpV2LeverageModuleInterface;

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
    collateralDecimals(overrides?: CallOverrides): Promise<[number]>;

    collateralToken(overrides?: CallOverrides): Promise<[string]>;

    deposit(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAMMSpotPrice(
      _baseToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price: BigNumber }>;

    getAccountInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<
      [AccountInfoStructOutput] & { accountInfo: AccountInfoStructOutput }
    >;

    getIssuanceAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPositionNotionalInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[PositionNotionalInfoStructOutput[]]>;

    getPositionUnitInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[PositionUnitInfoStructOutput[]]>;

    getRedemptionAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    initialize(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    perpAccountBalance(overrides?: CallOverrides): Promise<[string]>;

    perpClearingHouse(overrides?: CallOverrides): Promise<[string]>;

    perpExchange(overrides?: CallOverrides): Promise<[string]>;

    perpMarketRegistry(overrides?: CallOverrides): Promise<[string]>;

    perpQuoter(overrides?: CallOverrides): Promise<[string]>;

    perpVault(overrides?: CallOverrides): Promise<[string]>;

    trade(
      _setToken: string,
      _baseToken: string,
      _baseQuantityUnits: BigNumberish,
      _quoteBoundQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  collateralDecimals(overrides?: CallOverrides): Promise<number>;

  collateralToken(overrides?: CallOverrides): Promise<string>;

  deposit(
    _setToken: string,
    _collateralQuantityUnits: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAMMSpotPrice(
    _baseToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAccountInfo(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<AccountInfoStructOutput>;

  getIssuanceAdjustments(
    _setToken: string,
    _setTokenQuantity: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPositionNotionalInfo(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<PositionNotionalInfoStructOutput[]>;

  getPositionUnitInfo(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<PositionUnitInfoStructOutput[]>;

  getRedemptionAdjustments(
    _setToken: string,
    _setTokenQuantity: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  initialize(
    _setToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  perpAccountBalance(overrides?: CallOverrides): Promise<string>;

  perpClearingHouse(overrides?: CallOverrides): Promise<string>;

  perpExchange(overrides?: CallOverrides): Promise<string>;

  perpMarketRegistry(overrides?: CallOverrides): Promise<string>;

  perpQuoter(overrides?: CallOverrides): Promise<string>;

  perpVault(overrides?: CallOverrides): Promise<string>;

  trade(
    _setToken: string,
    _baseToken: string,
    _baseQuantityUnits: BigNumberish,
    _quoteBoundQuantityUnits: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    _setToken: string,
    _collateralQuantityUnits: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    collateralDecimals(overrides?: CallOverrides): Promise<number>;

    collateralToken(overrides?: CallOverrides): Promise<string>;

    deposit(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getAMMSpotPrice(
      _baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAccountInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<AccountInfoStructOutput>;

    getIssuanceAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;

    getPositionNotionalInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PositionNotionalInfoStructOutput[]>;

    getPositionUnitInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PositionUnitInfoStructOutput[]>;

    getRedemptionAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;

    initialize(_setToken: string, overrides?: CallOverrides): Promise<void>;

    perpAccountBalance(overrides?: CallOverrides): Promise<string>;

    perpClearingHouse(overrides?: CallOverrides): Promise<string>;

    perpExchange(overrides?: CallOverrides): Promise<string>;

    perpMarketRegistry(overrides?: CallOverrides): Promise<string>;

    perpQuoter(overrides?: CallOverrides): Promise<string>;

    perpVault(overrides?: CallOverrides): Promise<string>;

    trade(
      _setToken: string,
      _baseToken: string,
      _baseQuantityUnits: BigNumberish,
      _quoteBoundQuantityUnits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CollateralDeposited(address,address,uint256)"(
      _setToken?: string | null,
      _collateralToken?: null,
      _amountDeposited?: null
    ): CollateralDepositedEventFilter;
    CollateralDeposited(
      _setToken?: string | null,
      _collateralToken?: null,
      _amountDeposited?: null
    ): CollateralDepositedEventFilter;

    "CollateralWithdrawn(address,address,uint256)"(
      _setToken?: string | null,
      _collateralToken?: null,
      _amountWithdrawn?: null
    ): CollateralWithdrawnEventFilter;
    CollateralWithdrawn(
      _setToken?: string | null,
      _collateralToken?: null,
      _amountWithdrawn?: null
    ): CollateralWithdrawnEventFilter;

    "PerpTraded(address,address,uint256,uint256,uint256,bool)"(
      _setToken?: string | null,
      _baseToken?: string | null,
      _deltaBase?: null,
      _deltaQuote?: null,
      _protocolFee?: null,
      _isBuy?: null
    ): PerpTradedEventFilter;
    PerpTraded(
      _setToken?: string | null,
      _baseToken?: string | null,
      _deltaBase?: null,
      _deltaQuote?: null,
      _protocolFee?: null,
      _isBuy?: null
    ): PerpTradedEventFilter;
  };

  estimateGas: {
    collateralDecimals(overrides?: CallOverrides): Promise<BigNumber>;

    collateralToken(overrides?: CallOverrides): Promise<BigNumber>;

    deposit(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAMMSpotPrice(
      _baseToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAccountInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getIssuanceAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPositionNotionalInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionUnitInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRedemptionAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    initialize(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    perpAccountBalance(overrides?: CallOverrides): Promise<BigNumber>;

    perpClearingHouse(overrides?: CallOverrides): Promise<BigNumber>;

    perpExchange(overrides?: CallOverrides): Promise<BigNumber>;

    perpMarketRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    perpQuoter(overrides?: CallOverrides): Promise<BigNumber>;

    perpVault(overrides?: CallOverrides): Promise<BigNumber>;

    trade(
      _setToken: string,
      _baseToken: string,
      _baseQuantityUnits: BigNumberish,
      _quoteBoundQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    collateralDecimals(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    collateralToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deposit(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAMMSpotPrice(
      _baseToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAccountInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getIssuanceAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPositionNotionalInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPositionUnitInfo(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRedemptionAdjustments(
      _setToken: string,
      _setTokenQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    perpAccountBalance(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    perpClearingHouse(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    perpExchange(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    perpMarketRegistry(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    perpQuoter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    perpVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    trade(
      _setToken: string,
      _baseToken: string,
      _baseQuantityUnits: BigNumberish,
      _quoteBoundQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      _setToken: string,
      _collateralQuantityUnits: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
