import { ITelegramContext } from "../../controllers/start";
import { logger } from "../../utils/winston";
import { CartModel, ICartItem } from "../../models/cart.model";

export const fetchCartItems = async (ctx: ITelegramContext, next: Function) => {
  //@ts-ignore
  const user_id = ctx.session.user.id;
  let cart_items: ICartItem[] = [];

  //@ts-ignore
  if (!ctx.session.cart.items || ctx.session.cart.items.length <= 0) {
    logger.debug(
      "Cart items found in session... skipping the rest of the code in fetchCartItems"
    );

    return next();
  }

  try {
    const result = await CartModel.find({user_id});
    const updated = result[0] as any;
    updated.items && updated.items.length ? cart_items = [...updated.items] : cart_items = [];
    logger.debug("Cart items fetched");
  } catch (err) {
    logger.error(`fetchCartItems: Some problems with DB - ${err.message}`);
    throw new Error(`fetchCartItems: Some problems with DB - ${err.message}`);
  }

  //@ts-ignore
  ctx.session.cart.items = cart_items;
  logger.debug("Cart items refreshed in session");

  console.log('fetch: ', cart_items);
  return next();
};
