Simple Express app to serve as a mock API.

The purpose of this package is to enable testing of APIs that are unsupported on testnets

### Usage
1. `yarn` to install the packages
2. `yarn start` spins up the server on localhost:8080
3. Configure `.env.test` in backend with:
```
BASE_URL_COINGECKO=http://localhost:8080/api/coingecko/v3
BASE_URL_TOKENSETS=http://localhost:8080/api/tokensets/v2t
```

### Available data
#### Tokensets
`tokensets/v2/funds/`
**Test**
- DAI (= DPI production data)

#### CoinGecko
`coingecko/v3/coins/ethereum/contract/`
**Test**
- DAI: "0xad6d458402f60fd3bd25163575031acdce07538d",
- ETH: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", (= ETH production data)
- USDC:  "0x07865c6e87b9f70255377e024ace6630c1eaa37f", (= USDC production data)
- SWD: "0x52ddDF6a08d2787f2629d582921a684a9E4d2e31" (= ChainLink production data)

`coingecko/v3/coins/ethereum/contract/{address}/market_chart`
**Test** 
- USDC:  "0x07865c6e87b9f70255377e024ace6630c1eaa37f", (= USDC 1 day production data)
- SWD: "0x52ddDF6a08d2787f2629d582921a684a9E4d2e31" (= ChainLink 1 day production data)