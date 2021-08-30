import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ListIcon from '@material-ui/icons/List';
import { useHistory } from "react-router";
import { LeftMenuViewModel } from "./LeftMenuViewModel";

interface Props
{
    viewModel: LeftMenuViewModel;
}

const LeftMenu = ( props: Props ) =>
{
    const history = useHistory();
    return (
        <List component="nav">
            <ListItem button onClick={() =>
            {
                if ( history.location.pathname === "/" )
                {
                    history.push( "/temp" );
                    history.goBack();
                }
                else
                {
                    history.push( "/" );
                }
                props.viewModel.closeHandle();
            }}>
                <ListItemIcon>
                    <ListIcon></ListIcon>
                </ListItemIcon>
                <ListItemText primary="Alle Listen">
                </ListItemText>
            </ListItem>
        </List>
    );
}

export default LeftMenu;