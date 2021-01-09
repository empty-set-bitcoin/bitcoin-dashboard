import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceESB: BigNumber,
  pairBalanceSBTC: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceESB, pairBalanceSBTC, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceSBTC.dividedBy(pairBalanceESB);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="ESB Price" balance={price} suffix={"SBTC"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="ESB Liquidity" balance={pairBalanceESB} suffix={"ESB"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="SBTC Liquidity" balance={pairBalanceSBTC} suffix={"SBTC"}/>
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
