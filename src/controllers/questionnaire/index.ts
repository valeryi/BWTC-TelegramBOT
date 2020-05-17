// import WizardScene from "telegraf/scenes/wizard";
// // const { leave } = require("telegraf/stage");
// // import {
// //   questionHandlerPack,
// //   questionHandlerFor,
// //   questionHandlerGrind,
// // } from "../shop/actions";
// import { ITelegramContext } from "../start";
// import Keyboard from "telegraf-keyboard";

// const Questionnaire = new WizardScene(
//   "questionnaire",
//   async (ctx: ITelegramContext) => {
//     // @ts-ignore
//     ctx.i18n.locale(ctx.session.user.language_code);
//     const packOptions = new Keyboard().add("250", "500", "1000");

//     await ctx.reply(
//       ctx.i18n.t("scenes.shop.question_pack"),
//       packOptions.draw()
//     );
//     await ctx.reply(ctx.i18n.t("scenes.shop.choose"), packOptions.draw());

//     //@ts-ignore
//     // ctx.session.questionnaire.active.index++;
//     //@ts-ignore
//     return ctx.wizard.next();
//   },
//   async (ctx: ITelegramContext) => {
//     // @ts-ignore
//     ctx.i18n.locale(ctx.session.user.language_code);

//     //@ts-ignore
//     const forOptions = new Keyboard();
//     //@ts-ignore
//     const index = ctx.session.questionnaire.active.index;
//     //@ts-ignore
//     const questions = ctx.session.questionnaire.active.questions;

//     // ANSWER TO THE FIRST QUESTION
//     if (questions[0].answer === "" || questions[0].answer === null) {
//       //@ts-ignore
//       ctx.session.questionnaire.active.questions[0].answer = ctx.message?.text;
//     }

//     if (questions[1].answer === "" || questions[1].answer === null) {
//       // SECOND QUESTION
//       const grindOptions = new Keyboard().add(
//         ctx.i18n.t("scenes.shop.question_grind_answer1"),
//         ctx.i18n.t("scenes.shop.question_grind_answer2")
//       );

//       await ctx.reply(
//         ctx.i18n.t("scenes.shop.question_grind"),
//         grindOptions.draw()
//       );
//       await ctx.reply(ctx.i18n.t("scenes.shop.choose"), grindOptions.draw());

//       if(ctx.message?.text !== ctx.i18n.t("scenes.shop.question_grind_answer1")) {

//       }
//     }

//     // THIRD QUESTION
//     if (
//       ctx.message?.text === ctx.i18n.t("scenes.shop.question_grind_answer1") &&
//       (questions[1].answer !== "" || questions[1].answer !== null)
//     ) {
//       //@ts-ignore
//       ctx.session.questionnaire.active.questions[1].answer = ctx.message?.text;

//       await ctx.reply(
//         ctx.i18n.t("scenes.shop.question_for"),
//         forOptions.clear()
//       );

//       //@ts-ignore
//       return ctx.wizard.next();
//     } 

//     if((questions[1].answer === "" || questions[1].answer === null) && ) 
//   },
//   // async (ctx: ITelegramContext) => {
//   //   // @ts-ignore
//   //   ctx.i18n.locale(ctx.session.user.language_code);

//   //   const forOptions = new Keyboard();
//   //   //@ts-ignore
//   //   const index = ctx.session.questionnaire.active.index;
//   //   //@ts-ignore
//   //   const questions = ctx.session.questionnaire.active.questions;
//   //   //@ts-ignore
//   //   const previous = ctx.session.questionnaire.active.questions[index - 1];

