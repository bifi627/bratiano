export default class User
{
    public displayName: string;
    public email: string;

    public constructor( displayName: string, email: string )
    {
        this.displayName = displayName;
        this.email = email;
    }
}