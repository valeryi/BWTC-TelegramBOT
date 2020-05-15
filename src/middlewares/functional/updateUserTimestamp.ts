import { UserModel } from "../../models/user.model";
import { TelegrafContext } from "telegraf/typings/context";
import { logger } from "../../utils/winston";

// Middleware
export const updateUserTimestamp = async (ctx: TelegrafContext, next: Function) => {

    await UserModel.findOneAndUpdate(
        { telegram_id: ctx.update.message?.from?.id },
        { last_activity: Date.now() },
        { new: true }
    ).then(() => {
        logger.debug('last_activity timestamp updated successfully');
    }).catch((err) => {
        logger.error(`ACTITITY_STAMP: ${err.message}`);
    });

    return next();
};

