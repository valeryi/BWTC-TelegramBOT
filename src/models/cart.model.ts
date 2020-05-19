import mongoose, { Schema } from "mongoose";

export type ICart = {
  items: object[];
  active: {
    product: object;
    details: object[];
  };
};

const cartSchema: Schema = new mongoose.Schema(
  {
    items: {
        type: Object
    }
  },
  {
    timestamps: true,
  }
);

export const CartModel = mongoose.model("Cart", cartSchema, "cart");
