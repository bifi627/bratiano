import { computed, makeAutoObservable, observable } from "mobx";
import { AuthViewModel } from "../../AuthContext";

export class LoginViewModel
{
    public username: string = "";

    public email: string = "";

    public password: string = "";

    public get canTryLogin()
    {
        return this.email !== "" && this.password !== "";
    }

    public get canTryRegister()
    {
        return this.username !== "" && this.email !== "" && this.password !== "";
    }

    constructor()
    {
        makeAutoObservable( this, {
            username: observable,
            email: observable,
            password: observable,
            canTryLogin: computed,
            canTryRegister: computed,
        } );
    }

    public clear()
    {
        this.username = "";
        this.email = "";
        this.password = "";
    }

    public async login( authContext: AuthViewModel, email: string, password: string ): Promise<true | { code: string, message: string }>
    {
        try
        {
            await authContext.login( email, password );
            return true;
        }
        catch ( error )
        {
            return error as { code: string, message: string };
        }
    }

    public async loginAnonymously( authContext: AuthViewModel )
    {
        try
        {
            await authContext.loginAnonymously();
            return true;
        }
        catch ( error )
        {
            return error as { code: string, message: string };
        }
    }

    public async register( authContext: AuthViewModel, email: string, password: string, username: string ): Promise<true | { code: string, message: string }>
    {
        try
        {
            await authContext.register( email, password, username );
            return true;
        }
        catch ( error )
        {
            return error as { code: string, message: string };
        }
    }
}