import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetWBTC} from '../../utils/web3';

import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {WBTC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintWBTCProps = {
  user: string,
  userBalanceWBTC: BigNumber,
}


function MintWBTC({
  user, userBalanceWBTC
}: MintWBTCProps) {
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Mint">
      <div style={{ display: 'flex' }}>
        {/* WBTC balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="WBTC Balance" balance={userBalanceWBTC} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="WBTC"
                value={mintAmount}
                setter={setMintAmount}
              />
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Mint"
                onClick={() => {
                  mintTestnetWBTC(toBaseUnitBN(mintAmount, WBTC.decimals));
                }}
                disabled={user === '' || !isPos(mintAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MintWBTC;
