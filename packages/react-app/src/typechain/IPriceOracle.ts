/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface IPriceOracleInterface extends utils.Interface {
  functions: {
    "getPrice(address,address)": FunctionFragment;
    "masterQuoteAsset()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getPrice",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "masterQuoteAsset",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "masterQuoteAsset",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPriceOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPriceOracleInterface;

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
    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    masterQuoteAsset(overrides?: CallOverrides): Promise<[string]>;
  };

  getPrice(
    _assetOne: string,
    _assetTwo: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  masterQuoteAsset(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    masterQuoteAsset(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    masterQuoteAsset(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getPrice(
      _assetOne: string,
      _assetTwo: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    masterQuoteAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
