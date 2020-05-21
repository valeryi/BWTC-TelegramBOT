import mongoose, { Schema } from "mongoose";
import { IOrder } from "./order.model";

export type ICart = {
  items: ICartItem[];
  active: {
    product: object;
    details: object[];
    cart_item?: ICartItem;
  };
  orders?: IOrder[]
};

export type ICartItem = {
  id?: string,
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
      type: String,
    },
    product_id: {
      type: String,
    },
    product_name: {
      type: String,
    },
    pack: {
      type: String,
    },
    amount: {
      type: Number,
    },
    unit_price: {
      type: Number
    },
    unit_total: {
      type: Number
    },
    details: {
      type: Array
    }
  },

  {
    timestamps: true,
  }
);

export const CartModel = mongoose.model("Cart", cartSchema, "cart");
