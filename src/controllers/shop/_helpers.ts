import { IProduct } from "../../models/product.model";
import { ITelegramContext } from "../start";
import { logger } from "../../utils/winston";
import { ICart } from "../../models/cart.model";

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
  ctx.session.cart.active.details = [];
  //@ts-ignore
  ctx.session.cart.active.product_id = null;

  logger.debug(`Cart: active section in cart cleared out`);
}

export async function provideCartProduct(ctx: ITelegramContext, product: IProduct) {
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
