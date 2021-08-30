export interface Ownable
{
    owner: string;
}

export interface Sharable
{
    protected: boolean;
    shared: string[];
}

export interface Identifiable
{
    id: string;
}

export interface Sorter extends Identifiable
{
    order: string[];
}

export interface ShoppingList extends Identifiable, Ownable, Sharable
{
    title: string;
    description: string;
    createdAt: Date;
    ownerName?: string;
}

export type ItemType = "Text" | "Image";

export interface ShoppingItem extends Identifiable
{
    title: string;
    done: boolean;
    createdAt: Date;
    type: ItemType;
    data?: string;
}