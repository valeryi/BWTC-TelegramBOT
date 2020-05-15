import { UserModel } from "../../models/user.model";
import { logger } from "../../utils/winston";
import { ITelegramContext } from "../../controllers/start";

export const updateUserActivity = async (ctx: ITelegramContext, next: Function) => {

    // TODO: Add activity history and monitoring

    await UserModel.findOneAndUpdate(
        { telegram_id: ctx.update.message?.from?.id },
        { last_activity: Date.now() },
        { new: true }
    ).then(() => {
        logger.debug('Activity updated successfully');
    }).catch((err) => {
        logger.error(`ACTITITY_STAMP: ${err.message}`);
    });

    return next();
};
