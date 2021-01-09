import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {buyESB, sellESB} from '../../utils/web3';

import { getCost, getProceeds } from '../../utils/infura';


import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESB, SBTC} from "../../constants/tokens";
import {decreaseWithSlippage, increaseWithSlippage} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type UniswapBuySellProps = {
  userBalanceESB: BigNumber,
  pairBalanceESB: BigNumber
};

function UniswapBuySell({
  userBalanceESB, pairBalanceESB
}: UniswapBuySellProps) {
  const [buyAmount, setBuyAmount] = useState(new BigNumber(0));
  const [sellAmount, setSellAmount] = useState(new BigNumber(0));
  const [cost, setCost] = useState(new BigNumber(0));
  const [proceeds, setProceeds] = useState(new BigNumber(0));

  const updateCost = async (buyAmount) => {
    const buyAmountBN = new BigNumber(buyAmount);
    if (buyAmountBN.lte(new BigNumber(0))) {
      setCost(new BigNumber(0));
      return;
    }
    if (buyAmountBN.gte(pairBalanceESB)) {
      setCost(new BigNumber(0));
      return;
    }
    const cost = await getCost(toBaseUnitBN(buyAmountBN, ESB.decimals));
    setCost(toTokenUnitsBN(new BigNumber(cost), SBTC.decimals));
  };

  const updateProceeds = async (sellAmount) => {
    const sellAmountBN = new BigNumber(sellAmount);
    if (sellAmountBN.lte(new BigNumber(0))) {
      setProceeds(new BigNumber(0));
      return;
    }
    const proceeds = await getProceeds(toBaseUnitBN(sellAmountBN, ESB.decimals));
    setProceeds(toTokenUnitsBN(new BigNumber(proceeds), SBTC.decimals));
  };

  return (
    <Box heading="Exchange">
      <div style={{ display: 'flex' }}>
        {/* total Issued */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="Bitcoin Balance" balance={userBalanceESB} suffix={" ESB"}/>
        </div>
        {/* Buy Token from Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="ESB"
                  value={buyAmount}
                  setter={(value) => {
                    setBuyAmount(value);
                    isPos(value) ? updateCost(value) : updateCost('0');
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Buy"
                onClick={() => {
                  buyESB(
                    toBaseUnitBN(buyAmount, ESB.decimals),
                    increaseWithSlippage(toBaseUnitBN(cost, SBTC.decimals)),
                  );
                }}
              />
            </div>
          </div>
          <PriceSection label="Cost: " amt={cost} symbol=" SBTC" />
        </div>
        <div style={{ width: '6%' }} />
        {/* Sell Token on Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="ESB"
                  value={sellAmount}
                  setter={(value) => {
                    setSellAmount(value);
                    isPos(value) ? updateProceeds(value) : updateProceeds('0');
                  }}
                />
                <MaxButton
                  onClick={() => {
                    setSellAmount(userBalanceESB);
                    updateProceeds(userBalanceESB);
                  }}
                />
                <PriceSection label="Proceeds: " amt={proceeds} symbol=" SBTC"/>
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label="Sell"
                onClick={() => {
                  sellESB(
                    toBaseUnitBN(sellAmount, ESB.decimals),
                    decreaseWithSlippage(toBaseUnitBN(proceeds, SBTC.decimals)),
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default UniswapBuySell;