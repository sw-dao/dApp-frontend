/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
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

export interface DelegateRegistryInterface extends utils.Interface {
  functions: {
    "clearDelegate(bytes32)": FunctionFragment;
    "delegation(address,bytes32)": FunctionFragment;
    "setDelegate(bytes32,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "clearDelegate",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "delegation",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setDelegate",
    values: [BytesLike, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "clearDelegate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "delegation", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDelegate",
    data: BytesLike
  ): Result;

  events: {
    "ClearDelegate(address,bytes32,address)": EventFragment;
    "SetDelegate(address,bytes32,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ClearDelegate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDelegate"): EventFragment;
}

export type ClearDelegateEvent = TypedEvent<
  [string, string, string],
  { delegator: string; id: string; delegate: string }
>;

export type ClearDelegateEventFilter = TypedEventFilter<ClearDelegateEvent>;

export type SetDelegateEvent = TypedEvent<
  [string, string, string],
  { delegator: string; id: string; delegate: string }
>;

export type SetDelegateEventFilter = TypedEventFilter<SetDelegateEvent>;

export interface DelegateRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DelegateRegistryInterface;

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
    clearDelegate(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    delegation(
      arg0: string,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setDelegate(
      id: BytesLike,
      delegate: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  clearDelegate(
    id: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  delegation(
    arg0: string,
    arg1: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  setDelegate(
    id: BytesLike,
    delegate: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    clearDelegate(id: BytesLike, overrides?: CallOverrides): Promise<void>;

    delegation(
      arg0: string,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    setDelegate(
      id: BytesLike,
      delegate: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ClearDelegate(address,bytes32,address)"(
      delegator?: string | null,
      id?: BytesLike | null,
      delegate?: string | null
    ): ClearDelegateEventFilter;
    ClearDelegate(
      delegator?: string | null,
      id?: BytesLike | null,
      delegate?: string | null
    ): ClearDelegateEventFilter;

    "SetDelegate(address,bytes32,address)"(
      delegator?: string | null,
      id?: BytesLike | null,
      delegate?: string | null
    ): SetDelegateEventFilter;
    SetDelegate(
      delegator?: string | null,
      id?: BytesLike | null,
      delegate?: string | null
    ): SetDelegateEventFilter;
  };

  estimateGas: {
    clearDelegate(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    delegation(
      arg0: string,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDelegate(
      id: BytesLike,
      delegate: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    clearDelegate(
      id: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    delegation(
      arg0: string,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDelegate(
      id: BytesLike,
      delegate: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
