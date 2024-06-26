import { useAccounts, useCurrentAccount, useSwitchAccount } from "@mysten/dapp-kit";
import { Button } from "../Button";
import { truncateAddress } from "../../services/utils";
import { FlexBlock } from "../../styles";

export const AccountRows = () => {
    const { mutate: switchAccount } = useSwitchAccount();
	const accounts = useAccounts();
    const currentAccount = useCurrentAccount();

	return (
        <>
        {accounts.length > 0 && <h2>Your accounts</h2>}
		<FlexBlock $direction="row" $justifyContent="center" style={{ paddingBottom: "2em", maxWidth: '100%', overflowX: 'auto' }}>
            {accounts.map((account) => (
                <Button
                    key={account.address}
                    style={{width: '10em', justifyItems: 'center'}}
                    className={account.address === currentAccount?.address ? 'selected' : ''}
                    onClick={() => {
                        switchAccount(
                            { account }
                        );
                    }}
                >
                    {truncateAddress(account.address)}
                </Button>
            ))}
		</FlexBlock>
        </>
	);
}