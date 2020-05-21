import { ITelegramContext } from "../start";
import { getActionParams } from "../../utils/helpers";
import { UserModel, IUser } from "../../models/user.model";
import { logger } from "../../utils/winston";

export const changeLanguageAction = async (ctx: ITelegramContext) => {
  const i18n = ctx.i18n;
  const language_code = getActionParams(ctx)[0];
  const session: any = ctx.session;

  try {
    await UserModel.findOneAndUpdate(
      { telegram_id: session.user.telegram_id },
      { language_code },
      { new: true }
    ) as unknown as IUser;

    session.user.language_code = language_code;
    i18n.locale(language_code);
    logger.debug('User language updated');
  } catch (err) {
    logger.error(`Couln't not update language`);
    ctx.reply(ctx.i18n.t('system.error'))
  }

  await ctx.scene.reenter();
};
