import { ICart, ICartItem, CartModel } from "../../models/cart.model";
import { IProduct } from "../../models/product.model";
import { ITelegramContext } from "../start";
import { logger } from "../../utils/winston";

export function clearActive(ctx: ITelegramContext) {
  if (
    //@ts-ignore
    !ctx.session.cart.active ||
    //@ts-ignore
    ctx.session.cart.active === null ||
    //@ts-ignore
    ctx.session.cart.active === undefined
  )
    logger.debug("Cart: cart doesn't exist");

  //@ts-ignore
  ctx.session.cart.active = {
    product: {},
    details: [],
  };
  logger.debug(`Cart: active section in cart cleared out`);
}

export function clearCartItem(ctx: ITelegramContext) {
  if (
    //@ts-ignore
    !ctx.session.cart.cart_item ||
    //@ts-ignore
    ctx.session.cart.cart_item === null ||
    //@ts-ignore
    ctx.session.cart.cart_item === undefined
  )
    logger.debug("Cart: cart doesn't exist");

  //@ts-ignore
  ctx.session.cart.cart_item = null;
  logger.debug(`Cart: cart item cleared out`);
}

export async function provideCartProduct(
  ctx: ITelegramContext,
  product: IProduct
) {
  if (
    //@ts-ignore
    ctx.session.cart.active.product ||
    //@ts-ignore
    ctx.session.cart.active.product === "" ||
    //@ts-ignore
    ctx.session.cart.active.product === null ||
    //@ts-ignore
    ctx.session.cart.active.product === undefined
  ) {
    //@ts-ignore
    ctx.session.cart.active.product = product; // TODO: Here Imporve this cart flow with temporary data, espacially product details and order information
  }
}

export function createCartItem(ctx: ITelegramContext) {
  //@ts-ignore
  const products = ctx.session.products;
  //@ts-ignore
  const activeProduct = ctx.session.cart.active;

  const pack = activeProduct.details.filter(
    (n: any) => n.question === "pack"
  )[0].answer;
  const amount = +activeProduct.details.filter(
    (n: any) => n.question === "amount"
  )[0].answer;

  const unit_price = +activeProduct.product.prices.filter(
    (p: any) => p.name === pack
  )[0].price;

  const cart_item: ICartItem = {
    //@ts-ignore
    user_id: ctx.session.user.id,
    product_id: activeProduct.product.id,
    product_name: activeProduct.product.name,
    pack,
    amount,
    unit_price,
    unit_total: unit_price * amount,
    details: activeProduct.details.filter(
      (q: any) => q.question !== "amount" && q.question !== "pack"
    ),
  };

  //@ts-ignore
  ctx.session.cart.cart_item = cart_item;

  clearActive(ctx);

  return cart_item;
}

export function initCart(ctx: ITelegramContext) {
  const cart: ICart = {
    items: [],
    active: {
      product: {},
      details: [],
    },
    orders: []
  };

  if (
    //@ts-ignore
    !ctx.session.cart ||
    //@ts-ignore
    ctx.session.cart == null ||
    //@ts-ignore
    ctx.session.cart == undefined
  ) {
    //@ts-ignore
    ctx.session.cart = cart;
    logger.debug("Cart: initializing cart in session");
  }
}

export async function addCartItem(
  ctx: ITelegramContext,
  user_id: string,
  item: ICartItem
) {
  //@ts-ignore
  const local_items = ctx.session.cart.items;
  try {
    const newItem = new CartModel(item);
    await newItem.save();
    const result = await CartModel.find({ user_id });

    //@ts-ignore
    ctx.session.cart.items = [...result];
    //@ts-ignore
    ctx.session.cart.cart_item = null;
    logger.debug("Cart: new cart item added");
  } catch (err) {
    logger.error("Cart: Something went wrong with adding new cart item");
  }
}

export function currencyFormat(number: number, symbol?: true) {
  const UAH = "₴";

  if (symbol) {
    const result = number.toLocaleString("ru-RU");
    return result + " " + UAH;
  }

  const result = number.toLocaleString("uk-UK", {
    style: "currency",
    currency: "UAH",
  });

  return result; //TODO: try to implement formating myself
}

export async function deleteCartItem(ctx: ITelegramContext, id: string) {
  //@ts-ignore
  const cart_items = ctx.session.cart.items;

  try {
    await CartModel.findByIdAndDelete(id);
    logger.debug("Cart: item has been deleted");
    const newItems = cart_items.filter((item: ICartItem) => item.id !== id);
    //@ts-ignore
    ctx.session.cart.items = newItems;
  } catch (err) {
    logger.error("Cart: something went wrong deleting cart item");
  }
}

export async function updateCartItem(
  ctx: ITelegramContext,
  id: string,
  update: object
) {
  try {
    const updated = await CartModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    //@ts-ignore
    const items = ctx.session.cart.items.filter(
      (item: ICartItem) => item.id !== id
    );
    updated ? items.push(updated) : items;
    //@ts-ignore
    ctx.session.cart.items = items;
    logger.debug("Cart: item updated");
  } catch (err) {
    logger.error(
      `Cart: something went wrong updating cart item - ${err.message}`
    );
  }
}
