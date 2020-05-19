import mongoose, { Schema } from "mongoose";

export type ICart = {
  items: ICartItem[];
  active: {
    product: object;
    details: object[];
    cart_item?: ICartItem;
  };
};

export type ICartItem = {
  user_id: string;
  product_id: string;
  product_name: string;
  pack: string;
  amount: number;
  unit_price: number;
  unit_total: number;
  details: object[];
};

const cartSchema: Schema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    items: {
      type: Array
    }
  },
  {
    timestamps: true,
  }
);

export const CartModel = mongoose.model("Cart", cartSchema, "cart");
