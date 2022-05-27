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

export interface UniswapPairPriceAdapterInterface extends utils.Interface {
  functions: {
    "addPool(address)": FunctionFragment;
    "allowedUniswapPools(uint256)": FunctionFragment;
    "controller()": FunctionFragment;
    "getAllowedUniswapPools()": FunctionFragment;
    "getPrice(address,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removePool(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "uniswapFactory()": FunctionFragment;
    "uniswapPoolsToSettings(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "addPool", values: [string]): string;
  encodeFunctionData(
    functionFragment: "allowedUniswapPools",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAllowedUniswapPools",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPrice",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "removePool", values: [string]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapPoolsToSettings",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "addPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "allowedUniswapPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllowedUniswapPools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "removePool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapPoolsToSettings",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;

export interface UniswapPairPriceAdapter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniswapPairPriceAdapterInterface;

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
    addPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    allowedUniswapPools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    controller(overrides?: CallOverrides): Promise<[string]>;

    getAllowedUniswapPools(overrides?: CallOverrides): Promise<[string[]]>;

    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removePool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapFactory(overrides?: CallOverrides): Promise<[string]>;

    uniswapPoolsToSettings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, boolean] & {
        tokenOne: string;
        tokenTwo: string;
        tokenOneBaseUnit: BigNumber;
        tokenTwoBaseUnit: BigNumber;
        isValid: boolean;
      }
    >;
  };

  addPool(
    _poolAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  allowedUniswapPools(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  controller(overrides?: CallOverrides): Promise<string>;

  getAllowedUniswapPools(overrides?: CallOverrides): Promise<string[]>;

  getPrice(
    _assetOne: string,
    _assetTwo: string,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber]>;

  owner(overrides?: CallOverrides): Promise<string>;

  removePool(
    _poolAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapFactory(overrides?: CallOverrides): Promise<string>;

  uniswapPoolsToSettings(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, BigNumber, BigNumber, boolean] & {
      tokenOne: string;
      tokenTwo: string;
      tokenOneBaseUnit: BigNumber;
      tokenTwoBaseUnit: BigNumber;
      isValid: boolean;
    }
  >;

  callStatic: {
    addPool(_poolAddress: string, overrides?: CallOverrides): Promise<void>;

    allowedUniswapPools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    controller(overrides?: CallOverrides): Promise<string>;

    getAllowedUniswapPools(overrides?: CallOverrides): Promise<string[]>;

    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber]>;

    owner(overrides?: CallOverrides): Promise<string>;

    removePool(_poolAddress: string, overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapFactory(overrides?: CallOverrides): Promise<string>;

    uniswapPoolsToSettings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, BigNumber, BigNumber, boolean] & {
        tokenOne: string;
        tokenTwo: string;
        tokenOneBaseUnit: BigNumber;
        tokenTwoBaseUnit: BigNumber;
        isValid: boolean;
      }
    >;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    addPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    allowedUniswapPools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    controller(overrides?: CallOverrides): Promise<BigNumber>;

    getAllowedUniswapPools(overrides?: CallOverrides): Promise<BigNumber>;

    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removePool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapFactory(overrides?: CallOverrides): Promise<BigNumber>;

    uniswapPoolsToSettings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    allowedUniswapPools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAllowedUniswapPools(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removePool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    uniswapPoolsToSettings(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}