import connectDatabase from '@configs/connectDatabase';
import Event from '@models/Event';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { mockEnvironmentVariables, mockFalsyEvents, mockTruthyEvents } from './testData';

describe('Integration Test Cases', () => {
    describe('Connecting to MongoDB Instance', () => {
        /**
         * Runs before all the test cases.
         * 1. Sets the environment variables for use
         */
        beforeEach(() => {
            config({ override: true });
        });

        /**
         * Disconnects from MongoDB after all the tests
         */
        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('should connect to the MongoDB instance', () => {
            connectDatabase().then((resp) => {
                expect(resp).toBeTruthy();
            }, null);
        });

        test.each(mockEnvironmentVariables)(
            'should be rejected with the appropriate error',
            (envVars) => {
                // Overriding the environment variables with mocked values
                process.env['MONGO_URI'] = envVars.MONGO_URI;
                process.env['MONGO_DB'] = envVars.MONGO_DB;

                connectDatabase().catch((err) => {
                    if (err instanceof Error) {
                        expect(err.message).toBe(envVars.ERROR);
                    } else {
                        expect(err).toBe(envVars.ERROR);
                    }
                });
            },
        );
    });

    describe('Testing operations on the database', () => {
        /**
         * Runs before all the test cases.
         * 1. Sets the environment variables for use
         * 2. Connect to the MongoDB instance
         */
        beforeAll(async () => {
            config({ override: true });
            await connectDatabase();
        });

        /**
         * Disconnects from MongoDB after all the tests
         */
        afterAll(async () => {
            await mongoose.disconnect();
        });

        test.each(mockTruthyEvents)('should save the events', async (event) => {
            const newEvent = new Event(event);
            const response = await newEvent.save();
            expect(response).toBeTruthy();
            const eventInDatabase = Event.findById(response._id.toString());
            expect(eventInDatabase).toBeTruthy();
        });

        test.each(mockFalsyEvents)('should throw error when creating a false event', (event) => {
            const newEvent = new Event(event);
            newEvent.save().catch((err) => {
                const error = err instanceof Error ? err.message : (err as string);
                expect(error).toContain('Event validation failed');
                expect(error).toContain('Mongo Error');
                expect(error).toContain('is a required field');
            });
        });
    });
});
