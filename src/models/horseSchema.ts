import { ErrorMessages } from '@configs/types';
import { Schema } from 'mongoose';

/**
 * Schema for the Horse model
 */
const horseSchema = new Schema(
    {
        id: {
            type: Schema.Types.Number,
            required: [true, ErrorMessages.SCHEMA_HORSE_ID_REQUIRED],
        },
        name: {
            type: Schema.Types.String,
            required: [true, ErrorMessages.SCHEMA_HORSE_NAME_REQUIRED],
        },
    },
    {
        timestamps: true,
        minimize: false,
    },
);

export default horseSchema;
