import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { approve } from '../../utils/web3';

import {ESB, WBTC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {UniswapV2Router02} from "../../constants/contracts";

type UniswapApproveCollateralProps = {
  user: string,
  userAllowanceESB: BigNumber
  userAllowanceWBTC: BigNumber
};

function UniswapApproveCollateral({
  user, userAllowanceESB, userAllowanceWBTC,
}: UniswapApproveCollateralProps) {
  return (
    <Box heading="Unlock for Uniswap">
      <div style={{display: 'flex'}}>
        <div style={{width: '40%'}} />
        {/* Approve Uniswap Router to spend ESB */}
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Unlock ESB"
            onClick={() => {
              approve(ESB.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceESB.comparedTo(MAX_UINT256) === 0}
          />
        </div>
        {/* Approve Uniswap Router to spend WBTC */}
        <div style={{width: '6%'}} />
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Unlock WBTC"
            onClick={() => {
              approve(WBTC.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceWBTC.comparedTo(MAX_UINT256.dividedBy(2)) > 0}
          />
        </div>
      </div>
    </Box>
  );
}

export default UniswapApproveCollateral;