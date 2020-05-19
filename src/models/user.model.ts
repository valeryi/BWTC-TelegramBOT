import mongoose, { Schema } from "mongoose";

export interface IUser {
    id: string,
    telegram_id: number,
    first_name: string,
    last_name: string,
    username: string,
    language_code: string
}

const userSchema: Schema = new mongoose.Schema({

    telegram_id: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    first_name: {
        type: String,
        default: null,
        trim: true,
    },
    last_name: {
        type: String,
        default: null,
        trim: true,
    },
    username: {
        type: String,
        default: 'uk',
        trim: true,
    },
    language_code: {
        type: String,
        trim: true
    },
    phone_number: {
        type: String, 
        trim: true
    },
    email_address: {
        type: String,
        trim: true
    }, 
    address: {
        type: Schema.Types.ObjectId
    },
    last_activity: {
        type: Schema.Types.Date
    }

}, {
    timestamps: true,
});

export const UserModel = mongoose.model('User', userSchema, 'users');