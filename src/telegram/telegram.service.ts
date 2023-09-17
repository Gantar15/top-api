import { ITelegramOptions } from './telegram.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Injectable()
export class TelegramService {
  bot: Telegraf;

  constructor(
    @Inject(TELEGRAM_MODULE_OPTIONS)
    readonly options: ITelegramOptions,
  ) {
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(message: string, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
