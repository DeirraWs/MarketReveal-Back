// command/command-manager.service.ts
import { Injectable } from '@nestjs/common';
import { MyContext } from "../tg-bot.service";

export abstract class Handler {
    // Метод приймає обов'язковий `context` і необмежену кількість необов'язкових аргументів
    abstract handlerLogic(context: MyContext, ...args: any[]): Promise<any>;

    async handle(context: MyContext, ...args: any[]): Promise<any> {
        try {
            return await this.handlerLogic(context, ...args);
        } catch (e) {
            console.error(e);
            throw new Error("Handler error: " + e.message);
        }
    }
}

@Injectable()
export class CommandService {
    constructor() {}

    private readonly handlers: Map<string, Handler> = new Map();

    async handle(name: string, context: MyContext, ...args: any[]): Promise<any> {
        const handler = this.handlers.get(name);
        if (!handler) {
            throw new Error(`Handler not found for command: ${name}`);
        }
        return await handler.handle(context, ...args);
    }

    addHandler(name: string, handler: Handler) {
        this.handlers.set(name, handler);
    }
}
