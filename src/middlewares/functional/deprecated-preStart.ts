import { ITelegramContext } from "../../controllers/start";
import { UserModel, IUser } from "../../models/user.model";
import { ProductModel } from "../../models/product.model";
import { logger } from "../../utils/winston";

export const preStart = async (ctx: ITelegramContext, next: Function) => {
  const session: any = ctx.session;
  const i18n = ctx.i18n;
  const telegram_id = ctx.update.message?.from?.id;

  const data = await Promise.all([
    UserModel.find({ telegram_id }),
    ProductModel.find(),
  ]);
  logger.debug("Data fetched");

  let user: IUser = (data[0][0] as unknown) as IUser;
  const products = data[1];

  session.products = products;
  logger.debug("Products data put to session");

  if (!user) {
    const newUser = {
      telegram_id: ctx.update.message?.from?.id,
      first_name: ctx.update.message?.from?.first_name,
      last_name: ctx.update.message?.from?.last_name,
      username: ctx.update.message?.from?.username,
      language_code: ctx.update.message?.from?.language_code,
      last_activity: Date.now(),
    };

    try{
        user = await new UserModel(newUser).save() as unknown as IUser;
        logger.debug('New user created');
    } catch(err){
        logger.error(`preStart: ` + err.message);
    }
    
    session.user = user;
    logger.debug("User put to session");

    i18n.locale(user.language_code);
    logger.debug("Locale set successfully");

    // TODO: Add avatar support for keeping avatars of all the users
    // TODO: Add Error Handlers on saving and others for DB
  } else {
    session.user = user;
    logger.debug("User put to session");

    i18n.locale(user.language_code);
    logger.debug("Locale set successfully");
  }

  return next();
};
