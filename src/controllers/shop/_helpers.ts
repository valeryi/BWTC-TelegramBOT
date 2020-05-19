import { IProduct } from "../../models/product.model";
import { ITelegramContext } from "../start";
import { logger } from "../../utils/winston";
// import { ICart, ICartItem } from "../../models/cart.model";
import { ICart, ICartItem, CartModel } from "../../models/cart.model";

export function addActive(
  ctx: ITelegramContext,
  question?: string,
  answer?: string
) {
  if (!question || !answer) {
    logger.error(`Cart: No data provided to put to cart`);
    return;
  }

  if (
    //@ts-ignore
    !ctx.session.cart ||
    //@ts-ignore
    ctx.session.cart === null ||
    //@ts-ignore
    ctx.session.cart === undefined
  )
    initCart(ctx);

  //@ts-ignore
  ctx.session.cart.active.details.push({ question, answer });

  logger.debug(
    `Cart: adding details to active products : ${question} - ${answer}`
  );
}

export async function informManager(
  ctx: ITelegramContext,
  manager_id: number,
  order: any
) {
  // Set proper style
  await ctx.telegram.sendMessage(manager_id, "test");
  logger.debug("informed manager about order: " + JSON.stringify(order));
}

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
    const result = await CartModel.findOneAndUpdate(
      { user_id },
      { $push: { items: item } },
      { new: true }
    );

    //@ts-ignore
    ctx.session.cart.items = [...result.items];
    //@ts-ignore
    ctx.session.cart.cart_item = null;
    logger.debug("Cart: new cart item added");
  } catch (err) {
    logger.error("Cart: Something went wrong with adding new cart item");
  }
}
