import { DocumentAccess } from "common/src/Contracts/DocumentAccess";
import { makeAutoObservable } from "mobx";
import { AuthViewModel } from "../../AuthContext";

export class PasswordPageViewModel
{
    public password = "";
    public readonly docPath: string;

    private authContext: AuthViewModel;

    constructor( authContext: AuthViewModel, docPath: string )
    {
        this.docPath = docPath;
        this.authContext = authContext;

        makeAutoObservable( this );
    }

    public async getAccess()
    {
        const idToken = await this.authContext.authProvider.currentUser?.getIdToken() ?? "";

        const data = { password: this.password, docPath: this.docPath, idToken: idToken };
        const { access } = await DocumentAccess.Client.getDocumentAccess( data );

        return access;
    }
}
