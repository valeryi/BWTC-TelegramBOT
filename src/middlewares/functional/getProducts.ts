import { ITelegramContext } from "../../controllers/start";
import { logger } from "../../utils/winston";
import { IProduct, ProductModel } from "../../models/product.model";

export const getProducts = async (ctx: ITelegramContext, next: Function) => {
  const session: any = ctx.session;
  const products: IProduct[] = [];

  if (session.products) {
    logger.debug(
      "Products found in session... skipping the rest of the code in getProducts"
    );

    return next();
  }

  try {
    const result = ((await ProductModel.find()) as unknown) as IProduct[];
    products.push(...result);
    logger.debug('Products fetched');
  } catch (err) {
    logger.error(`getProducts: Some problems with DB - ${err.message}`);
    throw new Error(`getProducts: Some problems with DB - ${err.message}`);
  }

  session.products = products;
  logger.debug("Products put to session");

  return next();
};
