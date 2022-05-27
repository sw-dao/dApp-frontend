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

export interface PerpV2PositionsInterface extends utils.Interface {
  functions: {
    "formatAdjustments(ISetToken,address,int256,int256)": FunctionFragment;
    "getNetQuoteBalance(ISetToken,address[],IAccountBalance)": FunctionFragment;
    "getPositionNotionalInfo(ISetToken,address[],IAccountBalance)": FunctionFragment;
    "getPositionUnitInfo(ISetToken,address[],IAccountBalance)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "formatAdjustments",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getNetQuoteBalance",
    values: [string, string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionNotionalInfo",
    values: [string, string[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "getPositionUnitInfo",
    values: [string, string[], string]
  ): string;

  decodeFunctionResult(
    functionFragment: "formatAdjustments",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNetQuoteBalance",
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

  events: {};
}

export interface PerpV2Positions extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PerpV2PositionsInterface;

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
    formatAdjustments(
      _setToken: string,
      _adjustComponent: string,
      _currentExternalPositionUnit: BigNumberish,
      _newExternalPositionUnit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;

    getNetQuoteBalance(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { netQuoteBalance: BigNumber }>;

    getPositionNotionalInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<[PositionNotionalInfoStructOutput[]]>;

    getPositionUnitInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<[PositionUnitInfoStructOutput[]]>;
  };

  formatAdjustments(
    _setToken: string,
    _adjustComponent: string,
    _currentExternalPositionUnit: BigNumberish,
    _newExternalPositionUnit: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber[], BigNumber[]]>;

  getNetQuoteBalance(
    _setToken: string,
    _baseTokens: string[],
    _perpAccountBalance: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPositionNotionalInfo(
    _setToken: string,
    _baseTokens: string[],
    _perpAccountBalance: string,
    overrides?: CallOverrides
  ): Promise<PositionNotionalInfoStructOutput[]>;

  getPositionUnitInfo(
    _setToken: string,
    _baseTokens: string[],
    _perpAccountBalance: string,
    overrides?: CallOverrides
  ): Promise<PositionUnitInfoStructOutput[]>;

  callStatic: {
    formatAdjustments(
      _setToken: string,
      _adjustComponent: string,
      _currentExternalPositionUnit: BigNumberish,
      _newExternalPositionUnit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[], BigNumber[]]>;

    getNetQuoteBalance(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionNotionalInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<PositionNotionalInfoStructOutput[]>;

    getPositionUnitInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<PositionUnitInfoStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    formatAdjustments(
      _setToken: string,
      _adjustComponent: string,
      _currentExternalPositionUnit: BigNumberish,
      _newExternalPositionUnit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNetQuoteBalance(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionNotionalInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPositionUnitInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    formatAdjustments(
      _setToken: string,
      _adjustComponent: string,
      _currentExternalPositionUnit: BigNumberish,
      _newExternalPositionUnit: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNetQuoteBalance(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPositionNotionalInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPositionUnitInfo(
      _setToken: string,
      _baseTokens: string[],
      _perpAccountBalance: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}