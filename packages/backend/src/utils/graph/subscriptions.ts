import { gql } from "apollo-boost";

const onUpdateDailyPrices = gql`
  subscription onUpdateDailyPrices($symbols: [String!] = "", $from: Int = 0) {
    prices_tokens(where: { symbol: { _in: $symbols } }) {
      symbol
      dailies(
        where: { epoch: { _gte: $from } }
        order_by: { epoch: desc }
        limit: 10
      ) {
        price
        epoch
      }
    }
  }
`;

const onUpdateHourlyPrices = gql`
  subscription onUpdateHourlyPrices($symbols: [String!] = "", $from: Int = 0) {
    prices_tokens(where: { symbol: { _in: $symbols } }) {
      symbol
      hourlies(
        where: { epoch: { _gte: $from } }
        order_by: { epoch: desc }
        limit: 10
      ) {
        price
        epoch
      }
    }
  }
`;

const onUpdateMinutePrices = gql`
  subscription onUpdateMinutePrices($symbols: [String!] = "", $from: Int = 0) {
    prices_tokens(where: { symbol: { _in: $symbols } }) {
      symbol
      minutes(
        where: { epoch: { _gte: $from } }
        order_by: { epoch: desc }
        limit: 10
      ) {
        price
        epoch
      }
    }
  }
`;

export { onUpdateDailyPrices, onUpdateHourlyPrices, onUpdateMinutePrices };
