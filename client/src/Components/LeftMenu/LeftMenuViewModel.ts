import { AuthViewModel } from "../../AuthContext";

export class LeftMenuViewModel
{
    public closeHandle: () => void;
    constructor( authContext: AuthViewModel, closeHandle: () => void )
    {
        this.closeHandle = closeHandle;
    }
}