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

export interface NAVIssuanceHookMockInterface extends utils.Interface {
  functions: {
    "invokePreIssueHook(address,address,uint256,address,address)": FunctionFragment;
    "invokePreRedeemHook(address,uint256,address,address)": FunctionFragment;
    "retrievedRedeemQuantity()": FunctionFragment;
    "retrievedReserveAsset()": FunctionFragment;
    "retrievedReserveAssetQuantity()": FunctionFragment;
    "retrievedSender()": FunctionFragment;
    "retrievedSetToken()": FunctionFragment;
    "retrievedTo()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "invokePreIssueHook",
    values: [string, string, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "invokePreRedeemHook",
    values: [string, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedRedeemQuantity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedReserveAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedReserveAssetQuantity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedSender",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedSetToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "retrievedTo",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "invokePreIssueHook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "invokePreRedeemHook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedRedeemQuantity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedReserveAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedReserveAssetQuantity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedSender",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedSetToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "retrievedTo",
    data: BytesLike
  ): Result;

  events: {};
}

export interface NAVIssuanceHookMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NAVIssuanceHookMockInterface;

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
    invokePreIssueHook(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    invokePreRedeemHook(
      _setToken: string,
      _redeemQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    retrievedRedeemQuantity(overrides?: CallOverrides): Promise<[BigNumber]>;

    retrievedReserveAsset(overrides?: CallOverrides): Promise<[string]>;

    retrievedReserveAssetQuantity(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    retrievedSender(overrides?: CallOverrides): Promise<[string]>;

    retrievedSetToken(overrides?: CallOverrides): Promise<[string]>;

    retrievedTo(overrides?: CallOverrides): Promise<[string]>;
  };

  invokePreIssueHook(
    _setToken: string,
    _reserveAsset: string,
    _reserveAssetQuantity: BigNumberish,
    _sender: string,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  invokePreRedeemHook(
    _setToken: string,
    _redeemQuantity: BigNumberish,
    _sender: string,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  retrievedRedeemQuantity(overrides?: CallOverrides): Promise<BigNumber>;

  retrievedReserveAsset(overrides?: CallOverrides): Promise<string>;

  retrievedReserveAssetQuantity(overrides?: CallOverrides): Promise<BigNumber>;

  retrievedSender(overrides?: CallOverrides): Promise<string>;

  retrievedSetToken(overrides?: CallOverrides): Promise<string>;

  retrievedTo(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    invokePreIssueHook(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    invokePreRedeemHook(
      _setToken: string,
      _redeemQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    retrievedRedeemQuantity(overrides?: CallOverrides): Promise<BigNumber>;

    retrievedReserveAsset(overrides?: CallOverrides): Promise<string>;

    retrievedReserveAssetQuantity(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    retrievedSender(overrides?: CallOverrides): Promise<string>;

    retrievedSetToken(overrides?: CallOverrides): Promise<string>;

    retrievedTo(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    invokePreIssueHook(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    invokePreRedeemHook(
      _setToken: string,
      _redeemQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    retrievedRedeemQuantity(overrides?: CallOverrides): Promise<BigNumber>;

    retrievedReserveAsset(overrides?: CallOverrides): Promise<BigNumber>;

    retrievedReserveAssetQuantity(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    retrievedSender(overrides?: CallOverrides): Promise<BigNumber>;

    retrievedSetToken(overrides?: CallOverrides): Promise<BigNumber>;

    retrievedTo(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    invokePreIssueHook(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    invokePreRedeemHook(
      _setToken: string,
      _redeemQuantity: BigNumberish,
      _sender: string,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    retrievedRedeemQuantity(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    retrievedReserveAsset(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    retrievedReserveAssetQuantity(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    retrievedSender(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    retrievedSetToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    retrievedTo(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}