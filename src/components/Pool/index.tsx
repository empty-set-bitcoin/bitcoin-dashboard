import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolStatusOf, getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
  getPoolFluidUntil
} from '../../utils/infura';
import {ESB, UNI, WBTC} from "../../constants/tokens";
import {POOL_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';
import { Header } from '@aragon/ui';

import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import PoolPageHeader from "./Header";
import Claim from "./Claim";
import Provide from "./Provide";
import IconHeader from "../common/IconHeader";
import Migrate from "./Migrate";
import {getLegacyPoolAddress, getPoolAddress} from "../../utils/pool";
import {BitcoinPool1} from "../../constants/contracts";



function Pool({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [poolAddress, setPoolAddress] = useState("");
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceESB, setPairBalanceESB] = useState(new BigNumber(0));
  const [pairBalanceWBTC, setPairBalanceWBTC] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userWBTCBalance, setUserWBTCBalance] = useState(new BigNumber(0));
  const [userWBTCAllowance, setUserWBTCAllowance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(new BigNumber(0));
  const [userClaimableBalance, setUserClaimableBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [legacyUserStagedBalance, setLegacyUserStagedBalance] = useState(new BigNumber(0));
  const [legacyUserBondedBalance, setLegacyUserBondedBalance] = useState(new BigNumber(0));
  const [legacyUserRewardedBalance, setLegacyUserRewardedBalance] = useState(new BigNumber(0));
  const [legacyUserClaimableBalance, setLegacyUserClaimableBalance] = useState(new BigNumber(0));
  const [legacyUserStatus, setLegacyUserStatus] = useState(0);
  const [lockup, setLockup] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setPoolAddress("");
      setPoolTotalBonded(new BigNumber(0));
      setPairBalanceESB(new BigNumber(0));
      setPairBalanceWBTC(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserWBTCBalance(new BigNumber(0));
      setUserWBTCAllowance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      setUserClaimableBalance(new BigNumber(0));
      setUserStatus(0);
      setUserStatusUnlocked(0);
      setLegacyUserStagedBalance(new BigNumber(0));
      setLegacyUserBondedBalance(new BigNumber(0));
      setLegacyUserRewardedBalance(new BigNumber(0));
      setLegacyUserClaimableBalance(new BigNumber(0));
      setLegacyUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddressStr = await getPoolAddress();
      const legacyPoolAddress = getLegacyPoolAddress(poolAddressStr);

      const [
        poolTotalBondedStr, pairBalanceESBStr, pairBalanceWBTCStr, balance, wbtcBalance,
        allowance, wbtcAllowance, stagedBalance, bondedBalance,
        rewardedBalance, claimableBalance, status, fluidUntilStr,
        legacyStagedBalance, legacyBondedBalance, legacyRewardedBalance, legacyClaimableBalance, legacyStatus
      ] = await Promise.all([
        getPoolTotalBonded(poolAddressStr),
        getTokenBalance(ESB.addr, UNI.addr),
        getTokenBalance(WBTC.addr, UNI.addr),
        getTokenBalance(UNI.addr, user),
        getTokenBalance(WBTC.addr, user),

        getTokenAllowance(UNI.addr, user, poolAddressStr),
        getTokenAllowance(WBTC.addr, user, poolAddressStr),
        getPoolBalanceOfStaged(poolAddressStr, user),
        getPoolBalanceOfBonded(poolAddressStr, user),

        getPoolBalanceOfRewarded(poolAddressStr, user),
        getPoolBalanceOfClaimable(poolAddressStr, user),
        getPoolStatusOf(poolAddressStr, user),
        getPoolFluidUntil(poolAddressStr, user),

        getPoolBalanceOfStaged(legacyPoolAddress, user),
        getPoolBalanceOfBonded(legacyPoolAddress, user),
        getPoolBalanceOfRewarded(legacyPoolAddress, user),
        getPoolBalanceOfClaimable(legacyPoolAddress, user),
        getPoolStatusOf(legacyPoolAddress, user)
      ]);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, ESB.decimals);
      const pairESBBalance = toTokenUnitsBN(pairBalanceESBStr, ESB.decimals);
      const pairWBTCBalance = toTokenUnitsBN(pairBalanceWBTCStr, WBTC.decimals);
      const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
      const userWBTCBalance = toTokenUnitsBN(wbtcBalance, WBTC.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals);
      const userRewardedBalance = toTokenUnitsBN(rewardedBalance, ESB.decimals);
      const userClaimableBalance = toTokenUnitsBN(claimableBalance, ESB.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const legacyUserStagedBalance = toTokenUnitsBN(legacyStagedBalance, UNI.decimals);
      const legacyUserBondedBalance = toTokenUnitsBN(legacyBondedBalance, UNI.decimals);
      const legacyUserRewardedBalance = toTokenUnitsBN(legacyRewardedBalance, UNI.decimals);
      const legacyUserClaimableBalance = toTokenUnitsBN(legacyClaimableBalance, ESB.decimals);
      const legacyUserStatus = parseInt(legacyStatus, 10);

      if (!isCancelled) {
        setPoolAddress(poolAddressStr);
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setPairBalanceESB(new BigNumber(pairESBBalance));
        setPairBalanceWBTC(new BigNumber(pairWBTCBalance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserUNIAllowance(new BigNumber(allowance));
        setUserWBTCAllowance(new BigNumber(wbtcAllowance));
        setUserWBTCBalance(new BigNumber(userWBTCBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
        setUserClaimableBalance(new BigNumber(userClaimableBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(fluidUntil);
        setLegacyUserStagedBalance(new BigNumber(legacyUserStagedBalance));
        setLegacyUserBondedBalance(new BigNumber(legacyUserBondedBalance));
        setLegacyUserRewardedBalance(new BigNumber(legacyUserRewardedBalance));
        setLegacyUserClaimableBalance(new BigNumber(legacyUserClaimableBalance));
        setLegacyUserStatus(legacyUserStatus);
        setLockup(poolAddressStr === BitcoinPool1 ? POOL_EXIT_LOCKUP_EPOCHS : 1);
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
  // Check for error in .call()
  const isRewardedNegative = legacyUserRewardedBalance.isGreaterThan(new BigNumber("1000000000000000000"));
  const hasLegacyBalance = legacyUserStagedBalance.isGreaterThan(0) || legacyUserClaimableBalance.isGreaterThan(0) || legacyUserBondedBalance.isGreaterThan(0);
  return (
    <>
      <IconHeader icon={<i className="fas fa-parachute-box"/>} text="LP Reward Pool"/>

      {hasLegacyBalance ?
        <>
          <Header primary={"Legacy Pool Migration"}/>

          <Migrate
            legacyPoolAddress={getLegacyPoolAddress(poolAddress)}
            isRewardNegative={isRewardedNegative}
            staged={legacyUserStagedBalance}
            claimable={legacyUserClaimableBalance}
            bonded={legacyUserBondedBalance}
            status={legacyUserStatus}
          />
        </>
        : ''}

      <PoolPageHeader
        accountUNIBalance={userUNIBalance}
        accountBondedBalance={userBondedBalance}
        accountRewardedESBBalance={userRewardedBalance}
        accountClaimableESBBalance={userClaimableBalance}
        poolTotalBonded={poolTotalBonded}
        accountPoolStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        poolAddress={poolAddress}
        user={user}
        balance={userUNIBalance}
        allowance={userUNIAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        poolAddress={poolAddress}
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      />

      <Claim
        poolAddress={poolAddress}
        claimable={userClaimableBalance}
        status={userStatus}
      />

      <Provide
        poolAddress={poolAddress}
        user={user}
        rewarded={isRewardedNegative ? new BigNumber(0) : userRewardedBalance}
        status={userStatus}
        pairBalanceESB={pairBalanceESB}
        pairBalanceWBTC={pairBalanceWBTC}
        userWBTCBalance={userWBTCBalance}
        userWBTCAllowance={userWBTCAllowance}
      />
    </>
  );
}

export default Pool;
