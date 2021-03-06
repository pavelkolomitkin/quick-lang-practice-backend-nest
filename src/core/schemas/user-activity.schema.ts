import { Schema } from 'mongoose';

const ActivityTypes = {
    TYPING: 'typing',
    BLOCK_USER: 'block_user',
    UNBLOCK_USER: 'unblock_user'
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
        timestamps: true,
    });

export { UserActivitySchema, ActivityTypes }
