import session from 'telegraf/session';
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";


const sessionMiddleware = (bot: Telegraf<TelegrafContext>) => {

    bot.use(session());

}

export default sessionMiddleware;