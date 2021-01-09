import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getBalanceBonded,
  getBalanceOfStaged, getFluidUntil, getLockedUntil,
  getStatusOf, getTokenAllowance,
  getTokenBalance, getTokenTotalSupply,
} from '../../utils/infura';
import {ESB, ESBS} from "../../constants/tokens";
import {DAO_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';

import AccountPageHeader from "./Header";
import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import IconHeader from "../common/IconHeader";
import {getPoolAddress} from "../../utils/pool";
import {DollarPool4} from "../../constants/contracts";

function Wallet({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [userESBBalance, setUserESBBalance] = useState(new BigNumber(0));
  const [userESBAllowance, setUserESBAllowance] = useState(new BigNumber(0));
  const [userESBSBalance, setUserESBSBalance] = useState(new BigNumber(0));
  const [totalESBSSupply, setTotalESBSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserESBBalance(new BigNumber(0));
      setUserESBAllowance(new BigNumber(0));
      setUserESBSBalance(new BigNumber(0));
      setTotalESBSSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        esbBalance, esbAllowance, esbsBalance, esbsSupply, stagedBalance, bondedBalance, status, poolAddress,
        fluidUntilStr, lockedUntilStr
      ] = await Promise.all([
        getTokenBalance(ESB.addr, user),
        getTokenAllowance(ESB.addr, user, ESBS.addr),
        getTokenBalance(ESBS.addr, user),
        getTokenTotalSupply(ESBS.addr),
        getBalanceOfStaged(ESBS.addr, user),
        getBalanceBonded(ESBS.addr, user),
        getStatusOf(ESBS.addr, user),
        getPoolAddress(),

        getFluidUntil(ESBS.addr, user),
        getLockedUntil(ESBS.addr, user),
      ]);

      const userESBBalance = toTokenUnitsBN(esbBalance, ESB.decimals);
      const userESBSBalance = toTokenUnitsBN(esbsBalance, ESBS.decimals);
      const totalESBSSupply = toTokenUnitsBN(esbsSupply, ESBS.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, ESBS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, ESBS.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setUserESBBalance(new BigNumber(userESBBalance));
        setUserESBAllowance(new BigNumber(esbAllowance));
        setUserESBSBalance(new BigNumber(userESBSBalance));
        setTotalESBSSupply(new BigNumber(totalESBSSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil))
        setLockup(poolAddress === DollarPool4 ? DAO_EXIT_LOCKUP_EPOCHS : 1);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-dot-circle"/>} text="DAO"/>

      <AccountPageHeader
        accountESBBalance={userESBBalance}
        accountESBSBalance={userESBSBalance}
        totalESBSSupply={totalESBSSupply}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        user={user}
        balance={userESBBalance}
        allowance={userESBAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      />
    </>
  );
}

export default Wallet;
