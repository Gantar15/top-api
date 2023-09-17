import { ConfigService } from '@nestjs/config';
import { ITelegramOptions } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
  configService: ConfigService,
): ITelegramOptions => {
  const token = configService.getOrThrow('TELEGRAM_TOKEN');
  return {
    token: token,
    chatId: configService.get('TELEGRAM_CHAT_ID') || '',
  };
};
