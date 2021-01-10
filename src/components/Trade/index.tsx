import React, { useState, useEffect } from "react";
import { LinkBase, Box } from "@aragon/ui";

import BigNumber from "bignumber.js";
import { getTokenBalance } from "../../utils/infura";
import { toTokenUnitsBN } from "../../utils/number";

import TradePageHeader from "./Header";
import { ESB, UNI, WBTC } from "../../constants/tokens";
import IconHeader from "../common/IconHeader";

function UniswapPool({ user }: { user: string }) {
  const [pairBalanceESB, setPairBalanceESB] = useState(new BigNumber(0));
  const [pairBalanceWBTC, setPairBalanceWBTC] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [pairBalanceESBStr, pairBalanceWBTCStr] = await Promise.all([
        getTokenBalance(ESB.addr, UNI.addr),
        getTokenBalance(WBTC.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalanceESB(toTokenUnitsBN(pairBalanceESBStr, ESB.decimals));
        setPairBalanceWBTC(toTokenUnitsBN(pairBalanceWBTCStr, WBTC.decimals));
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
      <IconHeader icon={<i className="fas fa-exchange-alt" />} text="Trade" />

      <TradePageHeader
        pairBalanceESB={pairBalanceESB}
        pairBalanceWBTC={pairBalanceWBTC}
        uniswapPair={UNI.addr}
      />

      <div
        style={{
          padding: "1%",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flexBasis: "30%", marginRight: "3%", marginLeft: "2%" }}>
          <MainButton
            title="Info"
            description="View ESB-WBTC pool stats."
            icon={<i className="fas fa-chart-area" />}
            href={
              "https://info.uniswap.org/pair/0x10a0A9EF463bDE88A22137aD1e32240ea9CD559D" 
            }
          />
        </div>

        <div style={{ flexBasis: "30%" }}>
          <MainButton
            title="Trade"
            description="Trade bitcoin tokens."
            icon={<i className="fas fa-exchange-alt" />}
            href={
              "https://app.uniswap.org/#/swap?inputCurrency=0x2260fac5e5542a773aa44fbcfedf7c193bc2c599&outputCurrency=0xc929e85dab215705b0473c846196afc94dfe2455"
            }
          />
        </div>

        <div style={{ flexBasis: "30%", marginLeft: "3%", marginRight: "2%" }}>
          <MainButton
            title="Supply"
            description="Supply and redeem liquidity."
            icon={<i className="fas fa-water" />}
            href={
              "https://app.uniswap.org/#/add/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/0xc929e85dab215705b0473c846196afc94dfe2455"
            }
          />
        </div>
      </div>
    </>
  );
}

type MainButtonProps = {
  title: string;
  description: string;
  icon: any;
  href: string;
};

function MainButton({ title, description, icon, href }: MainButtonProps) {
  return (
    <LinkBase href={href} style={{ width: "100%" }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>{title}</div>
        <span style={{ fontSize: 48 }}>{icon}</span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5 }}> {description} </div>
      </Box>
    </LinkBase>
  );
}

export default UniswapPool;
