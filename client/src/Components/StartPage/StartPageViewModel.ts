import { MenuItem } from "common/src/Models/MenuItem";
import History from "history";
import { AuthViewModel } from "../../AuthContext";

export class StartPageViewModel
{
    public rightMenuItems: MenuItem[] = [];
    private history: History.History;

    constructor( authContext: AuthViewModel, history: History.History )
    {
        this.history = history;
        this.rightMenuItems.unshift( new MenuItem( "Account", "Ausloggen", async () =>
        {
            await authContext.logout();
        } ) );

        this.rightMenuItems.unshift( new MenuItem( "Account", "Profil", async () =>
        {
            this.history.push( "profile" );
        } ) );
    }
}