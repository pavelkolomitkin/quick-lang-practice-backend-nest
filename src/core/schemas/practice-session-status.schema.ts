import { Schema } from 'mongoose';

const PracticeSessionStatusCodes = {
    INITIALIZED: 'initialized',
    UN_ANSWERED: 'unAnswered',
    IN_PROCESS: 'inProcess',
    ENDED: 'ended'
};

const PracticeSessionStatusSchema = new Schema({

    _id: {
        type: Number,
    },

    title: {
        type: String,
    },

    code: {
        type: String,
    }
});

export { PracticeSessionStatusSchema, PracticeSessionStatusCodes };