import Scene from "telegraf/scenes/base";
import { ITelegramContext } from "../start";
import { MainNavigation } from "../../utils/keyboards";
import { getUserInfo } from "../../middlewares/functional/getUserInfo";
import { logger } from "../../utils/winston";

const questionnaire = new Scene("questionnaire");

questionnaire.enter(async (ctx: ITelegramContext) => {
  logger.debug("Questionnaire - displaying question");

  //@ts-ignore
  const q: any = ctx.session.questionnaire;
  //@ts-ignore
  const session: any = ctx.session.session;
  //@ts-ignore
  let index: number = ctx.session.questionnaire.active.index;
  //@ts-ignore
  const questions: [] = ctx.session.questionnaire.active.questions;
  const current: any = questions[index];

  if (
    (current.handler && current.handler != null) ||
    current.handler != undefined
  ) {
    current.handler(ctx);
  } else {
    ctx.reply(
      questions[index]["text"],
      //@ts-ignore
      questions[index].keyboard ? questions[index].keyboard.draw() : {}
    );
  }

  questionnaire.on("text", async (ctx: ITelegramContext) => {
    logger.debug(
      `Quesionnaire - reacting to the question: ${JSON.stringify(
        questions[index]
      )}`
    );
    //@ts-ignore
    questions[index].answer = ctx.update.message?.text;
    //@ts-ignore
    ctx.session.questionnaire.active.index = ++index;
    if (index >= questions.length) {
      index = 0;

      logger.debug("destroying quetionnaire");
      if (!q.final || q.final === "" || q.fina === null) {
        clearState(ctx);
        await ctx.scene.leave();
      } else {
        await q.final(ctx);
        clearState(ctx);
      }
    } else {
      ctx.scene.enter("questionnaire");
    }
  });
});

questionnaire.leave(async (ctx: ITelegramContext) => {
  logger.debug(
    `Questionnaire - leaving question ${JSON.stringify(
      //@ts-ignore
      ctx.session.questionnaire.active.questions[
        //@ts-ignore
        ctx.session.questionnaire.active.index - 1
      ]
    )}`
  );
});

questionnaire.hears(
  /(⬅ back Home)|(⬅ На главную)|(⬅ На головну)/i,
  getUserInfo,
  async (ctx: ITelegramContext) => {
    clearState(ctx);
    ctx.reply(
      ctx.i18n.t("keyboards.home"),
      (MainNavigation(ctx) as any).draw()
    );
  }
);

function clearState(ctx: ITelegramContext) {
  //@ts-ignore
  ctx.session.questionnaire = {};
}

export default questionnaire;
