import fs from 'fs';
import path from 'path';
import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

export function applyMiddlewares(bot: Telegraf<TelegrafContext>) {

    const files = fs.readdirSync(path.join(__dirname)).filter(name => !(/index/i.test(name)) && /.+(\.js+)$/i.test(name));
    const middlewares: any[] = [];

    files.forEach(file => middlewares.push(require(path.join(__dirname, file))));
    middlewares.forEach(wrapper => wrapper.default(bot));

}
