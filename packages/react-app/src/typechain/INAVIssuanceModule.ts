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

export interface INAVIssuanceModuleInterface extends utils.Interface {
  functions: {
    "issue(address,address,uint256,uint256,address)": FunctionFragment;
    "redeem(address,address,uint256,uint256,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "issue",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;

  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;

  events: {};
}

export interface INAVIssuanceModule extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: INAVIssuanceModuleInterface;

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
    issue(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _minSetTokenReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeem(
      _setToken: string,
      _reserveAsset: string,
      _setTokenQuantity: BigNumberish,
      _minReserveReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  issue(
    _setToken: string,
    _reserveAsset: string,
    _reserveAssetQuantity: BigNumberish,
    _minSetTokenReceiveQuantity: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeem(
    _setToken: string,
    _reserveAsset: string,
    _setTokenQuantity: BigNumberish,
    _minReserveReceiveQuantity: BigNumberish,
    _to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    issue(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _minSetTokenReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;

    redeem(
      _setToken: string,
      _reserveAsset: string,
      _setTokenQuantity: BigNumberish,
      _minReserveReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    issue(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _minSetTokenReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeem(
      _setToken: string,
      _reserveAsset: string,
      _setTokenQuantity: BigNumberish,
      _minReserveReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    issue(
      _setToken: string,
      _reserveAsset: string,
      _reserveAssetQuantity: BigNumberish,
      _minSetTokenReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeem(
      _setToken: string,
      _reserveAsset: string,
      _setTokenQuantity: BigNumberish,
      _minReserveReceiveQuantity: BigNumberish,
      _to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
