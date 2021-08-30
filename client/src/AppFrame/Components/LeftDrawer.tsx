import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ListIcon from '@material-ui/icons/List';
import { observer } from "mobx-react";
import { useContext } from "react";
import { useHistory } from "react-router";
import AppFrameContext from "../AppFrame";

export default observer( () =>
{
    const appContext = useContext( AppFrameContext );
    const history = useHistory();

    return (
        <Drawer anchor={"left"} open={appContext.drawerOpended} onClose={() => appContext.toggleDrawer()}>
            <div style={{ width: "250px" }}>
                <List component="nav">

                    {appContext.mainMenu.map( menuPagePath =>
                    {
                        const page = appContext.knownPages.get( menuPagePath );

                        return (
                            <ListItem button onClick={() =>
                            {
                                if ( appContext.currentPath === page?.path )
                                {
                                    history.push( "/temp" );
                                    history.goBack();
                                }
                                else
                                {
                                    history.push( page?.path ?? "" );
                                }
                                appContext.toggleDrawer();
                            }}>
                                <ListItemIcon>
                                    <ListIcon></ListIcon>
                                </ListItemIcon>
                                <ListItemText primary={page?.title}>
                                </ListItemText>
                            </ListItem>
                        );
                    } )}
                </List>
            </div>
        </Drawer>
    );
} );
