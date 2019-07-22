import { Schema } from 'mongoose';

const ActivityTypes = {
    TYPING: 'typing'
};

const UserActivitySchema = new Schema(
    {
        type: {
            type: String,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        addressee: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        payload: {
            type: Schema.Types.Mixed
        }
    },
    {
        capped: {
            size: 1048576, // 1M
            max: 1000
        },
        timestamps: true,
    });

export { UserActivitySchema, ActivityTypes }
