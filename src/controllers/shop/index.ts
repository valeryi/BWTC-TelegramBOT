import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import { TelegrafContext } from 'telegraf/typings/context';
import { CoffeeListNavigation, MainNavigation } from '../../utils/keyboards';
import { ColombiaCategory, BrazilCategory, BlendCategory, getProductDetails } from './actions';

const { leave } = Stage;
export const shop = new Scene('shop');

shop.enter(async (ctx: TelegrafContext) => {
    await ctx.reply('Обере вид кафе 👇', (CoffeeListNavigation() as any).draw());
})

shop.leave(async (_: TelegrafContext) => {
})

shop.command('saveme', leave());

shop.hears('Colombia', ColombiaCategory);
shop.hears('Brazil', BrazilCategory);
shop.hears('Blend', BlendCategory);

//@ts-ignore
shop.hears('⬅ На головну', async (ctx: TelegrafContext) => {
    ctx.deleteMessage();
    await ctx.reply('Ось головне меню 👇', (MainNavigation() as any).draw());
});

shop.action(/productDetails/i, getProductDetails);
//@ts-ignore
shop.action(/toCart/i, (ctx: TelegrafContext) => ctx.scene.enter('cart'));

export default shop;