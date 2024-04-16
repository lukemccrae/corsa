import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <MapIcon />
      </ListItemIcon>
      <ListItemText primary="My Courses" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <SearchIcon />
      </ListItemIcon>
      <ListItemText primary="Explore" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AddIcon onClick={() => console.log("hi")} />
      </ListItemIcon>
      <ListItemText primary="Add" />
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
      <ListItemText primary="About" />
    </ListItemButton>
  </React.Fragment>
);
