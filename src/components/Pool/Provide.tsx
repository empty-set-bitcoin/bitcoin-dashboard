import React, { useState } from 'react';
import {
  Box, Button, IconArrowUp, IconCirclePlus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, providePool} from '../../utils/web3';
import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESB, WBTC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type ProvideProps = {
  poolAddress: string,
  user: string,
  rewarded: BigNumber,
  pairBalanceESB: BigNumber,
  pairBalanceWBTC: BigNumber,
  userWBTCBalance: BigNumber,
  userWBTCAllowance: BigNumber,
  status: number,
};

function Provide({
  poolAddress, user, rewarded, pairBalanceESB, pairBalanceWBTC, userWBTCBalance, userWBTCAllowance, status
}: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [wbtcAmount, setWbtcAmount] = useState(new BigNumber(0));

  const WBTCToESBRatio = pairBalanceWBTC.isZero() ? new BigNumber(1) : pairBalanceWBTC.div(pairBalanceESB);

  const onChangeAmountESB = (amountESB) => {
    if (!amountESB) {
      setProvideAmount(new BigNumber(0));
      setWbtcAmount(new BigNumber(0));
      return;
    }

    const amountESBBN = new BigNumber(amountESB)
    setProvideAmount(amountESBBN);

    const amountESBBU = toBaseUnitBN(amountESBBN, ESB.decimals);
    const newAmountWBTC = toTokenUnitsBN(
      amountESBBU.multipliedBy(WBTCToESBRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESB.decimals);
    setWbtcAmount(newAmountWBTC);
  };

  return (
    <Box heading="Provide">
      {userWBTCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESB"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="WBTC Balance" balance={userWBTCBalance} suffix={"WBTC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Provide liquidity using Pool rewards */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="ESB"
                    value={provideAmount}
                    setter={onChangeAmountESB}
                    disabled={status === 1}
                  />
                  <PriceSection label="Requires " amt={wbtcAmount} symbol=" WBTC"/>
                  <MaxButton
                    onClick={() => {
                      onChangeAmountESB(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconArrowUp/>}
                  label="Provide"
                  onClick={() => {
                    providePool(
                      poolAddress,
                      toBaseUnitBN(provideAmount, ESB.decimals),
                      (hash) => setProvideAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || status !== 0 || !isPos(provideAmount) || wbtcAmount.isGreaterThan(userWBTCBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESB"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="WBTC Balance" balance={userWBTCBalance} suffix={"WBTC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Approve Pool to spend WBTC */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Approve"
              onClick={() => {
                approve(WBTC.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Zap your rewards directly to LP by providing more WBTC </span>
      </div>
    </Box>
  );
}

export default Provide;
