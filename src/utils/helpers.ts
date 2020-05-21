import { ITelegramContext } from "../controllers/start";

export function getActionParams(ctx: ITelegramContext): string[] {
  const args = (ctx.match?.input || "")
    .split(" ")
    .slice(1, ctx.match?.input.split(" ").length);

  return args as string[];
}
