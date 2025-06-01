import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { IndexerService } from './services/IndexerService';
import { logger } from './utils/logger';

dotenv.config();

const { NODE_ENV, ALCHEMY_API_KEY, HARDHAT_WS_URL, MONGODB_URI, OPTION_TOKEN_MANAGER_ADDRESS } = process.env;

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
}

if (!OPTION_TOKEN_MANAGER_ADDRESS) {
    throw new Error('OPTION_TOKEN_MANAGER_ADDRESS is required');
}

const wsUrl = NODE_ENV === 'production' ? `wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` : HARDHAT_WS_URL || 'ws://localhost:8545';

async function main() {
    if (!MONGODB_URI || !OPTION_TOKEN_MANAGER_ADDRESS) {
        throw new Error('MONGODB_URI and OPTION_TOKEN_MANAGER_ADDRESS are required');
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        logger.info('Connected to MongoDB');

        // Initialize and start the indexer service
        const indexerService = new IndexerService(wsUrl, OPTION_TOKEN_MANAGER_ADDRESS);
        await indexerService.start();

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Received SIGINT. Shutting down...');
            await indexerService.stop();
            await mongoose.connection.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Received SIGTERM. Shutting down...');
            await indexerService.stop();
            await mongoose.connection.close();
            process.exit(0);
        });
    } catch (error) {
        logger.error('Error starting indexer:', error);
        process.exit(1);
    }
}

main();
