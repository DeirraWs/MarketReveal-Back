import {Injectable } from '@nestjs/common';
import { Menu } from '@grammyjs/menu';
import {MyContext} from "../tg-bot.service";


export abstract class MenuStructure {

    protected _menu: Menu<MyContext>;

    protected abstract creteMenu():void;
    abstract getMenu():Menu<MyContext>

}

@Injectable()
export class MenuService {

    private readonly _menus: Map<string,  MenuStructure> = new Map()

    constructor() {
    }

    registerMenu(id:string , menu: MenuStructure): void {
        this._menus.set(id, menu);
    }

    getMenuClass(id: string): MenuStructure {
        return this._menus.get(id);
    }

    getAllMenuToRegisterInBot(): Menu<MyContext>[] {
        const menus =  Array.from(this._menus.values())
        return menus.map((value)=>{
            return  value.getMenu()
        })
    }

}