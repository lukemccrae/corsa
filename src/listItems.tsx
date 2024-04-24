import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MapIcon from "@mui/icons-material/Map";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
interface MainListItemsProps {
  setAddCourseOpen: Function;
}
export const mainListItems = ({ setAddCourseOpen }: MainListItemsProps) => (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <MapIcon onClick={() => setAddCourseOpen(false)} />
      </ListItemIcon>
      <ListItemText />
    </ListItemButton>
    {/* <ListItemButton>
      <ListItemIcon>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText primary="Explore" />
    </ListItemButton> */}
    <ListItemButton>
      <ListItemIcon>
        <AddIcon onClick={() => setAddCourseOpen(true)} />
      </ListItemIcon>
      <ListItemText />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset></ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText />
    </ListItemButton>
  </React.Fragment>
);