//   //   if (previous.answer === ctx.i18n.t("scenes.shop.question_grind_answer1")) {
//   //     await ctx.reply(
//   //       ctx.i18n.t("scenes.shop.question_for"),
//   //       forOptions.clear()
//   //     );
//   //     //@ts-ignore
//   //     ctx.session.questionnaire.active.index++;
//   //     //@ts-ignore
//   //     return ctx.wizard.next();
//   //   } else {
//   //     //@ts-ignore
//   //     // return ctx.wizard.next();
//   //   }
//   // },
//   async (ctx: ITelegramContext) => {
//     //@ts-ignore
//     ctx.session.questionnaire.active.questions[2].answer = ctx.message?.text;
//     //@ts-ignore
//     console.log(ctx.session.questionnaire);
//     //@ts-ignore
//     console.log(ctx.session.questionnaire.active.questions);
//     //@ts-ignore
//     await ctx.scene.enter("shop");
//   }
// );

// export default Questionnaire;

// // import Scene from "telegraf/scenes/base";
// // import { ITelegramContext } from "../start";
// // import { MainNavigation } from "../../utils/keyboards";
// // import { getUserInfo } from "../../middlewares/functional/getUserInfo";
// // import { logger } from "../../utils/winston";

// // const questionnaire = new Scene("questionnaire");

// // questionnaire.enter(getUserInfo, async (ctx: ITelegramContext) => {
// //   logger.debug("Questionnaire - displaying question");

// //   //@ts-ignore
// //   // ctx.i18n.locale(ctx.session.user.language_code);
// //   // logger.debug("Setting users locale");

// //   //@ts-ignore
// //   const q: any = ctx.session.questionnaire;
// //   //@ts-ignore
// //   const session: any = ctx.session.session;
// //   //@ts-ignore
// //   let index: number = ctx.session.questionnaire.active.index;
// //   //@ts-ignore
// //   let questions: [] = ctx.session.questionnaire.active.questions;
// //   const current: any = questions[index];
// //   console.log(index);
// //   if (
// //     (current.handler && current.handler != null) ||
// //     current.handler != undefined
// //   ) {
// //     current.handler(ctx);
// //   } else {
// //     ctx.reply(
// //       questions[index]["text"],
// //       //@ts-ignore
// //       questions[index].keyboard ? questions[index].keyboard.draw() : {}
// //     );
// //   }

// //   console.log("do this code");

// //   questionnaire.on("text", async (ctx: ITelegramContext) => {
// //     logger.debug(
// //       `Quesionnaire - reacting to the question: ${JSON.stringify(
// //         questions[index]
// //       )}`
// //     );
// //     //@ts-ignore
// //     questions[ctx.session.questionnaire.active.index].answer =
// //       ctx.update.message?.text;

// //     //@ts-ignore
// //     ctx.session.questionnaire.active.index = ++ctx.session.questionnaire.active
// //       .index;
// //     //@ts-ignore
// //     if (ctx.session.questionnaire.active.index >= questions.length) {
// //       //@ts-ignore
// //       ctx.session.questionnaire.active.index = 0;

// //       logger.debug("destroying quetionnaire");
// //       if (!q.final || q.final === "" || q.final === null) {
// //         // clearState(ctx);
// //         await ctx.scene.leave();
// //       } else {
// //         await q.final(ctx);
// //         // clearState(ctx);
// //       }
// //     } else {
// //       ctx.scene.enter("questionnaire");
// //     }
// //   });
// // });

// // questionnaire.leave(async (ctx: ITelegramContext) => {
// //   logger.debug(
// //     `Questionnaire - leaving question ${JSON.stringify(
// //       //@ts-ignore
// //       ctx.session.questionnaire.active.questions[
// //         //@ts-ignore
// //         ctx.session.questionnaire.active.index - 1
// //       ]
// //     )}`
// //   );
// //   // clearState(ctx);
// // });

// // questionnaire.hears(
// //   /(⬅ back Home)|(⬅ На главную)|(⬅ На головну)/i,
// //   getUserInfo,
// //   async (ctx: ITelegramContext) => {
// //     // clearState(ctx);
// //     ctx.reply(
// //       ctx.i18n.t("keyboards.home"),
// //       (MainNavigation(ctx) as any).draw()
// //     );
// //   }
// // );

// // // function clearState(ctx: ITelegramContext) {
// // //   //@ts-ignore
// // //   ctx.session.questionnaire = {};
// // // }

// // export default questionnaire;
