import { ErrorMessages } from '@configs/types';
import { model, Schema } from 'mongoose';
import horseSchema from './horseSchema';

/**
 * Schema for the Event model
 */
const eventSchema = new Schema(
    {
        event: {
            type: Schema.Types.String,
            required: [true, ErrorMessages.SCHEMA_EVENT_NAME_REQUIRED],
        },
        horse: {
            type: horseSchema,
        },
        time: {
            type: Schema.Types.Number,
            required: [true, ErrorMessages.SCHEMA_TIME_REQUIRED],
        },
    },
    {
        timestamps: true,
        minimize: false,
    },
);

/**
 * The Event model
 */
export default model('Event', eventSchema);
