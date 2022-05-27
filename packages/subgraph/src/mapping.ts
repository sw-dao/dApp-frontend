import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  SwdUser,
  Token,
  TokenBalance,
  Transaction,
  TransactionReceipt,
} from "../generated/schema";

import { Transfer } from "../generated/SWD/SWD";
import { newMockEvent } from "matchstick-as";

let zeroAddress = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);
// Every transfer amount to an updated transaction and tokenbalance state
export function handleTransfer(event: Transfer): void {
  if (event.params.from != zeroAddress || event.params.to != zeroAddress) {
    // User is from or to, depending on sell/buy action
    // Sell - user if from
    let userFrom = SwdUser.load(event.params.from.toHex());
    if (!userFrom) {
      userFrom = new SwdUser(event.params.from.toHex());
      userFrom.address = event.params.from;
    }

    let userTo = SwdUser.load(event.params.to.toHex());
    if (!userTo) {
      userTo = new SwdUser(event.params.to.toHex());
      userTo.address = event.params.to;
    }

    // Store event for tx overview
    let transactionReceipt = TransactionReceipt.load(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    );

    if (!transactionReceipt) {
      transactionReceipt = new TransactionReceipt(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
      );
    }
    transactionReceipt.hash = event.transaction.hash;
    transactionReceipt.from = event.params.from;
    transactionReceipt.to = event.params.to;
    transactionReceipt.value = event.params.value;
    transactionReceipt.token = event.address.toHex();
    transactionReceipt.timestamp = event.block.timestamp;
    transactionReceipt.blockNumber = event.block.number;

    // Create transaction
    let transaction = Transaction.load(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    );
    if (!transaction) {
      transaction = new Transaction(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
      );
      transaction.hash = event.transaction.hash;
      transaction.userFrom = userFrom.id;
      transaction.userTo = userTo.id;
      transaction.transactionReceipt = transactionReceipt.id;
    }

    transactionReceipt.transaction = transaction.id;

    // Does the token exist?
    let token = Token.load(event.address.toHex());
    if (!token) {
      token = new Token(event.address.toHex());
      token.address = event.address;
      token.save();
    }

    // Update sender balance
    updateUserBalance(userFrom, event, token);
    updateUserBalance(userTo, event, token);

    userFrom.save();
    userTo.save();
    transactionReceipt.save();
    transaction.save();
  }
}

function updateUserBalance(user: SwdUser, event: Transfer, token: Token): void {
  let tbuKey =
    user.id +
    "-" +
    event.address.toHex() +
    "-" +
    event.block.timestamp.toHexString();
  let tokenBalanceUser = TokenBalance.load(tbuKey);
  if (!tokenBalanceUser) {
    tokenBalanceUser = new TokenBalance(tbuKey);
    tokenBalanceUser.user = user.id;
    tokenBalanceUser.token = token.id;
    tokenBalanceUser.balance = event.params.value;
  } else if (user.address === event.params.from) {
    tokenBalanceUser.balance = tokenBalanceUser.balance.minus(
      event.params.value
    );
  } else if (user.address === event.params.to) {
    tokenBalanceUser.balance = tokenBalanceUser.balance.plus(
      event.params.value
    );
  }
  tokenBalanceUser.timestamp = event.block.timestamp;
  tokenBalanceUser.save();
}

export function createTransferEvent(
  id: string,
  from: string,
  to: string,
  value: BigInt
): Transfer {
  let mockEvent = newMockEvent();
  let transferEvent = new Transfer(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters
  );
  transferEvent.parameters = new Array();

  let fromParam = new ethereum.EventParam(
    "from",
    ethereum.Value.fromAddress(Address.fromString(from))
  );
  let toParam = new ethereum.EventParam(
    "to",
    ethereum.Value.fromAddress(Address.fromString(to))
  );
  let valueParam = new ethereum.EventParam(
    "value",
    ethereum.Value.fromUnsignedBigInt(value)
  );

  transferEvent.parameters.push(fromParam);
  transferEvent.parameters.push(toParam);
  transferEvent.parameters.push(valueParam);

  return transferEvent;
}
