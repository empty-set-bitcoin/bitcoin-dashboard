import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus, IconLock
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {approve, deposit, withdraw} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {ESB, ESBS} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type WithdrawDepositProps = {
  user: string
  balance: BigNumber,
  allowance: BigNumber,
  stagedBalance: BigNumber,
  status: number
};

function WithdrawDeposit({
  user, balance, allowance, stagedBalance, status
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Stage">
      {allowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"ESB"}/>
          </div>
          {/* Deposit Bitcoin into DAO */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="ESB"
                    value={depositAmount}
                    setter={setDepositAmount}
                    disabled={status !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setDepositAmount(balance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={status === 0 ? <IconCirclePlus/> : <IconLock/>}
                  label="Deposit"
                  onClick={() => {
                    deposit(
                      ESBS.addr,
                      toBaseUnitBN(depositAmount, ESB.decimals),
                    );
                  }}
                  disabled={status === 1 || !isPos(depositAmount) || depositAmount.isGreaterThan(balance)}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Withdraw Bitcoin from DAO */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '7em'}}>
                <>
                  <BigNumberInput
                    adornment="ESB"
                    value={withdrawAmount}
                    setter={setWithdrawAmount}
                    disabled={status !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setWithdrawAmount(stagedBalance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={status === 0 ? <IconCircleMinus/> : <IconLock/>}
                  label="Withdraw"
                  onClick={() => {
                    withdraw(
                      ESBS.addr,
                      toBaseUnitBN(withdrawAmount, ESB.decimals),
                    );
                  }}
                  disabled={status === 1 || !isPos(withdrawAmount) || withdrawAmount.isGreaterThan(stagedBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"ESB"}/>
          </div>
          <div style={{flexBasis: '35%'}}/>
          {/* Approve DAO to spend Bitcoin */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label="Approve"
              onClick={() => {
                approve(ESB.addr, ESBS.addr);
              }}
              disabled={user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default WithdrawDeposit;
