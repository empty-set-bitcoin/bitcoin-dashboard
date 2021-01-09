export const UNI = {
  addr: '0x88ff79eB2Bc5850F27315415da8685282C7610F9', // this is a uni pair for ESB and SBTC (will need to update for sBTC and ESB)
  decimals: 18,
  symbol: 'UNI',
};

export const SBTC = {
  addr: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // this needs to be sBTC contract
  decimals: 18, // I beleive this should be 18
  symbol: 'SBTC', // This should be updated to show sBTC
};

export const ESB = {
  addr: '0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723', // once contract is deployed this should be updated
  decimals: 18, // this is fine
  symbol: 'ESB', // this will be ESB
};

export const ESBS = {
  addr: '0x443D2f2755DB5942601fa062Cc248aAA153313D3', // once contract is deployed with the proxy this will need change
  decimals: 18, // fine
  symbol: 'ESBS', // will become ESBS after deployed
};
