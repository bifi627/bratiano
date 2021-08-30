import { useContext } from "react";
import AppFrameContext from "../AppFrame";

// eslint-disable-next-line import/no-anonymous-default-export
export default () =>
{
    const appContext = useContext( AppFrameContext );

    return (
        <>
            <div>DEMO PAGE</div>
            <button onClick={async () =>
            {
                try
                {
                    await appContext.uiStateManager.asyncLoading( () =>
                    {
                        return new Promise<void>( ( resolve, reject ) =>
                        {
                            setTimeout( () =>
                            {
                                reject( new Error( "TEST" ) );
                            }, 2000 );
                        } )
                    }, "Content" );
                }
                catch ( error )
                {
                    alert( error );
                }

            }}>Test async Error 2000ms</button>
        </>
    );
};