// import { ITelegramContext } from "../start";
// import Keyboard from "telegraf-keyboard";

// export async function questionHandlerPack(ctx: ITelegramContext) {
//   // @ts-ignore
//   ctx.i18n.locale(ctx.session.user.language_code);
//   const packOptions = new Keyboard().add("250", "500", "1000");

//   await ctx.reply(ctx.i18n.t("scenes.shop.question_pack"), packOptions.draw());
//   await ctx.reply(ctx.i18n.t("scenes.shop.choose"), packOptions.draw());

//   //@ts-ignore
//   ctx.session.questionnaire.active.index++;
//   //@ts-ignore
//   return ctx.wizard.next();
// }

// export async function questionHandlerGrind(ctx: ITelegramContext) {
//   // @ts-ignore
//   ctx.i18n.locale(ctx.session.user.language_code);
//   const grindOptions = new Keyboard().add(
//     ctx.i18n.t("scenes.shop.question_grind_answer1"),
//     ctx.i18n.t("scenes.shop.question_grind_answer2")
//   );

//   await ctx.reply(
//     ctx.i18n.t("scenes.shop.question_grind"),
//     grindOptions.draw()
//   );
//   await ctx.reply(ctx.i18n.t("scenes.shop.choose"), grindOptions.draw());

//   //@ts-ignore
//   ctx.session.questionnaire.active.index++;
//   //@ts-ignore
//   return ctx.wizard.next();
// }

// export async function questionHandlerFor(ctx: ITelegramContext) {
//   // @ts-ignore
//   ctx.i18n.locale(ctx.session.user.language_code);
//   const forOptions = new Keyboard();
//   //@ts-ignore
//   const index = ctx.session.questionnaire.active.index;
//   //@ts-ignore
//   const questions = ctx.session.questionnaire.active.questions;
//   //@ts-ignore
//   const previous = ctx.session.questionnaire.active.questions[index - 1];

//   if (previous.answer === ctx.i18n.t("scenes.shop.question_grind_answer1")) {
//     await ctx.reply(ctx.i18n.t("scenes.shop.question_for"), forOptions.clear());
//     //@ts-ignore
//     ctx.session.questionnaire.active.index++;
//   } else {
//     await ctx.scene.enter("shop");
//     //@ts-ignore
//     return ctx.scene.leave();
//   }
// }
