import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetSBTC} from '../../utils/web3';

import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {SBTC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintSBTCProps = {
  user: string,
  userBalanceSBTC: BigNumber,
}


function MintSBTC({
  user, userBalanceSBTC
}: MintSBTCProps) {
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Mint">
      <div style={{ display: 'flex' }}>
        {/* SBTC balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="SBTC Balance" balance={userBalanceSBTC} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="SBTC"
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
                  mintTestnetSBTC(toBaseUnitBN(mintAmount, SBTC.decimals));
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

export default MintSBTC;
