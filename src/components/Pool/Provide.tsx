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
import {ESB, SBTC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type ProvideProps = {
  poolAddress: string,
  user: string,
  rewarded: BigNumber,
  pairBalanceESB: BigNumber,
  pairBalanceSBTC: BigNumber,
  userSBTCBalance: BigNumber,
  userSBTCAllowance: BigNumber,
  status: number,
};

function Provide({
  poolAddress, user, rewarded, pairBalanceESB, pairBalanceSBTC, userSBTCBalance, userSBTCAllowance, status
}: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [sbtcAmount, setSbtcAmount] = useState(new BigNumber(0));

  const SBTCToESBRatio = pairBalanceSBTC.isZero() ? new BigNumber(1) : pairBalanceSBTC.div(pairBalanceESB);

  const onChangeAmountESB = (amountESB) => {
    if (!amountESB) {
      setProvideAmount(new BigNumber(0));
      setSbtcAmount(new BigNumber(0));
      return;
    }

    const amountESBBN = new BigNumber(amountESB)
    setProvideAmount(amountESBBN);

    const amountESBBU = toBaseUnitBN(amountESBBN, ESB.decimals);
    const newAmountSBTC = toTokenUnitsBN(
      amountESBBU.multipliedBy(SBTCToESBRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESB.decimals);
    setSbtcAmount(newAmountSBTC);
  };

  return (
    <Box heading="Provide">
      {userSBTCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESB"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="SBTC Balance" balance={userSBTCBalance} suffix={"SBTC"} />
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
                  <PriceSection label="Requires " amt={sbtcAmount} symbol=" SBTC"/>
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
                  disabled={poolAddress === '' || status !== 0 || !isPos(provideAmount) || sbtcAmount.isGreaterThan(userSBTCBalance)}
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
            <BalanceBlock asset="SBTC Balance" balance={userSBTCBalance} suffix={"SBTC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Approve Pool to spend SBTC */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Approve"
              onClick={() => {
                approve(SBTC.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Zap your rewards directly to LP by providing more SBTC </span>
      </div>
    </Box>
  );
}

export default Provide;
