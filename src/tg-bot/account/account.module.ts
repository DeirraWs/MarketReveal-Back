import { Module } from '@nestjs/common';
import { AccountOpenHandler } from './accountOpenHandler';
import { MenuModule } from '../menu/menu.module';
import { CommandModule } from '../command/command.module';
import { AccountCloseHandler } from './accountCloseHandler';
import { LanguageChangeHandler } from './languageChangeHandler';
import { LanguageMenuOpenHandler } from './languageMenuOpenHandler';


@Module({
  providers: [
    AccountOpenHandler,
    AccountCloseHandler,
    LanguageChangeHandler,
    LanguageMenuOpenHandler
  ],
  exports: [
    AccountOpenHandler,
    AccountCloseHandler
  ],
  imports: [
    MenuModule,
    CommandModule,
  ],
})
export class AccountModule {
}