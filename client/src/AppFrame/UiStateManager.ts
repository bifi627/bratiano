import { makeAutoObservable } from "mobx";

type LoadingScope = "Full" | "Content";

export class UiStateManger
{
    public isLoadingFullBlock = false;
    public isLoadingContentBlock = false;

    constructor()
    {
        makeAutoObservable( this );
    }

    public async asyncLoading( asyncFunction: () => Promise<any>, scope: LoadingScope = "Full" )
    {
        try
        {
            scope === "Full" ? this.isLoadingFullBlock = true : this.isLoadingContentBlock = true;
            await asyncFunction();
        }
        catch ( error )
        {
            throw error;
        }
        finally
        {
            scope === "Full" ? this.isLoadingFullBlock = false : this.isLoadingContentBlock = false;
        }
    }
}

export default UiStateManger;
