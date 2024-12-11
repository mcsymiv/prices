import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'

interface MyBot {
  send(msg: string): Promise<TelegramBot.Message>
  sendPhoto(imagePath: string): Promise<TelegramBot.Message>
}

class Telegram implements MyBot {
  readonly bot: TelegramBot

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_KEY!)
  }


  send(msg: string): Promise<TelegramBot.Message> {
    const chatId: TelegramBot.ChatId = process.env.TELEGRAM_CHAT_ID!
    const testChatId: TelegramBot.ChatId = process.env.TELEGRAM_CHAT_ID_TEST!
    this.bot.sendMessage(testChatId, msg);
    return this.bot.sendMessage(chatId, msg);
  }

  sendPhoto(imagePath: string): Promise<TelegramBot.Message> {
    const chatId: TelegramBot.ChatId = process.env.TELEGRAM_CHAT_ID_TEST!
    return this.bot.sendPhoto(chatId, imagePath);
  }
}

export { MyBot, Telegram }
