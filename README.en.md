English | [简体中文](./README.md)

# Web3 Football Card Marketplace

A blockchain-based “Football Card NFT” marketplace including:
- Smart contracts (Hardhat + Solidity + OpenZeppelin)
- Frontend app (Next.js + React + Ethers v6)

Features:
- Initialize/mint football cards
- List, cancel listing, and update price
- Buy initial inventory cards and secondary-market user cards
- Query user holdings, purchase/sale history, and asset statistics
- Auto-sync ABI to the frontend and auto-write contract address to frontend env

The frontend includes pages like Home, Marketplace, My Collections, Trading, and Leaderboard.

## Project Structure

- Contracts: `web3-football-card-contracts/`
  - Core contract: `contracts/FootballCardNFT.sol`
  - Deploy script: `scripts/deployFootballCard.js`
  - Network config: `hardhat.config.js`

- Frontend: `web3-football-card-marketplace/`
  - Contract interaction wrapper: `lib/web3/contract.ts`
  - Web3 context: `lib/web3/Web3Context.tsx`
  - ABI: `lib/web3/FootballCardNFT.json`
  - Purchase button example: `components/marketplace/PurchaseButton.tsx`
  - App Router pages: `app/(root)/{marketplace, collections, trade, leaderboard}`

## Tech Stack

- Smart Contracts
  - Solidity 0.8.28
  - OpenZeppelin contracts
  - Hardhat (toolbox, etherscan plugin)
- Frontend
  - Next.js 15, React 19, Ethers v6
  - Tailwind CSS, Radix UI, Lucide Icons
  - App Router (app directory)

## Contract Overview

Contract file: `web3-football-card-contracts/contracts/FootballCardNFT.sol`

Card info includes: name, rating, position, strong/weak foot, club, league, nationality, rarity, whether it’s initial inventory, price, metadataURI, etc.

Key read/write methods (selection):
- Mint/initialize: `mintInitialCard`, `mintCardFromMetadata`
- Purchase: `buyInitialCard` (initial inventory), `buyUserCard` (secondary market)
- Listing management: `listCardForSale`, `cancelListing`, `updateListingPrice`, `getCardListing`, `getAllUserListings`, `getUserActiveListings`
- Query: `getAvailableCards`, `getUserOwnedCards`, `getUserOwnedCardsWithInfo`, `getCardMetadataURI`, `totalSupply`
- History: `getUserPurchaseHistory`, `getUserSaleHistory`
- Withdraw: `withdraw`

Purchases, listings, and secondary sales emit events and maintain history, which the frontend aggregates for display.

## Frontend Overview

- Unified contract read/write via `lib/web3/contract.ts`
- Wallet connection (MetaMask) and account/balance via `lib/web3/Web3Context.tsx`
- Purchase flow example (initial inventory and user-listed cards) via `components/marketplace/PurchaseButton.tsx`
- Aggregated helpers for user holdings, purchase history, and asset stats

Notes:
- `NEXT_PUBLIC_CONTRACT_ADDRESS` sets the contract address for the frontend
- `NEXT_PUBLIC_RPC_URL` specifies the RPC endpoint (default `http://localhost:8545`)
- `NEXT_PUBLIC_IPFS_GATEWAY` sets the IPFS gateway (default `https://ipfs.io/ipfs/`)

## Prerequisites

- Node.js 18+
- MetaMask with the appropriate network (local Hardhat or Sepolia)
- NPM

## Installation

Install dependencies for both subprojects.

Contracts:
```bash
cd web3-football-card-contracts
```

```bash
npm install
```

Frontend:
```bash
cd ..\web3-football-card-marketplace
```

```bash
npm install
```

## Environment Variables

Contracts (`web3-football-card-contracts/.env`) example:
```bash
API_URL=https://sepolia.infura.io/v3/<YOUR_INFURA_KEY>
PRIVATE_KEY=<YOUR_PRIVATE_KEY_NO_0x>
ETHERSCAN_API_KEY=<YOUR_ETHERSCAN_KEY>
```

Frontend (`web3-football-card-marketplace/.env.local`) example:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

Tips:
- After running the deploy script, the contract address will be auto-written to the frontend `.env.local` (see `web3-football-card-contracts/scripts/deployFootballCard.js`)
- The latest ABI will also be copied to `web3-football-card-marketplace/lib/web3/FootballCardNFT.json`

## Local Development (Hardhat local chain)

1) Start a local node (in the contracts directory):
```bash
npx hardhat node
```

2) In a new terminal, deploy the contract locally:
```bash
cd web3-football-card-contracts
```

```bash
npx hardhat run scripts/deployFootballCard.js --network localhost
```

3) Start the frontend (in the frontend directory):
```bash
cd ..\web3-football-card-marketplace
```

```bash
npm run dev
```

4) Open http://localhost:3000 and connect MetaMask to the local network (ChainId: 31337).

Optional: inspect on-chain NFT state (in the contracts directory):
```bash
npx hardhat run scripts/viewNFTs.js --network localhost
```

## Deploy to Testnet (Sepolia)

1) The default network in `web3-football-card-contracts/hardhat.config.js` is `sepolia`. Configure `.env` with `API_URL / PRIVATE_KEY / ETHERSCAN_API_KEY` first.

2) Deploy (in the contracts directory):
```bash
npx hardhat run scripts/deployFootballCard.js --network sepolia
```

After deployment, the script will:
- Print the deployed contract address
- Update `web3-football-card-contracts/.env` with `FOOTBALL_CARD_CONTRACT_ADDRESS`
- Auto-write the frontend `.env.local` with `NEXT_PUBLIC_CONTRACT_ADDRESS`
- Copy the ABI to `lib/web3/FootballCardNFT.json`

3) Configure the frontend RPC (in `frontend/.env.local`):
```bash
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/<YOUR_INFURA_KEY>
```

4) Start the frontend:
```bash
npm run dev
```

5) Verify the contract (optional):
```bash
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
```

## Frontend Scripts

From `web3-football-card-marketplace/package.json`:
```bash
npm run dev    # development
```

```bash
npm run build  # build
```

```bash
npm run start  # production start
```

```bash
npm run lint   # lint
```

## FAQ & Tips

- Fallback contract address: if `NEXT_PUBLIC_CONTRACT_ADDRESS` is not set, `lib/web3/contract.ts` may use a hardcoded address. Always deploy and configure env variables properly.
- Price units: the contract uses `uint256` (wei). The frontend displays using `ethers.formatEther`. Mind the unit conversions.
- Local accounts: Hardhat node provides dev accounts and private keys. Never use them in production.
- Events and history: purchases, listings, and trades emit events, and purchase/sale histories are tracked for frontend aggregation.