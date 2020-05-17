import Keyboard from "telegraf-keyboard";
import { IProduct } from "../../models/product.model";
import { ITelegramContext } from "../start";
import { logger } from "../../utils/winston";

export type ICart = {
  items: object[];
  active: {
    product_id: string;
    details: object[];
  };
};

export function getProductList(products: IProduct[]) {
  const options = {
    inline: true,
    duplicates: false,
    newline: false,
  };

  const ProductList = new Keyboard(options);

  products.forEach((product) => {
    ProductList.add(
      `${product.name} ${product.weight}кг - ${
        product.price / 100
      }грн:productDetails ${product._id}`
    );
  });

  return ProductList;
}

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

export function clearActive() {
  if (
    //@ts-ignore
    !ctx.session.cart.active ||
    //@ts-ignore
    ctx.session.cart.active === null ||
    //@ts-ignore
    ctx.session.cart.active === undefined
  )
    logger.debug(
      "Cart: cart doesn't exist"
    );

  //@ts-ignore
  ctx.session.cart.active.details = [];

  logger.debug(`Cart: active section in cart cleared out`);
}

export function provideCartProductID(ctx: ITelegramContext, id: string) {
  if (
    //@ts-ignore
    ctx.session.cart.active.product_id === "" ||
    //@ts-ignore
    ctx.session.cart.active.product_id === null ||
    //@ts-ignore
    ctx.session.cart.active.product_id === undefined
  ) {
    //@ts-ignore
    ctx.session.cart.active.product_id = id || "unknown"; // TODO: Here Imporve this cart flow with temporary data, espacially product details and order information
  }
}

export function initCart(ctx: ITelegramContext) {
  const cart: ICart = {
    items: [],
    active: {
      product_id: "",
      details: [],
    },
  };

  if (
    //@ts-ignore
    !ctx.session.cart ||
    //@ts-ignore
    ctx.session.cart !== null ||
    //@ts-ignore
    ctx.session.cart !== undefined
  ) {
    //@ts-ignore
    ctx.session.cart = cart;
    logger.debug("Cart: initializing cart in session");
  }
}
