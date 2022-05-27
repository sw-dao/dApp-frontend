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

export type PositionStruct = {
  component: string;
  module: string;
  unit: BigNumberish;
  positionState: BigNumberish;
  data: BytesLike;
};

export type PositionStructOutput = [
  string,
  string,
  BigNumber,
  number,
  string
] & {
  component: string;
  module: string;
  unit: BigNumber;
  positionState: number;
  data: string;
};

export type SetDetailsStruct = {
  name: string;
  symbol: string;
  manager: string;
  modules: string[];
  moduleStatuses: BigNumberish[];
  positions: PositionStruct[];
  totalSupply: BigNumberish;
};

export type SetDetailsStructOutput = [
  string,
  string,
  string,
  string[],
  number[],
  PositionStructOutput[],
  BigNumber
] & {
  name: string;
  symbol: string;
  manager: string;
  modules: string[];
  moduleStatuses: number[];
  positions: PositionStructOutput[];
  totalSupply: BigNumber;
};

export type StreamingFeeInfoStruct = {
  feeRecipient: string;
  streamingFeePercentage: BigNumberish;
  unaccruedFees: BigNumberish;
};

export type StreamingFeeInfoStructOutput = [string, BigNumber, BigNumber] & {
  feeRecipient: string;
  streamingFeePercentage: BigNumber;
  unaccruedFees: BigNumber;
};

export interface ProtocolViewerInterface extends utils.Interface {
  functions: {
    "batchFetchAllowances(address[],address[],address[])": FunctionFragment;
    "batchFetchBalancesOf(address[],address[])": FunctionFragment;
    "batchFetchDetails(address[],address[])": FunctionFragment;
    "batchFetchManagers(address[])": FunctionFragment;
    "batchFetchModuleStates(address[],address[])": FunctionFragment;
    "batchFetchStreamingFeeInfo(address,address[])": FunctionFragment;
    "getSetDetails(address,address[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "batchFetchAllowances",
    values: [string[], string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchFetchBalancesOf",
    values: [string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchFetchDetails",
    values: [string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchFetchManagers",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchFetchModuleStates",
    values: [string[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "batchFetchStreamingFeeInfo",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getSetDetails",
    values: [string, string[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "batchFetchAllowances",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchFetchBalancesOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchFetchDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchFetchManagers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchFetchModuleStates",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchFetchStreamingFeeInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSetDetails",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ProtocolViewer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ProtocolViewerInterface;

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
    batchFetchAllowances(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      _spenderAddresses: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    batchFetchBalancesOf(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    batchFetchDetails(
      _setTokens: string[],
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<[SetDetailsStructOutput[]]>;

    batchFetchManagers(
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    batchFetchModuleStates(
      _setTokens: string[],
      _modules: string[],
      overrides?: CallOverrides
    ): Promise<[number[][]]>;

    batchFetchStreamingFeeInfo(
      _streamingFeeModule: string,
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<[StreamingFeeInfoStructOutput[]]>;

    getSetDetails(
      _setToken: string,
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<[SetDetailsStructOutput]>;
  };

  batchFetchAllowances(
    _tokenAddresses: string[],
    _ownerAddresses: string[],
    _spenderAddresses: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  batchFetchBalancesOf(
    _tokenAddresses: string[],
    _ownerAddresses: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  batchFetchDetails(
    _setTokens: string[],
    _moduleList: string[],
    overrides?: CallOverrides
  ): Promise<SetDetailsStructOutput[]>;

  batchFetchManagers(
    _setTokens: string[],
    overrides?: CallOverrides
  ): Promise<string[]>;

  batchFetchModuleStates(
    _setTokens: string[],
    _modules: string[],
    overrides?: CallOverrides
  ): Promise<number[][]>;

  batchFetchStreamingFeeInfo(
    _streamingFeeModule: string,
    _setTokens: string[],
    overrides?: CallOverrides
  ): Promise<StreamingFeeInfoStructOutput[]>;

  getSetDetails(
    _setToken: string,
    _moduleList: string[],
    overrides?: CallOverrides
  ): Promise<SetDetailsStructOutput>;

  callStatic: {
    batchFetchAllowances(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      _spenderAddresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    batchFetchBalancesOf(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    batchFetchDetails(
      _setTokens: string[],
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<SetDetailsStructOutput[]>;

    batchFetchManagers(
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<string[]>;

    batchFetchModuleStates(
      _setTokens: string[],
      _modules: string[],
      overrides?: CallOverrides
    ): Promise<number[][]>;

    batchFetchStreamingFeeInfo(
      _streamingFeeModule: string,
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<StreamingFeeInfoStructOutput[]>;

    getSetDetails(
      _setToken: string,
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<SetDetailsStructOutput>;
  };

  filters: {};

  estimateGas: {
    batchFetchAllowances(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      _spenderAddresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchFetchBalancesOf(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchFetchDetails(
      _setTokens: string[],
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchFetchManagers(
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchFetchModuleStates(
      _setTokens: string[],
      _modules: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    batchFetchStreamingFeeInfo(
      _streamingFeeModule: string,
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSetDetails(
      _setToken: string,
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    batchFetchAllowances(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      _spenderAddresses: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchFetchBalancesOf(
      _tokenAddresses: string[],
      _ownerAddresses: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchFetchDetails(
      _setTokens: string[],
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchFetchManagers(
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchFetchModuleStates(
      _setTokens: string[],
      _modules: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    batchFetchStreamingFeeInfo(
      _streamingFeeModule: string,
      _setTokens: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSetDetails(
      _setToken: string,
      _moduleList: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}