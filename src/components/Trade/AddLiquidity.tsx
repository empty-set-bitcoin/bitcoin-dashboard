import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESB, UNI, WBTC} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceESB: BigNumber,
  userBalanceWBTC: BigNumber,
  pairBalanceESB: BigNumber,
  pairBalanceWBTC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceESB,
  userBalanceWBTC,
  pairBalanceESB,
  pairBalanceWBTC,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountWBTC, setAmountWBTC] = useState(new BigNumber(0));
  const [amountESB, setAmountESB] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const WBTCToESBRatio = pairBalanceWBTC.isZero() ? new BigNumber(1) : pairBalanceWBTC.div(pairBalanceESB);
  const ESBToWBTCRatio = pairBalanceESB.isZero() ? new BigNumber(1) : pairBalanceESB.div(pairBalanceWBTC);

  const onChangeAmountWBTC = (amountWBTC) => {
    if (!amountWBTC) {
      setAmountESB(new BigNumber(0));
      setAmountWBTC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountWBTCBN = new BigNumber(amountWBTC)
    setAmountWBTC(amountWBTCBN);

    const amountWBTCBU = toBaseUnitBN(amountWBTCBN, WBTC.decimals);
    const newAmountESB = toTokenUnitsBN(
      amountWBTCBU.multipliedBy(ESBToWBTCRatio).integerValue(BigNumber.ROUND_FLOOR),
      WBTC.decimals);
    setAmountESB(newAmountESB);

    const newAmountESBBU = toBaseUnitBN(newAmountESB, ESB.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceESBBU = toBaseUnitBN(pairBalanceESB, ESB.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountESBBU).div(pairBalanceESBBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountESB = (amountESB) => {
    if (!amountESB) {
      setAmountESB(new BigNumber(0));
      setAmountWBTC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountESBBN = new BigNumber(amountESB)
    setAmountESB(amountESBBN);

    const amountESBBU = toBaseUnitBN(amountESBBN, ESB.decimals);
    const newAmountWBTC = toTokenUnitsBN(
      amountESBBU.multipliedBy(WBTCToESBRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESB.decimals);
    setAmountWBTC(newAmountWBTC);

    const newAmountWBTCBU = toBaseUnitBN(newAmountWBTC, WBTC.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceWBTCBU = toBaseUnitBN(pairBalanceWBTC, WBTC.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountWBTCBU).div(pairBalanceWBTCBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="WBTC Balance" balance={userBalanceWBTC} />
        </div>
        {/* Add liquidity to pool */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <BigNumberInput
                  adornment="ESB"
                  value={amountESB}
                  setter={onChangeAmountESB}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountESB(userBalanceESB);
                  }}
                />
              </>
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="WBTC"
                value={amountWBTC}
                setter={onChangeAmountWBTC}
              />
              <PriceSection label="Mint " amt={amountUNI} symbol=" Pool Tokens" />
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Add Liquidity"
                onClick={() => {
                  const amountESBBU = toBaseUnitBN(amountESB, ESB.decimals);
                  const amountWBTCBU = toBaseUnitBN(amountWBTC, WBTC.decimals);
                  addLiquidity(
                    amountESBBU,
                    amountWBTCBU,
                    SLIPPAGE,
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


export default AddLiquidity;
