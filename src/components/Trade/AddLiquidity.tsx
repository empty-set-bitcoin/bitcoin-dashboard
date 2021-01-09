import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESB, UNI, SBTC} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceESB: BigNumber,
  userBalanceSBTC: BigNumber,
  pairBalanceESB: BigNumber,
  pairBalanceSBTC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceESB,
  userBalanceSBTC,
  pairBalanceESB,
  pairBalanceSBTC,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountSBTC, setAmountSBTC] = useState(new BigNumber(0));
  const [amountESB, setAmountESB] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const SBTCToESBRatio = pairBalanceSBTC.isZero() ? new BigNumber(1) : pairBalanceSBTC.div(pairBalanceESB);
  const ESBToSBTCRatio = pairBalanceESB.isZero() ? new BigNumber(1) : pairBalanceESB.div(pairBalanceSBTC);

  const onChangeAmountSBTC = (amountSBTC) => {
    if (!amountSBTC) {
      setAmountESB(new BigNumber(0));
      setAmountSBTC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountSBTCBN = new BigNumber(amountSBTC)
    setAmountSBTC(amountSBTCBN);

    const amountSBTCBU = toBaseUnitBN(amountSBTCBN, SBTC.decimals);
    const newAmountESB = toTokenUnitsBN(
      amountSBTCBU.multipliedBy(ESBToSBTCRatio).integerValue(BigNumber.ROUND_FLOOR),
      SBTC.decimals);
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
      setAmountSBTC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountESBBN = new BigNumber(amountESB)
    setAmountESB(amountESBBN);

    const amountESBBU = toBaseUnitBN(amountESBBN, ESB.decimals);
    const newAmountSBTC = toTokenUnitsBN(
      amountESBBU.multipliedBy(SBTCToESBRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESB.decimals);
    setAmountSBTC(newAmountSBTC);

    const newAmountSBTCBU = toBaseUnitBN(newAmountSBTC, SBTC.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceSBTCBU = toBaseUnitBN(pairBalanceSBTC, SBTC.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountSBTCBU).div(pairBalanceSBTCBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="SBTC Balance" balance={userBalanceSBTC} />
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
                adornment="SBTC"
                value={amountSBTC}
                setter={onChangeAmountSBTC}
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
                  const amountSBTCBU = toBaseUnitBN(amountSBTC, SBTC.decimals);
                  addLiquidity(
                    amountESBBU,
                    amountSBTCBU,
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
