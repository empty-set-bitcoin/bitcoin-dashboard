export const UNI = {
  addr: '0x10a0A9EF463bDE88A22137aD1e32240ea9CD559D', // this is a uni pair for ESB and WBTC (will need to update for WBTC and ESB)
  decimals: 18,
  symbol: 'UNI',
};

export const WBTC = {
  addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // this needs to be WBTC contract
  decimals: 8, // I beleive this should be 18
  symbol: 'WBTC', // This should be updated to show WBTC
};

export const ESB = {
  addr: '0xC929e85DAB215705b0473c846196Afc94DFe2455', // once contract is deployed this should be updated
  decimals: 18, // this is fine
  symbol: 'ESB', // this will be ESB
};

export const ESBS = {
  addr: '0xdbab64b9669e3290b367a1c261a44323a62a7ae4', // once contract is deployed with the proxy this will need change
  decimals: 18, // fine
  symbol: 'ESBS', // will become ESBS after deployed
};
