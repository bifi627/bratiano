
export class MenuItem
{
    public group: string;
    public text: string;
    public clickHandler: () => Promise<void>;

    constructor( group: string, text: string, clickHandler: () => Promise<void> )
    {
        this.text = text;
        this.group = group;
        this.clickHandler = clickHandler;
    }
}