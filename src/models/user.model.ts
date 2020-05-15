import mongoose, { Schema } from "mongoose";

export interface User {
    telegram_id: Number,
    first_name: String,
    last_name: String,
    username: String,
    language_code: String
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
        default: null,
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