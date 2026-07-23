import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from "react-router-dom";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SignIn from "./SignIn";
import Navigation from "./Navigation";
import "typeface-roboto";
import "./App.css";
import { createTheme } from "@material-ui/core/styles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { useAuth, useUsers, useApiDataOnce } from "./hooks/useApi";
import apiService from "./services/apiService";
import logger from "./utils/logger";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import * as appActions from "./actions/appActions";

import Users from "./Users";
import Settings from "./Settings";
import Prices from "./Prices";
import IndividualPrices from "./IndividualPrices";
import Markup from "./Markup";
import NewSpecification from "./NewSpecification";
import MySpecifications from "./MySpecifications";
import Specification from "./Specification";
import MyDrafts from "./MyDrafts";

import TranslationsContext, {
  TranslationsProvider,
} from "./providers/translation";
import { PriceProvider } from "./providers/price";

// Make logger available globally in development
if (process.env.NODE_ENV === 'development') {
  window.logger = logger;
  console.log('🔍 Logger available globally. Use window.logger.enable() or window.logger.disable() to control API logging.');
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  const t = useContext(TranslationsContext);

  return (
    <Typography
      style={{ marginBottom: 16 }}
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {t["copyright"]} ©{" "}
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#e31e24" }}
      >
        Door World
      </a>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    tableHoverColor: "#ffcccb",
    primary: {
      main: "#2b2b2a",
    },
    secondary: {
      main: "#e31e24",
    },
    type: "light",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "@media print": {
      display: "block",
    },
  },
  toolbar: {
    paddingRight: 24,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
    "@media print": {
      display: "none",
    },
  },
  content: {
    flexGrow: 1,
    height: "100vh",
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
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    height: "100vh",
  },
}));

