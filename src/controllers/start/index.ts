import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { MainNavigation } from '../../utils/keyboards';
import { TelegrafContext } from 'telegraf/typings/context';
import { UserModel } from '../../models/user.model';
import { ProductModel } from '../../models/product.model';
import { logger } from '../../utils/winston';

const { leave } = Stage;
const start = new Scene('start');

start.enter(async (ctx: TelegrafContext) => {

    const telegram_id = ctx.update.message?.from?.id;

    const data = await Promise.all([
        UserModel.find({ telegram_id }),
        ProductModel.find()
    ]);
    logger.debug('Data fetched');

    const user = data[0];
    const products = data[1];

    //@ts-ignore
    ctx.session.products = products;

    if (user.length === 0) {

        const newUser = {
            telegram_id: ctx.update.message?.from?.id,
            first_name: ctx.update.message?.from?.first_name,
            last_name: ctx.update.message?.from?.last_name,
            username: ctx.update.message?.from?.username,
            language_code: ctx.update.message?.from?.language_code,
            last_activity: Date.now()
        }

        //@ts-ignore
        ctx.session.current_user = await new UserModel(newUser).save()
            .then(() => logger.debug('New user created'))
            .catch(err => logger.error(err));

        // TODO: Add avatar support for keeping avatars of all the users
        // TODO: Add Error Handlers on saving and others for DB

    } else {

        //@ts-ignore
        ctx.session.current_user = user[0];
        logger.debug('User in sessions');
    }

    // TODO: Add i18 internalization - answer in the language it's asked...
    ctx.reply(`Привіт, ${ctx.from?.first_name}!`)
        .then(() => ctx.reply(`Раді вітати тебе у нашому чаті.`))
        .then(() => ctx.reply(`Тут ти зможеш замовити каву собі до дому, в офіс або якщо у тебе своя кав’ярня - залишити заявку на співпрацю! :)`))
        .then(() => ctx.reply('З чого розпочнемо? 👇', (MainNavigation() as any).draw()));

    //@ts-ignore
    await ctx.scene.leave();

})

start.leave(async (_: TelegrafContext) => {})

start.command('saveme', leave());

export default start;