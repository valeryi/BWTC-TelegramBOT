import { ITelegramContext } from "../../controllers/start";
import { logger } from "../../utils/winston";
import { CartModel, ICartItem } from "../../models/cart.model";

export const fetchCartItems = async (ctx: ITelegramContext, next: Function) => {
  //@ts-ignore
  const user_id = ctx.session.user.id;
  let cart_items: ICartItem[] = [];

  if (
    //@ts-ignore
    (ctx.session.cart.items !== undefined ||
      //@ts-ignore
      ctx.session.cart.items !== null) &&
    //@ts-ignore
    ctx.session.cart.items.length > 0
  ) {
    return next();
  }

  try {
    const result = ((await CartModel.find({
      user_id,
    })) as unknown) as ICartItem[];
    result && result.length ? (cart_items = [...result]) : (cart_items = []);
    logger.debug("Cart items fetched");
  } catch (err) {
    logger.error(`fetchCartItems: Some problems with DB - ${err.message}`);
    throw new Error(`fetchCartItems: Some problems with DB - ${err.message}`);
  }

  //@ts-ignore
  ctx.session.cart.items = cart_items;
  logger.debug("Cart items refreshed in session");

  return next();
};
