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

export interface ModuleBaseV2MockInterface extends utils.Interface {
  functions: {
    "controller()": FunctionFragment;
    "initializeModuleOnSet(address)": FunctionFragment;
    "removeModule()": FunctionFragment;
    "removed()": FunctionFragment;
    "testGetAndValidateAdapter(string)": FunctionFragment;
    "testGetAndValidateAdapterWithHash(bytes32)": FunctionFragment;
    "testGetModuleFee(uint256,uint256)": FunctionFragment;
    "testIsSetManager(address,address)": FunctionFragment;
    "testIsSetPendingInitialization(address)": FunctionFragment;
    "testIsSetValidAndInitialized(address)": FunctionFragment;
    "testOnlyManagerAndValidSet(address)": FunctionFragment;
    "testOnlyModule(address)": FunctionFragment;
    "testOnlySetManager(address)": FunctionFragment;
    "testOnlyValidAndInitializedSet(address)": FunctionFragment;
    "testOnlyValidInitialization(address)": FunctionFragment;
    "testPayProtocolFeeFromSetToken(address,address,uint256)": FunctionFragment;
    "testTransferFrom(address,address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "controller",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initializeModuleOnSet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeModule",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "removed", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "testGetAndValidateAdapter",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testGetAndValidateAdapterWithHash",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "testGetModuleFee",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "testIsSetManager",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "testIsSetPendingInitialization",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testIsSetValidAndInitialized",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testOnlyManagerAndValidSet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testOnlyModule",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testOnlySetManager",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testOnlyValidAndInitializedSet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testOnlyValidInitialization",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "testPayProtocolFeeFromSetToken",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "testTransferFrom",
    values: [string, string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "controller", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initializeModuleOnSet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "removed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "testGetAndValidateAdapter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testGetAndValidateAdapterWithHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testGetModuleFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testIsSetManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testIsSetPendingInitialization",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testIsSetValidAndInitialized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testOnlyManagerAndValidSet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testOnlyModule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testOnlySetManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testOnlyValidAndInitializedSet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testOnlyValidInitialization",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testPayProtocolFeeFromSetToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "testTransferFrom",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ModuleBaseV2Mock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ModuleBaseV2MockInterface;

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
    controller(overrides?: CallOverrides): Promise<[string]>;

    initializeModuleOnSet(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeModule(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removed(overrides?: CallOverrides): Promise<[boolean]>;

    testGetAndValidateAdapter(
      _integrationName: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    testGetAndValidateAdapterWithHash(
      _integrationHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    testGetModuleFee(
      _feeIndex: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    testIsSetManager(
      _setToken: string,
      _toCheck: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    testIsSetPendingInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    testIsSetValidAndInitialized(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    testOnlyManagerAndValidSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[void]>;

    testOnlyModule(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[void]>;

    testOnlySetManager(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[void]>;

    testOnlyValidAndInitializedSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[void]>;

    testOnlyValidInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<[void]>;

    testPayProtocolFeeFromSetToken(
      _setToken: string,
      _component: string,
      _feeQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    testTransferFrom(
      _token: string,
      _from: string,
      _to: string,
      _quantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  controller(overrides?: CallOverrides): Promise<string>;

  initializeModuleOnSet(
    _setToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeModule(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removed(overrides?: CallOverrides): Promise<boolean>;

  testGetAndValidateAdapter(
    _integrationName: string,
    overrides?: CallOverrides
  ): Promise<string>;

  testGetAndValidateAdapterWithHash(
    _integrationHash: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  testGetModuleFee(
    _feeIndex: BigNumberish,
    _quantity: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  testIsSetManager(
    _setToken: string,
    _toCheck: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  testIsSetPendingInitialization(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  testIsSetValidAndInitialized(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  testOnlyManagerAndValidSet(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<void>;

  testOnlyModule(_setToken: string, overrides?: CallOverrides): Promise<void>;

  testOnlySetManager(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<void>;

  testOnlyValidAndInitializedSet(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<void>;

  testOnlyValidInitialization(
    _setToken: string,
    overrides?: CallOverrides
  ): Promise<void>;

  testPayProtocolFeeFromSetToken(
    _setToken: string,
    _component: string,
    _feeQuantity: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  testTransferFrom(
    _token: string,
    _from: string,
    _to: string,
    _quantity: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    controller(overrides?: CallOverrides): Promise<string>;

    initializeModuleOnSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    removeModule(overrides?: CallOverrides): Promise<void>;

    removed(overrides?: CallOverrides): Promise<boolean>;

    testGetAndValidateAdapter(
      _integrationName: string,
      overrides?: CallOverrides
    ): Promise<string>;

    testGetAndValidateAdapterWithHash(
      _integrationHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    testGetModuleFee(
      _feeIndex: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testIsSetManager(
      _setToken: string,
      _toCheck: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    testIsSetPendingInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    testIsSetValidAndInitialized(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    testOnlyManagerAndValidSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    testOnlyModule(_setToken: string, overrides?: CallOverrides): Promise<void>;

    testOnlySetManager(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    testOnlyValidAndInitializedSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    testOnlyValidInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    testPayProtocolFeeFromSetToken(
      _setToken: string,
      _component: string,
      _feeQuantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    testTransferFrom(
      _token: string,
      _from: string,
      _to: string,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    controller(overrides?: CallOverrides): Promise<BigNumber>;

    initializeModuleOnSet(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeModule(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removed(overrides?: CallOverrides): Promise<BigNumber>;

    testGetAndValidateAdapter(
      _integrationName: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testGetAndValidateAdapterWithHash(
      _integrationHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testGetModuleFee(
      _feeIndex: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testIsSetManager(
      _setToken: string,
      _toCheck: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testIsSetPendingInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testIsSetValidAndInitialized(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testOnlyManagerAndValidSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testOnlyModule(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testOnlySetManager(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testOnlyValidAndInitializedSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testOnlyValidInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    testPayProtocolFeeFromSetToken(
      _setToken: string,
      _component: string,
      _feeQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    testTransferFrom(
      _token: string,
      _from: string,
      _to: string,
      _quantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    controller(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initializeModuleOnSet(
      _setToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeModule(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    testGetAndValidateAdapter(
      _integrationName: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testGetAndValidateAdapterWithHash(
      _integrationHash: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testGetModuleFee(
      _feeIndex: BigNumberish,
      _quantity: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testIsSetManager(
      _setToken: string,
      _toCheck: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testIsSetPendingInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testIsSetValidAndInitialized(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testOnlyManagerAndValidSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testOnlyModule(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testOnlySetManager(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testOnlyValidAndInitializedSet(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testOnlyValidInitialization(
      _setToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    testPayProtocolFeeFromSetToken(
      _setToken: string,
      _component: string,
      _feeQuantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    testTransferFrom(
      _token: string,
      _from: string,
      _to: string,
      _quantity: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
