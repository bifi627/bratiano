import { ShoppingItem } from "common/src/Models/ShoppingListDefinitions";
import { configure, makeAutoObservable } from "mobx";

configure( { safeDescriptors: false } )

export class ShoppingListViewModel
{
    public items: ShoppingItem[] = [];

    public order: string[] = [];

    public get doneItems()
    {
        return this.items?.filter( x => x.done === true );
    }

    public get todoItems()
    {
        const sorted = this.items?.filter( x => x.done === false ).sort( ( a, b ) =>
        {
            return this.order.indexOf( a.id ) > this.order.indexOf( b.id ) ? 1 : -1;
        } ).sort( ( a, b ) =>
        {
            if ( this.order.includes( b.id ) === false )
            {
                return -1;
            }
            return 0;
        } );

        return sorted;
    }

    constructor()
    {
        makeAutoObservable( this );
    }
}

