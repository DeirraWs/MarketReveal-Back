// command/command-manager.service.ts
import { Injectable } from '@nestjs/common';
import {Context} from "grammy";


export abstract class Handler {

    abstract handlerLogic(context: Context): Promise<any>;

    async handle(context: Context): Promise<any> {
        try {
            return await this.handlerLogic(context);
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

    async handle (name: string, context: Context): Promise<void> {
        const handler = this.handlers.get(name);
        return  await handler.handle(context)
    }

    addHandler(name:string, handler: Handler){
        this.handlers.set(name,handler);
    }
}