import { TransactionBlock } from "@mysten/sui.js/transactions";
import { FC, useCallback, useState } from "react";
import { RefundService } from "../services/RefundService";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { getSuiVisionTransactionLink, isTransactionSuccessful } from "../services/utils";
import { FlexBlock } from "../styles";
import { Button } from "../components/Button";
import { CheckRinBotAddress } from "./CheckRinBotAddress";


const refundService = RefundService.getInstance();
interface BoostedRefundParams {
    amount: string,
    selectedAddress: string,
    onSuccess: () => void, 
    onFail: () => void
}

export const BoostedRefund: FC<BoostedRefundParams> = ({amount, selectedAddress, onSuccess, onFail}) => {
    const { mutateAsync: signAndExecuteTransactionBlock } = useSignAndExecuteTransactionBlock();
    const [claimRefundStatus, setClaimRefundStatus] = useState<'failed' | 'success' | undefined>(undefined);
    const [lastTxDigest, setLastTxDigest] = useState<string | undefined>(undefined);    
    const [rinbotAddress, setRinbotAddress] = useState<{rinBotAddress: string, objectCapId: string} | undefined>();

    const reclaim = useCallback(() => async () => {
        const tx = new TransactionBlock();
        if(!rinbotAddress) throw new Error('No Verified RinBot address');
        refundService.claimRefundBoosted(tx, {
            poolObjectId: RefundService.REFUND_POOL_OBJECT_ID,
            boostedClaimCap: rinbotAddress?.objectCapId,
            userRinbotRefundDestinationAddress: rinbotAddress?.rinBotAddress
        });
        tx.setGasBudget(RefundService.REFUND_GAS_BUGET);
        const result = await signAndExecuteTransactionBlock({
            transactionBlock: tx,
            options: {
                showEffects: true
            }
        });
        if(isTransactionSuccessful(result)) {
            setClaimRefundStatus('success');            
            onSuccess();
        }else {
            setClaimRefundStatus('failed');            
            onFail();
        }
        setLastTxDigest(result.digest);
    }, [onFail, onSuccess, signAndExecuteTransactionBlock]);

    const rinBotAddressConfirmed = (rinBotAddress: string, objectCapId: string) => {
        setRinbotAddress({
            rinBotAddress,
            objectCapId
        });
    }

    return <FlexBlock $direction="column" style={{flex: 1}}>
        <h4>
        💸 <b>Boosted Refund</b>: Enjoy <i><b>150%</b></i> of your lost funds — <code>${amount}</code> <b>SUI</b>. 
        In order to catch this opportunity you have to setup a wallet with our <a target="_blank" href='https://t.me/RINsui_bot'>RINBot</a> and follow these instructions:
        </h4>
        <ul style={{textAlign: 'left'}}>
            <li><code>/start</code> the bot</li>
            <li>Click on <code>Refund</code></li>
            <li>Click on <code>Check Address</code></li>
            <li>Insert your address (<code>{selectedAddress}</code>)</li>
            <li>Click on <code>Continue</code></li>
            <li>Then you should see that the bot created another public address, insert that address here and Check the validity</li>
        </ul>
        <CheckRinBotAddress ownerAddress={selectedAddress} onSuccess={rinBotAddressConfirmed} />
        {rinbotAddress && <Button onClick={reclaim}>Reclaim {amount} SUI</Button>}
        {
            claimRefundStatus === 'success' &&
            <>
                {lastTxDigest && <h3>✅<br/> <b>Boosted refund</b> is <a href={getSuiVisionTransactionLink(lastTxDigest)}>successfully claimed</a>!</h3>}
                {!lastTxDigest && <h3>✅<br/> <b>Boosted refund</b> is successfully claimed!</h3>}
                <h4>If you want to check another wallet you can switch wallet or account using the top menu</h4>
            </>
        }
        {
            claimRefundStatus === 'failed' &&
            <>
                {lastTxDigest && <h3>❌<br/> <a href={getSuiVisionTransactionLink(lastTxDigest)}>Failed</a> to claim <b>base refund</b></h3>}
                {!lastTxDigest && <h3>❌<br/> Failed to claim <b>boosted refund</b></h3>}
                {!lastTxDigest && <h4>You can retry with another wallet or account by selecting it in the top menu</h4>}
            </>
        }
    </FlexBlock>
}