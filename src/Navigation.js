import React, { useContext } from "react";

import { withRouter } from "react-router";
import CssBaseline from "@material-ui/core/CssBaseline";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";

import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { useSelector, useDispatch } from "react-redux";
import * as newSpecificationActions from "./actions/newSpecificationActions";
import * as navigationActions from "./actions/navigationActions";
import * as appActions from "./actions/appActions";

import authService from "./services/authService";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Select from "@material-ui/core/Select";

import SaveIcon from "@material-ui/icons/Save";
import PeopleIcon from "@material-ui/icons/People";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddIcon from "@material-ui/icons/Add";
import EuroIcon from "@material-ui/icons/Euro";
import SvgIcon from "@material-ui/core/SvgIcon";

import { Link } from "react-router-dom";
import TranslationsContext from "./providers/translation";

import logo from "./img/logo.png";
function PercentIcon(props) {
  return (
    <SvgIcon {...props}>
      <path
        d="M18.5 3.5l-15 15l2 2l15-15M7 4a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m10 10a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"
        fill="rgba(0, 0, 0, 0.54)"
      />
    </SvgIcon>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24,
    paddingLeft: 16,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    "@media print": {
      display: "none",
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down("sm")]: {
      marginRight: 6,
    },
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    "@media print": {
      display: "block",
    },
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.down("sm")]: {
      width: 0,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  activeMenuItem: {
    background: theme.palette.secondary.main,
  },
  drawerPrint: {
    "@media print": {
      display: "none",
    },
  },
  textColorWhite: {
    color: "#ffffff",
  },
  icon: {
    fill: "#ffffff",
  },
}));

function Navigation(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const drawerOpen = useSelector((state) => state.navigation.drawerOpen);
  const language = useSelector((state) => state.navigation.language);

  const t = useContext(TranslationsContext);

  const handleDrawerOpen = () => {
    dispatch(navigationActions.setDrawerOpen(true));
  };
  const handleDrawerClose = () => {
    dispatch(navigationActions.setDrawerOpen(false));
  };

  const logout = () => {
    authService.logout();
  };

  const setLanguage = (lang) => {
    dispatch(navigationActions.setLanguage(lang));
  };

  const resetSpec = () => {
    dispatch(newSpecificationActions.reset());
  };

  const resetSelectedUser = () => {
    dispatch(appActions.setSelectedUser(props?.user?.uid));
  };

  const goTo = (to) => {
    return to;
  };

  const renderLanguage = () => {
    return (
      <Select
        labelId="select-language"
        id="select-language"
        value={language}
        onChange={(evt) => setLanguage(evt.target.value)}
        disableUnderline
        inputProps={{
          classes: {
            icon: classes.icon,
            root: classes.textColorWhite,
          },
        }}
      >
        <MenuItem value="en">
          <span role="img" aria-label="flag-en">
            🇬🇧
          </span>{" "}
          EN
        </MenuItem>
        <MenuItem value="lt">
          <span role="img" aria-label="flag-lt">
            {" "}
            🇱🇹
          </span>{" "}
          LT
        </MenuItem>
      </Select>
    );
  };

  const { pathname } = props.location;
  if (pathname === "/") return null;

  const renderIndividualPricePage = () => {
    if (props.isAdmin) {
      return (
        <ListItem
          className={
            pathname === "/individualPrices" ? classes.activeMenuItem : null
          }
          component={Link}
          to={goTo("/individualPrices")}
          onClick={resetSelectedUser}
          button
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={t["individual_prices"]} />
        </ListItem>
      );
    }

    return null;
  };

  const renderUsers = () => {
    if (props.isAdmin) {
      return (
        <ListItem
          className={pathname === "/users" ? classes.activeMenuItem : null}
          component={Link}
          to={goTo("/users")}
          onClick={resetSelectedUser}
          button
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t["menu_users"]} />
        </ListItem>
      );
    }

    return null;
  };
  const renderPrices = () => {
    if (props.isAdmin) {
      return (
        <ListItem
          className={pathname === "/prices" ? classes.activeMenuItem : null}
          component={Link}
          to={goTo("/prices")}
          onClick={resetSelectedUser}
          button
        >
          <ListItemIcon>
            <EuroIcon />
          </ListItemIcon>
          <ListItemText primary={t["prices"]} />
        </ListItem>
      );
    }

    return null;
  };

  const variant = isSmallScreen ? "temporary" : "permanent";
  return (
    <>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              drawerOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>

          <div className={classes.title}>
            <img src={logo} alt="Door World" height="auto" width="100"></img>
          </div>

          {renderLanguage()}

          <IconButton color="inherit" onClick={logout}>
            <PowerSettingsNew />
          </IconButton>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        className={classes.drawerPrint}
        variant={variant}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        onOpen={handleDrawerOpen}
        onClose={handleDrawerClose}
        open={drawerOpen}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <div className={classes.toolbarIcon}>
          <Typography variant="h6" style={{ paddingLeft: 16 }}>
            {t["menu"]}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>

        <Divider />
        <List>
          <ListSubheader inset>{t["menu_administration"]}</ListSubheader>

          {renderUsers()}

          {renderIndividualPricePage()}

          <ListItem
            className={pathname === "/markup" ? classes.activeMenuItem : null}
            component={Link}
            to={goTo("/markup")}
            onClick={resetSelectedUser}
            button
          >
            <ListItemIcon>
              <PercentIcon />
            </ListItemIcon>
            <ListItemText primary={t["markup"]} />
          </ListItem>

          {renderPrices()}

          <ListItem
            className={pathname === "/settings" ? classes.activeMenuItem : null}
            component={Link}
            to={goTo("/settings")}
            onClick={resetSelectedUser}
            button
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t["menu_settings"]} />
          </ListItem>
        </List>

        <Divider />
        <List>
          <ListSubheader inset>{t["menu_specifications"]}</ListSubheader>
          <ListItem
            className={pathname === "/new" ? classes.activeMenuItem : null}
            component={Link}
            to={goTo("/new")}
            onClick={() => {
              resetSelectedUser();
              resetSpec();
            }}
            button
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={t["menu_create_new"]} />
          </ListItem>
          <ListItem
            className={pathname === "/my" ? classes.activeMenuItem : null}
            component={Link}
            to={goTo("/my")}
            onClick={resetSelectedUser}
            button
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={t["menu_my_specifications"]} />
          </ListItem>
          <ListItem
            className={pathname === "/drafts" ? classes.activeMenuItem : null}
            component={Link}
            to={goTo("/drafts")}
            onClick={resetSelectedUser}
            button
          >
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>
            <ListItemText primary={t["menu_my_drafts"]} />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

export default withRouter(Navigation);
