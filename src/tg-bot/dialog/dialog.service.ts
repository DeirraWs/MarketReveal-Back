import {Injectable} from "@nestjs/common";
import {MyContext} from "../tg-bot.service";
import {MenuService} from "../menu/menu.service";


export abstract class Dialog {

    protected constructor( protected readonly menuService: MenuService,) {
    }

    abstract name: string;

    abstract start(ctx: MyContext): Promise<void>;

    abstract processMessage(ctx: MyContext): Promise<void>;

    async end(ctx: MyContext) {
        ctx.session.activeDialog = undefined;
        ctx.session.dialogData = undefined;
    }
}

@Injectable()
export class DialogService {
    private dialogs: Record<string, Dialog> = {};

    registerDialog(dialog: Dialog) {
        this.dialogs[dialog.name] = dialog;
    }

    async startDialog(ctx: MyContext, dialogName: string) {
        const dialog = this.dialogs[dialogName];
        if (dialog) {
            await dialog.start(ctx);
        } else {
            await ctx.reply("Діалог не знайдено.");
        }
    }

    async processMessage(ctx: MyContext) {
        const activeDialog = ctx.session.activeDialog;
        if (activeDialog) {
            const dialog = this.dialogs[activeDialog];
            if (dialog) {
                await dialog.processMessage(ctx);
            }
        }
    }
}