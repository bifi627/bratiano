import { Location } from "history";
import { autorun, makeAutoObservable } from "mobx";
import { createContext } from "react";
import { getAuthContext } from "..";
import UiStateManger from "./UiStateManager";

interface IPage
{
    title: string;
    path: string;
    contextMenuItems: IContextMenuItem[];
    component: () => JSX.Element;
}

interface IContextMenuItem
{
    text: string;
}

export class ContextMenuAction implements IContextMenuItem
{
    public text = "";
    public action: () => Promise<void>;
    constructor( text: string, action: () => Promise<void> )
    {
        this.text = text;
        this.action = action;
    }
}

export class ContextMenuNavigation implements IContextMenuItem
{
    public text;
    public path;
    constructor( text: string, path: string )
    {
        this.text = text;
        this.path = path;
    }
}

export function isContextAction( c: IContextMenuItem ): c is ContextMenuAction
{
    return ( c as any ).action !== undefined;
}

export function isContextNavigation( c: IContextMenuItem ): c is ContextMenuNavigation
{
    return ( c as any ).path !== undefined;
}

export class AppFrame
{
    public knownPages: Map<string, IPage> = new Map();
    public currentPath = "";
    public defaultPath = "/";

    public mainMenu: string[] = [];

    public uiStateManager = new UiStateManger();

    constructor()
    {
        const logoutAction = new ContextMenuAction( "Ausloggen", () =>
        {
            return getAuthContext().logout();
        } );

        this.knownPages.forEach( p => p.contextMenuItems.push( logoutAction ) );

        makeAutoObservable( this );

        autorun( () =>
        {
            console.log( this.currentPath );
        } );
    }

    public registerPage( page: IPage )
    {
        if ( this.knownPages.has( page.path ) )
        {
            throw new Error( `A path for '${page.path}' is already registered` );
        }

        this.knownPages.set( page.path, page );
    }

    public drawerOpended = false;
    public toggleDrawer()
    {
        this.drawerOpended = !this.drawerOpended;
    }

    public contextMenuHandle: HTMLButtonElement | undefined;
    public contextMenuOpened = false;
    public toggleContextMenu()
    {
        this.contextMenuOpened = !this.contextMenuOpened;
    }

    public get contextMenuAnchor()
    {
        return this.contextMenuOpened ? this.contextMenuHandle : undefined;
    }

    public getHeaderTextForLocation( location: Location )
    {
        return this.knownPages.get( location.pathname )?.title ?? location.pathname;
    }

    public getContextMenuForLocation( location: Location )
    {
        return this.knownPages.get( location.pathname )?.contextMenuItems;
    }
}

const AppFrameContext = createContext<AppFrame>( {} as AppFrame )
export default AppFrameContext;