import { TelegrafContext } from "telegraf/typings/context";
import Keyboard from 'telegraf-keyboard';
import { getProductList } from "./_helpers";
import { getTemplate } from '../../templates';


export function ColombiaCategory(ctx: TelegrafContext) {
    // ctx.deleteMessage();

    const template = getTemplate('colombia_details',[]);
    const toCartAction = new Keyboard({inline: true}).add('toCard:colombia');

    ctx.replyWithHTML(template, toCartAction.draw());


    //@ts-ignore
    // const colombia = ctx.session.products.filter(product => product.category.toLowerCase() === 'colombia');

    // const ColombiaList = getProductList(colombia);

    // ctx.reply('Наша Колумбія 👇', ColombiaList.draw());
}

export function BrazilCategory(ctx: TelegrafContext) {
    ctx.deleteMessage();

    //@ts-ignore
    const brazil = ctx.session.products.filter(product => product.category.toLowerCase() === 'brazil');

    const BrazilList = getProductList(brazil);

    ctx.reply('Наша Бразілія 👇', BrazilList.draw());
}

export function BlendCategory(ctx: TelegrafContext) {
    ctx.deleteMessage();

    //@ts-ignore
    const blend = ctx.session.products.filter(product => product.category.toLowerCase() === 'blend');

    const blendList = getProductList(blend);

    ctx.reply('Наш Бленд> 👇', blendList.draw());
}

export async function getProductDetails(ctx: TelegrafContext) {

    const match = ctx.match?.input;
    const id = (match as string).split(' ')[1];

    //@ts-ignore
    const details = ctx.session.products.filter(product => product._id == id)[0];

    const product_card = getTemplate('product_details', {
        product_name: details.name,
        product_id: details._id,
        product_price: details.price / 100
    })

    const options = {
        inline: true,
        duplicates: false,
        newline: false,
    };

    const toCart = new Keyboard(options);

    toCart.add(`У кошик:toCart ${details._id}`);

    await ctx.replyWithHTML(product_card, toCart.draw());

}