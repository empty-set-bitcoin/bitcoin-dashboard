import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceESB: BigNumber,
  pairBalanceWBTC: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceESB, pairBalanceWBTC, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceWBTC.dividedBy(pairBalanceESB);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="ESB Price" balance={price} suffix={"WBTC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="ESB Liquidity" balance={pairBalanceESB} suffix={"ESB"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="WBTC Liquidity" balance={pairBalanceWBTC} suffix={"WBTC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <>
          <AddressBlock label="Uniswap Contract" address={uniswapPair} />
        </>
      </div>
    </div>
  );
}


export default TradePageHeader;
