import mongoose, { Schema } from "mongoose";

export interface IProduct {
    _id: string,
    name: string,
    weight: number,
    price: number,
    currency: string
    group: string,
    country: string,
    category: string
}

const productSchema: Schema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    currency: {
        type: String,
        required: true,
        trim: true
    },
    group: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    }

}, {
    timestamps: true,
});

export const ProductModel = mongoose.model('Product', productSchema, 'products');