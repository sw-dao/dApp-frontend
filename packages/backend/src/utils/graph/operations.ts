import { gql } from "apollo-boost";

const getTokenPricesDaily = gql`
  query getTokenPricesDaily(
    $symbols: [String!] = ""
    $from: Int! = 0
    $to: Int! = 0
    $chainId: String!
  ) {
    prices_tokens(
      where: {
        symbol: { _in: $symbols }
        network: { chainId: { _eq: $chainId } }
      }
    ) {
      symbol
      tokenset
      dailies(where: { epoch: { _gte: $from, _lte: $to } }) {
        price
        epoch
      }
    }
  }
`;
const getTokenPricesHourly = gql`
  query getTokenPricesHourly(
    $symbols: [String!] = ""
    $from: Int! = 0
    $to: Int! = 0
    $chainId: String!
  ) {
    prices_tokens(
      where: {
        symbol: { _in: $symbols }
        network: { chainId: { _eq: $chainId } }
      }
    ) {
      symbol
      tokenset
      hourlies(where: { epoch: { _gte: $from, _lte: $to } }) {
        epoch
        price
      }
    }
  }
`;
const getTokenPricesMinutes = gql`
  query getTokenPricesMinutes(
    $symbols: [String!] = ""
    $from: Int = 0
    $to: Int = 0
    $chainId: String!
  ) {
    prices_tokens(
      where: {
        symbol: { _in: $symbols }
        network: { chainId: { _eq: $chainId } }
      }
    ) {
      symbol
      tokenset
      minutes(where: { epoch: { _gte: $from, _lte: $to } }) {
        price
        epoch
      }
    }
  }
`;

const getTokenPricesAll = gql`
  query getTokenPricesAll(
    $symbols: [String!]
    $from: Int = 0
    $to: Int = 0
    $chainId: String!
  ) {
    prices_tokens(
      where: {
        symbol: { _in: $symbols }
        network: { chainId: { _eq: $chainId } }
      }
    ) {
      symbol
      tokenset
      dailies(where: { epoch: { _gte: $from, _lte: $to } }) {
        price
        epoch
      }
      minutes(where: { epoch: { _gte: $from, _lte: $to } }) {
        price
        epoch
      }
      minutes(where: { epoch: { _gte: $from, _lte: $to } }) {
        price
        epoch
      }
    }
  }
`;

const getExtendedTokenDetails = gql`
  query getExtendedTokenDetails($symbol: String!, $chainId: String!) {
    prices_token_infos(
      where: {
        token: {
          symbol: { _eq: $symbol }
          network: { chainId: { _eq: $chainId } }
        }
      }
    ) {
      currentPrice
      changePercentDay
      marketCap
      totalSupply
      volumeDay
      token {
        address
        symbol
        tokensetAllocationsByTokenid {
          currentPrice
          icon
          percentOfSet
          fullAmountInSet
          priceChange24Hr
          token {
            address
            symbol
          }
        }
      }
    }
  }
`;

export {
  getTokenPricesAll,
  getTokenPricesDaily,
  getTokenPricesHourly,
  getTokenPricesMinutes,
  getExtendedTokenDetails,
};
