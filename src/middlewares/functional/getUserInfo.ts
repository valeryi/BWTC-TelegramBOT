import { ITelegramContext } from "../../controllers/start";
import { UserModel, IUser } from "../../models/user.model";
import { logger } from "../../utils/winston";

export const getUserInfo = async (ctx: ITelegramContext, next: Function) => {
  const session: any = ctx.session;
  const i18n = ctx.i18n;

  if (session.user) {
    logger.debug(
      "Active session exists... skipping the rest of the code in getUserInfo"
    );

    i18n.locale(session.user.language_code);
    logger.debug("Locale set");

    return next();
  }

  let user: IUser;
  const telegram_id =
    ctx.update.message?.from?.id || ctx.update.message?.chat.id;

  try {
    user = ((await UserModel.find({ telegram_id }))[0] as unknown) as IUser;
  } catch (err) {
    logger.error(`getUserInfo: Some problems with DB - ${err.message}`);
    throw new Error(`getUserInfo: Some problems with DB - ${err.message}`);
  }

  if (!user) {
    const newUser = {
      telegram_id: ctx.update.message?.from?.id || ctx.update.message?.chat.id,
      first_name:
        ctx.update.message?.from?.first_name ||
        ctx.update.message?.chat.first_name,
      last_name:
        ctx.update.message?.from?.last_name ||
        ctx.update.message?.chat.last_name,
      username:
        ctx.update.message?.from?.username || ctx.update.message?.chat.username,
      language_code: ctx.update.message?.from?.language_code,
      last_activity: Date.now(),
    };

    try {
      user = ((await new UserModel(newUser).save()) as unknown) as IUser;
      logger.debug("New user created");
    } catch (err) {
      logger.error(`preStart: Couldn't save new user to DB - ` + err.message);
    }

    session.user = user;
    logger.debug("User put to session");

    i18n.locale(user.language_code);
    logger.debug("Locale set");

    // TODO: Add avatar support for keeping avatars of all the users
    // TODO: Add Error Handlers on saving and others for DB
  } else {
    session.user = user;
    logger.debug("User put to session");

    i18n.locale(user.language_code);
    logger.debug("Locale set");
  }

  return next();
};
