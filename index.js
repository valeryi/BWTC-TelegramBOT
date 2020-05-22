import Telegraf from "telegraf"


const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.context.db = {
    getScores: () => { return 42 }
}

bot.on('text', (ctx) => {
    const scores = ctx.db.getScores(ctx.message.from.username)
    return ctx.reply(`${ctx.message.from.username}: ${scores}`)
})

bot.launch()