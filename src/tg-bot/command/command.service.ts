// command/command-manager.service.ts
import { Injectable } from '@nestjs/common';
import {MyContext} from "../tg-bot.service";


export abstract class Handler {

    abstract handlerLogic(context: MyContext, data?: any): Promise<any>;

    async handle(context: MyContext,data? : any): Promise<any> {
        try {
            return await this.handlerLogic(context,data);
        } catch (e) {
            console.error(e);
            throw new Error("Handler error: " + e.message);
        }
    }
}

@Injectable()
export class CommandService {
    constructor() {}

    private readonly handlers: Map<string, Handler> = new Map()

    async handle (name: string, context: MyContext, data? :any): Promise<void> {
        const handler = this.handlers.get(name);
        return  await handler.handle(context,data)
    }

    addHandler(name:string, handler: Handler){
        this.handlers.set(name,handler);
    }
}