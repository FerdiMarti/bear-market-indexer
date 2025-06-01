import { ethers } from 'ethers';
import { OptionToken, OptionType } from '../models/OptionToken';
import { logger } from '../utils/logger';

const OPTION_TOKEN_MANAGER_ABI = [
    'event OptionTokenDeployed(address indexed optionToken, uint8 optionType, uint256 strikePrice, uint256 expiration, uint256 executionWindowSize, uint256 premium, uint256 amount, address paymentToken, uint256 collateral)',
];

export class IndexerService {
    private provider: ethers.WebSocketProvider;
    private contract: ethers.Contract;

    constructor(wsUrl: string, contractAddress: string) {
        this.provider = new ethers.WebSocketProvider(wsUrl);
        this.contract = new ethers.Contract(contractAddress, OPTION_TOKEN_MANAGER_ABI, this.provider);
    }

    public async start(): Promise<void> {
        logger.info('Starting indexer service...');

        this.contract.on(
            'OptionTokenDeployed',
            async (
                optionToken: string,
                optionType: number,
                strikePrice: bigint,
                expiration: bigint,
                executionWindowSize: bigint,
                premium: bigint,
                amount: bigint,
                paymentToken: string,
                collateral: bigint
            ) => {
                try {
                    const optionTokenDoc = new OptionToken({
                        address: optionToken,
                        optionType: optionType === 0 ? OptionType.CALL : OptionType.PUT,
                        strikePrice: strikePrice.toString(),
                        expiration: Number(expiration),
                        executionWindowSize: Number(executionWindowSize),
                        premium: premium.toString(),
                        amount: amount.toString(),
                        paymentToken,
                        collateral: collateral.toString(),
                    });

                    await optionTokenDoc.save();
                    logger.info(`Indexed new option token: ${optionToken}`);
                } catch (error) {
                    logger.error(`Error indexing option token ${optionToken}:`, error);
                }
            }
        );

        logger.info('Indexer service started successfully');
    }

    public async stop(): Promise<void> {
        logger.info('Stopping indexer service...');
        await this.provider.destroy();
        logger.info('Indexer service stopped successfully');
    }
}
