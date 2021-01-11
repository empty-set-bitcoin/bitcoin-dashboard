import React, {useEffect, useState} from 'react';
import {
  DataView, Button, IconCirclePlus
} from '@aragon/ui';

import {getBatchBalanceOfCoupons, getBatchCouponsExpiration, getCouponEpochs} from '../../utils/infura';
import {ESB, ESBS} from "../../constants/tokens";
import {formatBN, toBaseUnitBN, toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import {redeemCoupons} from "../../utils/web3";

type PurchaseHistoryProps = {
  user: string,
  hideRedeemed: boolean,
  totalRedeemable: BigNumber
};

function PurchaseHistory({
  user, hideRedeemed, totalRedeemable
}: PurchaseHistoryProps) {
  const [epochs, setEpochs] = useState([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const epochsFromEvents = await getCouponEpochs(ESBS.addr, user);
      const epochNumbers = epochsFromEvents.map(e => parseInt(e.epoch));
      const balanceOfCoupons = await getBatchBalanceOfCoupons(ESBS.addr, user, epochNumbers);
      const couponsExpirations = await getBatchCouponsExpiration(ESBS.addr, epochNumbers);

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.balance = new BigNumber(balanceOfCoupons[i]);
        epoch.expiration = couponsExpirations[i];
        return epoch;
      });

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs);
        setInitialized(true);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, totalRedeemable]);

  return (
    <DataView
      fields={['Epoch', 'Purchased', 'Balance', 'Expires', '']}
      status={ initialized ? 'default' : 'loading' }
      // @ts-ignore
      entries={hideRedeemed ? epochs.filter((epoch) => !epoch.balance.isZero()) : epochs}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(epoch) => [
        epoch.epoch.toString(),
        formatBN(toTokenUnitsBN(epoch.coupons, ESB.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.balance, ESB.decimals), 2),
        epoch.expiration.toString(),
        <Button
          icon={<IconCirclePlus />}
          label="Redeem"
          onClick={() => redeemCoupons(
            ESBS.addr,
            epoch.epoch,
            epoch.balance.isGreaterThan(toBaseUnitBN(totalRedeemable, ESB.decimals))
              ? toBaseUnitBN(totalRedeemable, ESB.decimals)
              : epoch.balance
          )}
          disabled={epoch.balance.isZero()}
        />
      ]}
    />
  );
}

export default PurchaseHistory;