function PrivateRoute({ children, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [user, loading, authenticated] = useAuth();

  const [userDataError, setUserDataError] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // SNACKBAR
  const snackbarOpen = useSelector((state) => state.app.snackbarOpen);
  const snackbarSeverity = useSelector((state) => state.app.snackbarSeverity);
  const snackbarText = useSelector((state) => state.app.snackbarText);

  const selectedUser = useSelector((state) => state.app.selectedUser);
  const language = useSelector((state) => state.navigation.language);
  const [translations, setTranslations] = useState({});

  // Replace Firebase hooks with API calls
  const [dimensionsClassic, dimensionsClassicLoading] = useApiDataOnce(
    () => apiService.getProductsByGroup('classic-dimensions', language),
    [language]
  );
  const [dimensionsMax, dimensionsMaxLoading] = useApiDataOnce(
    () => apiService.getProductsByGroup('max-dimensions', language),
    [language]
  );
  const [rawTranslations, rawTranslationsLoading] = useApiDataOnce(
    () => apiService.translations.getTranslations(language),
    [language]
  );
  const [rawUsers, rawUserLoading] = useUsers();

  useEffect(() => {
    if (!loading && user) {
      console.log('🔍 [APP] Processing authenticated user:', {
        user: user,
        userKeys: Object.keys(user || {}),
        userIsAdmin: user.isAdmin,
        userIsAdminType: typeof user.isAdmin,
        fullUserObject: JSON.stringify(user, null, 2)
      });
      
      dispatch(appActions.setSelectedUser(user.id));
      
      // Check if user is admin (this could be a field in the user object from JWT)
      const adminStatus = user.isAdmin || false;
      console.log('✅ [APP] Setting admin status:', {
        originalValue: user.isAdmin,
        finalValue: adminStatus,
        willSetIsAdmin: adminStatus
      });
      
      setIsAdmin(adminStatus);
      setLoadingUserData(false);
      
      // Alternatively, if admin status needs to be fetched separately:
      // apiService.getMoreUserDetails(user.id)
      //   .then((data) => {
      //     setIsAdmin(data.isAdmin || false);
      //   })
      //   .catch((error) => {
      //     setUserDataError(error);
      //   })
      //   .finally(() => {
      //     setLoadingUserData(false);
      //   });
    } else if (!loading && !authenticated) {
      setLoadingUserData(false);
    }
  }, [loading, user, authenticated, dispatch]);

  useEffect(() => {
    if (!rawTranslationsLoading && rawTranslations) {
      // Assuming the API returns translations in a format like { key: value }
      // If the API returns an array, we might need to process it differently
      if (Array.isArray(rawTranslations)) {
        let translations = {};
        rawTranslations.forEach((item) => {
          translations[item.key || item.id || item.id] = item[language] || item.value;
        });
        setTranslations(translations);
      } else {
        // If it's already an object with key-value pairs
        setTranslations(rawTranslations);
      }
    }
  }, [language, rawTranslationsLoading, rawTranslations]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(appActions.closeSnackbar());
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  if (
    loading ||
    userDataError ||
    rawUserLoading ||
    rawTranslationsLoading ||
    dimensionsMaxLoading ||
    dimensionsClassicLoading
  ) {
    return <ThemeProvider theme={theme}>{renderSpinner()}</ThemeProvider>;
  }

  let prices = {};
  if (rawUsers) {
    let currentUserData = _.find(
      rawUsers,
      (rawUser) => rawUser.id === user?.id
    );

    if (isAdmin && selectedUser) {
      const foundUser = _.find(
        rawUsers,
        (rawUser) => rawUser.id === selectedUser
      );
      if (foundUser) {
        currentUserData = foundUser;
      }
    }

    if (currentUserData && dimensionsClassic && dimensionsMax) {
      prices = {
        basePrices: currentUserData?.markup,
        markup: currentUserData.user_markup,
        dimensionsClassic,
        dimensionsMax,
      };
    }
  }

  const renderIndividualPricePage = () => {
    if (isAdmin) {
      return (
        <PrivateRoute authenticated={authenticated} path="/individualPrices">
          <IndividualPrices user={user} />
        </PrivateRoute>
      );
    }
    return null;
  };

  const renderPrices = () => {
    if (isAdmin) {
      return (
        <PrivateRoute authenticated={authenticated} path="/prices">
          <Prices user={user} />
        </PrivateRoute>
      );
    }
    return null;
  };

  const renderUsers = () => {
    if (isAdmin) {
      return (
        <PrivateRoute authenticated={authenticated} path="/users">
          <Users user={user} />
        </PrivateRoute>
      );
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <TranslationsProvider value={translations}>
        <PriceProvider value={prices}>
          <Router>
            <div className={classes.root}>
              {authenticated ? <Navigation user={user} isAdmin={isAdmin} /> : null}
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Switch>
                  <PrivateRoute authenticated={authenticated} path="/settings">
                    <Settings user={user} />
                  </PrivateRoute>

                  {renderUsers()}

                  {renderIndividualPricePage()}

                  {renderPrices()}

                  <PrivateRoute authenticated={authenticated} path="/markup">
                    <Markup user={user} />
                  </PrivateRoute>

                  <PrivateRoute authenticated={authenticated} path="/new">
                    <NewSpecification user={user} isAdmin={isAdmin} />
                  </PrivateRoute>

                  <PrivateRoute authenticated={authenticated} path="/my">
                    <MySpecifications user={user} isAdmin={isAdmin} />
                  </PrivateRoute>

                  <PrivateRoute authenticated={authenticated} path="/specification/:id">
                    <Specification user={user} />
                  </PrivateRoute>

                  <PrivateRoute authenticated={authenticated} path="/drafts">
                    <MyDrafts user={user} />
                  </PrivateRoute>

                  <Route>
                    {authenticated ? (
                      <Redirect
                        to={{
                          pathname: "/new",
                        }}
                      />
                    ) : (
                      <SignIn />
                    )}
                  </Route>
                </Switch>
                <Box>
                  <Copyright />
                </Box>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  open={snackbarOpen}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                  >
                    {snackbarText}
                  </Alert>
                </Snackbar>
              </main>
            </div>
          </Router>
        </PriceProvider>
      </TranslationsProvider>
    </ThemeProvider>
  );
}

export default App;
