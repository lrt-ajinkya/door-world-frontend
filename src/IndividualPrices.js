import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useDispatch } from "react-redux";

import Button from "@material-ui/core/Button";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Autocomplete from "@material-ui/lab/Autocomplete";
import ListboxComponent from "./components/ListBox";

import * as appActions from "./actions/appActions";


import TranslationsContext from "./providers/translation";
import apiService from "./services/apiService";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  priceCell: {
    width: 200,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 64,
    marginBottom: 64,
  },
  tableRow: {
    cursor: "pointer",
  },
  buttons: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  basicHeaderText: {
    color: "#e31e24",
  },
  table: {
    minWidth: 650,
    marginTop: 50,
    "page-break-after": "auto",
  },
  noBorder: {
    border: 0,
  },
}));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
    padding: "4px",
  },
}))(TableRow);

export default function IndividualPrices(user) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const t = useContext(TranslationsContext);

  const [userMarkup, setUserMarkup] = useState({});
  const [updateUserMarkupLoading, setUpdateUserMarkupLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const previousSelections = usePrevious({ selectedUser, selectedCategory });

  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load users and categories in parallel
        const [usersData, categoriesData] = await Promise.all([
          apiService.users.getAll(),
          apiService.products.getCategories()
        ]);
        
        setUsers(usersData.users || usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(appActions.setSnackbarText("Failed to load users and categories"));
        dispatch(appActions.openSnackbar());
      } finally {
        setUsersLoading(false);
        setCategoriesLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  useEffect(() => {
    const userId = selectedUser?.id || selectedUser?.id;
    const previousUserId = previousSelections?.selectedUser?.id || previousSelections?.selectedUser?.id;
    const categoryId = selectedCategory?.id || selectedCategory?.id;
    const previousCategoryId = previousSelections?.selectedCategory?.id || previousSelections?.selectedCategory?.id;
    
    if (
      selectedUser &&
      selectedCategory &&
      previousSelections &&
      userId &&
      categoryId &&
      (userId !== previousUserId || categoryId !== previousCategoryId)
    ) {
      setUserMarkup(selectedUser.markup || {});
      setLoadingCollections(true);
      loadCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedUser]);

  const updateUserMarkups = async () => {
    setUpdateUserMarkupLoading(true);
    try {
      if (selectedUser?.id || selectedUser?.id) {
        const userId = selectedUser.id || selectedUser.id;
        await apiService.users.updateMargins(userId, {
          markup: userMarkup
        });
        
        // Update local state
        const updatedUsers = users.map(user => 
          (user.id === userId || user.id === userId) 
            ? { ...user, markup: userMarkup } 
            : user
        );
        setUsers(updatedUsers);
        setSelectedUser({ ...selectedUser, markup: userMarkup });
        
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(appActions.setSnackbarText("Saved new prices for user"));
        dispatch(appActions.openSnackbar());
      }
    } catch (error) {
      console.error('Failed to update user markups:', error);
      dispatch(appActions.setSnackbarSeverity("error"));
      dispatch(appActions.setSnackbarText("Failed to save prices for user"));
      dispatch(appActions.openSnackbar());
    } finally {
      setUpdateUserMarkupLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      if (selectedCategory?.slug) {
        const productsData = await apiService.products.getProductsByCategory(selectedCategory.slug, language);
        setCollections(productsData);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
      dispatch(appActions.setSnackbarSeverity("error"));
      dispatch(appActions.setSnackbarText("Failed to load product collections"));
      dispatch(appActions.openSnackbar());
      setCollections([]);
    } finally {
      setLoadingCollections(false);
    }
  };

  const getOption = (user) => {
    if (!user || !user.id) {
      return "";
    }
    if (user.displayName) {
      return `${user.email} (${user.displayName})`;
    }
    return user.email;
  };

  const renderUserSelect = () => {
    const sortedUsers = _.orderBy(users, [
      (user) => _.get(user, "email", "").toLowerCase(),
    ]);

    return (
      <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
        <Autocomplete
          value={selectedUser}
          style={{ flex: 1, margin: 8 }}
          id="selected-user"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={sortedUsers}
          getOptionLabel={(user) => getOption(user)}
          onChange={(event, value, reason) => {
            setUserMarkup({});
            setSelectedUser(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label={t["user"]} variant="outlined" />
          )}
          renderOption={(user, index) => {
            return (
              <div
                style={{ height: 56, display: "flex", alignItems: "center" }}
              >
                {getOption(user)}
              </div>
            );
          }}
        />
      </Grid>
    );
  };

  const getCategoryOption = (category) => {
    if (!category) {
      return "";
    }
    if (category[language]) {
      return category[language];
    }
    return "";
  };

  const renderCategorySelect = () => {
    // Remove the adjustable filter since it's not in the API response
    const sortedCategories = _.orderBy(categories, ["order"] || ["id"]);
    return (
      <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
        <Autocomplete
          value={selectedCategory}
          style={{ flex: 1, margin: 8 }}
          id="selected-user"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={sortedCategories}
          getOptionLabel={(category) => getCategoryOption(category)}
          onChange={(event, value, reason) => {
            setUserMarkup({});
            setSelectedCategory(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label={t["category"]} variant="outlined" />
          )}
          renderOption={(category, index) => {
            return (
              <div
                style={{ height: 56, display: "flex", alignItems: "center" }}
              >
                {getCategoryOption(category)}
              </div>
            );
          }}
        />
      </Grid>
    );
  };

  const renderSelectMessage = () => {
    let message = "";
    if (!selectedUser?.id) {
      message = t["select_user"];
    }
    if (!selectedCategory?.id) {
      message = t["select_category"];
    }
    if (!selectedUser?.id && !selectedCategory?.id) {
      message = t["select_user_and_category"];
    }
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            style={{ marginTop: 48, marginBottom: 48, color: "#e31e24" }}
          >
            {message}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderBasicHeader = (text) => {
    return (
      <StyledTableRow style={{ height: 70 }}>
        <TableCell component="th" scope="row" colSpan={3}>
          <Typography className={classes.basicHeaderText} variant="h6">
            {text}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderDimensionsBasicHeader = (text) => {
    return (
      <StyledTableRow style={{ height: 70 }}>
        <TableCell component="th" scope="row" colSpan={12}>
          <Typography className={classes.basicHeaderText} variant="h6">
            {text}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  const setCustomPrice = (collection, evt) => {
    const markupTemp = { ...userMarkup };
    const newMarkup = {
      [selectedCategory.id]: {
        [collection.id]: {
          [evt.id]: {
            price: evt.value,
          },
        },
      },
    };

    _.merge(markupTemp, newMarkup);

    setUserMarkup(markupTemp);
  };

  const setCustomPriceBulletproof = (collection, evt, model) => {
    const markupTemp = { ...userMarkup };
    const newMarkup = {
      [selectedCategory.id]: {
        [collection.id]: {
          [evt.id]: {
            price: {
              [model]: evt.value,
            },
          },
        },
      },
    };

    _.merge(markupTemp, newMarkup);

    setUserMarkup(markupTemp);
  };

  const setCustomDimensionPrice = (collection, width, height, evt) => {
    const markupTemp = { ...userMarkup };
    const newMarkup = {
      [selectedCategory.id]: {
        [collection.id]: {
          [width.id]: {
            heights: [{ id: height.id, price: evt.value }],
          },
        },
      },
    };
    _.merge(markupTemp, newMarkup);
    setUserMarkup(markupTemp);
  };

  const setCustomMillingPrice = (collection, item, milling, evt) => {
    const markupTemp = { ...userMarkup };
    const newMarkup = {
      [selectedCategory.id]: {
        [collection.id]: {
          [item.id]: {
            [milling.name]: {
              price: evt.value,
            },
          },
        },
      },
    };

    _.merge(markupTemp, newMarkup);

    setUserMarkup(markupTemp);
  };

  const renderCustomPrice = (collection, item) => {
    return (
      <TextField
        value={
          userMarkup?.[selectedCategory.id]?.[collection.id]?.[item.id]
            ?.price || item.price
        }
        style={{ width: 140 }}
        id={item.id}
        name="customPrice"
        label={t["price"]}
        variant="outlined"
        type="number"
        onChange={(e) => setCustomPrice(collection, e.target)}
      />
    );
  };

  const renderBulletproofCustomPrice = (collection, item, model) => {
    return (
      <TextField
        value={
          userMarkup?.[selectedCategory.id]?.[collection.id]?.[item.id]
            ?.price?.[model] || item.price[model]
        }
        style={{ width: 140 }}
        id={item.id}
        name="customPriceBulletproof"
        label={t["price"]}
        variant="outlined"
        type="number"
        onChange={(e) => setCustomPriceBulletproof(collection, e.target, model)}
      />
    );
  };

  const renderCustomDimensionsPrice = (collection, width, height) => {
    return (
      <TextField
        value={
          userMarkup?.[selectedCategory.id]?.[collection.id]?.[
            width.id
          ]?.heights?.find((i) => i.id === height.id)?.price || height.price
        }
        style={{ width: 140 }}
        id={`${width.id}${height.id}`}
        name="customDimensionPrice"
        label={t["price"]}
        variant="outlined"
        type="number"
        onChange={(e) =>
          setCustomDimensionPrice(collection, width, height, e.target)
        }
      />
    );
  };

  const renderCustomMillingPrice = (collection, milling, item) => {
    return (
      <TextField
        value={
          userMarkup?.[selectedCategory.id]?.[collection.id]?.[item.id]?.[
            milling.name
          ]?.price || milling.price
        }
        style={{ width: 140 }}
        id={milling.id}
        name="customPrice"
        label={t["price"]}
        variant="outlined"
        type="number"
        onChange={(e) =>
          setCustomMillingPrice(collection, item, milling, e.target)
        }
      />
    );
  };

  const renderTableRow = (collection, item, index) => {
    if (collection.id === "bulletproofModel") {
      return item.fits.map((model) => {
        return (
          <StyledTableRow key={`${item.id}${index}${model}`}>
            <TableCell>
              <b>
                {item.name} {model}
              </b>
            </TableCell>
            <TableCell align="right" className={classes.priceCell}>
              {item.price[model]} EUR
            </TableCell>
            <TableCell
              align="right"
              className={classes.priceCell}
              style={{ paddingRight: 0 }}
            >
              {renderBulletproofCustomPrice(collection, item, model)}
            </TableCell>
          </StyledTableRow>
        );
      });
    }

    return (
      <StyledTableRow key={`${item.id}${index}`}>
        <TableCell>
          <b>{item.name}</b>
        </TableCell>
        <TableCell align="right" className={classes.priceCell}>
          {item.price} EUR
        </TableCell>
        <TableCell
          align="right"
          className={classes.priceCell}
          style={{ paddingRight: 0 }}
        >
          {renderCustomPrice(collection, item)}
        </TableCell>
      </StyledTableRow>
    );
  };

  const rendedrMilling = (collection, milling, item, index) => {
    return (
      <StyledTableRow key={`${item.id}${milling.name}${index}`}>
        <TableCell>
          <b>{milling.name}</b>
        </TableCell>
        <TableCell align="right" className={classes.priceCell}>
          {milling.price} EUR
        </TableCell>
        <TableCell
          align="right"
          className={classes.priceCell}
          style={{ paddingRight: 0 }}
        >
          {renderCustomMillingPrice(collection, milling, item)}
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderMillingRows = (collection, item) => {
    return item.items.map((milling, index) =>
      rendedrMilling(collection, milling, item, index)
    );
  };

  const renderTableHeader = (index) => {
    if (index !== 0) {
      return null;
    }
    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.noBorder}>{t["name_alt"]}</TableCell>
          <TableCell
            className={[classes.noBorder, classes.priceCell]}
            align="right"
          >
            {t["base_price"]}
          </TableCell>
          <TableCell
            className={[classes.noBorder, classes.priceCell]}
            align="right"
          >
            {t["price"]}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const renderMillings = (collection, item, index) => {
    return (
      <TableContainer key={`${collection.id}${index}`}>
        <Table className={classes.table} aria-label="table">
          {renderBasicHeader(`${t["milling"]} ${item.name}`)}
          <TableBody>{renderMillingRows(collection, item, index)}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderDimensionHeader = (collection, index) => {
    if (!collection?.data?.[0]?.heights?.length) {
      return null;
    }
    return (
      <TableHead>
        {renderDimensionsBasicHeader(t[collection.translation])}
        <TableRow>
          <TableCell key={`headerlabel`} className={classes.noBorder}>
            WIDTH/HEIGHT
          </TableCell>
          {_.orderBy(collection?.data?.[0]?.heights, "id").map((item) => {
            return (
              <TableCell
                key={`header${collection.id}${item.id}${index}`}
                className={classes.noBorder}
              >
                {item.id}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  const renderDimension = (collection, item, index) => {
    return (
      <React.Fragment>
        <StyledTableRow key={`${collection.id}${item.id}${index}`}>
          <TableCell>
            <b>{item.id}</b>
          </TableCell>
          {_.orderBy(item.heights, "id").map((height) => {
            return (
              <TableCell>
                {renderCustomDimensionsPrice(collection, item, height)}
              </TableCell>
            );
          })}

          {/* <TableCell align="right" className={classes.priceCell}>
            {item.price} EUR
          </TableCell>
          <TableCell
            align="right"
            className={classes.priceCell}
            style={{ paddingRight: 0 }}
          >
            {renderCustomPrice(collection, item)} */}
          {/* </TableCell> */}
        </StyledTableRow>
      </React.Fragment>
    );
  };

  const renderDimensions = (collection, index) => {
    return (
      <TableContainer key={`${collection.id}${index}`}>
        <Table className={classes.table} aria-label="table">
          {renderDimensionHeader(collection, index)}
          <TableBody>
            {collection.data.map((item, index) => {
              return renderDimension(collection, item, index);
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderTableSection = (collection, index) => {
    if (collection.id === "millings") {
      return collection.data.map((item, index) =>
        renderMillings(collection, item, index)
      );
    }

    if (
      collection.id === "dimensionsMax" ||
      collection.id === "dimensionsClassic"
    ) {
      return renderDimensions(collection);
    }

    return (
      <TableContainer key={`${collection.id}${index}`}>
        <Table className={classes.table} aria-label="table">
          {renderTableHeader(index)}
          <TableBody>
            {renderBasicHeader(t[collection.translation])}
            {collection.data.map((item, index) =>
              renderTableRow(collection, item, index)
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderEmptyCollections = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            style={{ marginTop: 48, marginBottom: 48, color: "#e31e24" }}
          >
            {t["no_price_adjustments"]}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderTable = () => {
    if (loadingCollections) {
      return renderSpinner();
    }
    if (!selectedUser?.id || !selectedCategory?.id) {
      return renderSelectMessage();
    }
    if (!collections.length) {
      return renderEmptyCollections();
    }
    return collections.map((collection, index) =>
      renderTableSection(collection, index)
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          {renderUserSelect()}
          {renderCategorySelect()}
        </Grid>
        {renderTable()}
        {renderButtons()}
      </React.Fragment>
    );
  };

  const renderSmallSpinner = () => {
    return <CircularProgress size={24} color="secondary" />;
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const renderButtons = () => {
    if (!selectedUser?.id || !selectedCategory?.id || !collections?.length) {
      return null;
    }
    return (
      <React.Fragment>
        <div className={classes.buttons}>
          <Button
            disabled={updateUserMarkupLoading}
            variant="contained"
            color="primary"
            onClick={() => setUserMarkup({})}
            className={classes.button}
          >
            {t["reset"]}
          </Button>
          <Button
            disabled={updateUserMarkupLoading}
            variant="contained"
            color="primary"
            onClick={updateUserMarkups}
            className={classes.button}
          >
            {updateUserMarkupLoading ? renderSmallSpinner() : t["save"]}
          </Button>
        </div>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Typography
          variant="h4"
          align="left"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["individual_user_prices"]}
        </Typography>

        {usersLoading || categoriesLoading ? renderSpinner() : renderContent()}
      </main>
    </React.Fragment>
  );
}
