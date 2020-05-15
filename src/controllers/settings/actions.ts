import { ITelegramContext } from "../start";
import { getActionParams } from "../../utils/_helpers";
import { UserModel, IUser } from "../../models/user.model";
import { logger } from "../../utils/winston";

export const changeLanguageAction = async (ctx: ITelegramContext) => {
  const i18n = ctx.i18n;
  const language_code = getActionParams(ctx)[0];
  // console.log
  const session: any = ctx.session;
  let updated: IUser = {telegram_id: 454354} as IUser;

  try {
    updated = await UserModel.findOneAndUpdate(
      { telegram_id: session.user.telegram_id },
      { language_code },
      { new: true }
    ) as unknown as IUser;

    session.user.language_code = language_code;
    i18n.locale(language_code);
    logger.debug('User language updated');
  } catch (err) {
    logger.error(`Couln't not update language`);
    await ctx.answerCbQuery(
      i18n.t("scenes.settings.language.updateErrorAlert")
    );
  }



  await ctx.answerCbQuery(i18n.t("scenes.settings.language.updateAlert"));
  
  updated;
  //@ts-ignore
  // i18n.locale(updated?.language_code);
  await ctx.scene.reenter();
};
