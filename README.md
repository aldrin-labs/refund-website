# Refund Website

### Context
This website relates to refunding effort following the PIKKA SUI memecoin rugpull that took place on the 18th March 2024. For more context:

- https://x.com/thebryanjun/status/1769760272951005647?s=20
- https://x.com/CussySSS/status/1769775910100828176?s=20
- https://x.com/BL0CKRUNNER/status/1769655895833670052?s=20

### Overview
The Refund Website is a web app that facilitates the management of refunds concerning the PIKKA SUI memecoin rugpull, including a unique feature to boost refunds under certain conditions.
The web app built on top of the refund smart-contract: https://github.com/aldrin-labs/refund-contract/

Users who have lost funds in the rugpull event have two refund options:
1. 100% Refund: Users who lost money in the scam can claim a full refund. Only those affected are eligible.
2. 150% Refund: Users claiming their refund through Rinbot receive an additional 50% of the amount lost. Funds will be available for buying and selling NFTs and Tokens on Rinbot.

The workflow works as follows:

1. Aldrin publishes package on-chain, thus initializing the `RefundPool` and receiving a `Publisher` object
2. Aldrin and partners fund the pool via permissionless endpoint `refund::fund`
3. Aldrin adds list of affected addresses and respective amounts lost to the `RefundPool`.
4. Users can freely claim 100% of their funds back via `refund::claim_refund`, or
5. Users can use Rinbot to claim 150% of their funds back, via `refund::claim_refund_boosted`