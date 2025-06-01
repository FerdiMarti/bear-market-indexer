import mongoose, { Document, Schema } from 'mongoose';

export enum OptionType {
    CALL = 'CALL',
    PUT = 'PUT',
}

export interface IOptionToken extends Document {
    address: string;
    optionType: OptionType;
    strikePrice: string;
    expiration: number;
    executionWindowSize: number;
    premium: string;
    amount: string;
    paymentToken: string;
    collateral: string;
    createdAt: Date;
    updatedAt: Date;
}

const OptionTokenSchema = new Schema<IOptionToken>(
    {
        address: { type: String, required: true, unique: true },
        optionType: {
            type: String,
            enum: Object.values(OptionType),
            required: true,
        },
        strikePrice: { type: String, required: true },
        expiration: { type: Number, required: true },
        executionWindowSize: { type: Number, required: true },
        premium: { type: String, required: true },
        amount: { type: String, required: true },
        paymentToken: { type: String, required: true },
        collateral: { type: String, required: true },
    },
    { timestamps: true }
);

export const OptionToken = mongoose.model<IOptionToken>('OptionToken', OptionTokenSchema);
