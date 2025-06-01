# Bear Market Indexer

A real-time blockchain indexer service that monitors and indexes OptionTokenManager.sol contract events on the Ethereum network. The service uses WebSocket connections to listen for events and stores the indexed data in MongoDB.

## Features

-   Real-time event monitoring via WebSocket connection
-   MongoDB integration for data persistence
-   Support for both mainnet (via Alchemy) and local development (via Hardhat)
-   Graceful shutdown handling
-   Environment-based configuration

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB instance
-   Alchemy API key (for mainnet)
-   Option Token Manager contract address

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
ALCHEMY_API_KEY=your_alchemy_api_key
HARDHAT_WS_URL=ws://localhost:8545
MONGODB_URI=your_mongodb_connection_string
OPTION_TOKEN_MANAGER_ADDRESS=your_contract_address
```

## Running the Indexer

Development mode:

```bash
npm start
```

Production mode:

```bash
NODE_ENV=production npm start
```

## Environment Variables

-   `NODE_ENV`: Environment mode ('development' or 'production')
-   `ALCHEMY_API_KEY`: Your Alchemy API key for mainnet connection
-   `HARDHAT_WS_URL`: WebSocket URL for local Hardhat node
-   `MONGODB_URI`: MongoDB connection string
-   `OPTION_TOKEN_MANAGER_ADDRESS`: Address of the Option Token Manager contract

## Architecture

The indexer service connects to the Ethereum network via WebSocket and listens for events from the Option Token Manager contract. When events are detected, they are processed and stored in MongoDB for later retrieval and analysis.

This Indexer can be extended to also receive Events from the OptionToken.sol contract.
