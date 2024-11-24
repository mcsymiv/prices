import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'

interface MyBot {
  send(msg: string): Promise<TelegramBot.Message>
}

class Telegram implements MyBot {
  readonly bot: TelegramBot

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY!)
  }


  send(msg: string): Promise<TelegramBot.Message> {
    const chatId: TelegramBot.ChatId = process.env.TELEGRAM_CHAT_ID!
    return this.bot.sendMessage(chatId, msg);
  }
}

export { MyBot, Telegram }
