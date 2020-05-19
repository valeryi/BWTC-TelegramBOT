import mongoose, { Schema } from "mongoose";

export interface IProduct {
    _id: string,
    name: string,
    weight: number,
    prices: object,
    currency: string
    group: string,
    country: string,
    category: string,
    details: {
        farm: string,
        variety: string,
        processing: string,
        taste: string
    }
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
    prices: {
        type: Object,
        required: true,
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
    },
    details: {
        type: Object
    }

}, {
    timestamps: true,
});

export const ProductModel = mongoose.model('Product', productSchema, 'products');