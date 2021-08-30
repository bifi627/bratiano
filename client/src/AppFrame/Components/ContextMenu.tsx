import { Menu, MenuItem } from "@material-ui/core";
import { observer } from "mobx-react";
import { useContext } from "react";
import { useHistory, useLocation } from "react-router";
import AppFrameContext, { isContextAction, isContextNavigation } from "../AppFrame";

// eslint-disable-next-line import/no-anonymous-default-export
export default observer( () => 
{
    const appFrame = useContext( AppFrameContext );

    const location = useLocation();
    const history = useHistory();

    const contextMenuItems = appFrame.getContextMenuForLocation( location );

    return (
        <Menu anchorEl={appFrame.contextMenuAnchor} open={appFrame.contextMenuOpened} onClose={() => appFrame.toggleContextMenu()}>
            {contextMenuItems?.map( item =>
            {
                return (
                    <MenuItem onClick={async () =>
                    {
                        if ( isContextAction( item ) )
                        {
                            await item.action();
                        }
                        else if ( isContextNavigation( item ) )
                        {
                            history.push( item.path );
                        }

                        appFrame.toggleContextMenu();
                    }}>{item.text}</MenuItem>
                );
            } )}
        </Menu>
    );
} );
