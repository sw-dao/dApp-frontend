import { SwdUser, TransactionReceipt } from "../generated/schema";
import {
  clearStore,
  test,
  assert,
} from "../../../node_modules/matchstick-as/assembly/index";
import { Address, Value, BigInt } from "@graphprotocol/graph-ts";
import { handleTransfer, createTransferEvent } from "../src/mapping";

test("Create SwdUser", () => {
  let customUser = new SwdUser("434");
  customUser.set(
    "address",
    Value.fromAddress(
      Address.fromString("0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91")
    )
  );

  customUser.save();

  assert.fieldEquals(
    "SwdUser",
    "434",
    "address",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase()
  );

  clearStore();
});

test("Handle Transfer", () => {
  // Initialise event (this can be generalised into a separate function)
  let firstTransfer = createTransferEvent(
    "first",
    "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91",
    new BigInt(10)
  );
 
  // Call mappings
  handleTransfer(firstTransfer);
  // Assert the state of the store
  // User exists
  assert.fieldEquals(
    "SwdUser",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase(),
    "address",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase()
  );

  //Tx Receipt
  const transactionReceiptId =
    firstTransfer.transaction.hash.toHex() +
    "-" +
    firstTransfer.logIndex.toString();


  assert.fieldEquals(
    "TransactionReceipt",
    transactionReceiptId,
    "from",
    "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7".toLowerCase()
  );
  assert.fieldEquals(
    "TransactionReceipt",
    transactionReceiptId,
    "to",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase()
  );

  assert.fieldEquals(
    "TransactionReceipt",
    transactionReceiptId,
    "value",
    new BigInt(10).toString()
  );

  // Tx

  const transactionId =
    firstTransfer.transaction.hash.toHex() +
    "-" +
    firstTransfer.logIndex.toString();

  assert.fieldEquals(
    "Transaction",
    transactionId,
    "user",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase()
  );

  assert.fieldEquals(
    "Transaction",
    transactionId,
    "transactionReceipt",
    transactionReceiptId
  );

  // Token
  const tokenId = firstTransfer.address.toHex();
  assert.fieldEquals("Token", tokenId, "address", tokenId);

  // TokenBalance
  const tokenBalanceId =
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase() +
    "-" +
    firstTransfer.address.toHex() +
    "-" +
    firstTransfer.block.timestamp.toHexString();

  assert.fieldEquals(
    "TokenBalance",
    tokenBalanceId,
    "user",
    "0x6E4f821eD0a4a99Fc0061FCE01246490505Ddc91".toLowerCase()
  );
  assert.fieldEquals("TokenBalance", tokenBalanceId, "token", tokenId);
  assert.fieldEquals(
    "TokenBalance",
    tokenBalanceId,
    "balance",
    new BigInt(10).toString()
  );
  assert.fieldEquals(
    "TokenBalance",
    tokenBalanceId,
    "timestamp",
    firstTransfer.block.timestamp.toString()
  );

  // Clear the store before the next test (optional)
  clearStore();
});
