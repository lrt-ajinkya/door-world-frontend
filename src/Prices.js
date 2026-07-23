import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Autocomplete from "@material-ui/lab/Autocomplete";
import ListboxComponent from "./components/ListBox";

import { useDispatch } from "react-redux";

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

export default function Prices(user) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const t = useContext(TranslationsContext);

  const [newPrices, setNewPrices] = useState({});
  const [updateNewPricesLoading, setUpdateNewPricesLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState({});
  const previousSelections = usePrevious({ selectedCategory });

  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await apiService.products.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(appActions.setSnackbarText("Failed to load categories"));
        dispatch(appActions.openSnackbar());
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [dispatch]);

  useEffect(() => {
    const categoryId = selectedCategory?.id || selectedCategory?.id;
    const previousCategoryId = previousSelections?.selectedCategory?.id || previousSelections?.selectedCategory?.id;
    
    if (
      selectedCategory &&
      previousSelections &&
      categoryId &&
      categoryId !== previousCategoryId
    ) {
      setLoadingCollections(true);
      loadCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const updateDoorModelPrices = async () => {
    setUpdateNewPricesLoading(true);
    try {
      // Update door model prices via API
      const currentUser = apiService.getCurrentUser();
      if (currentUser && newPrices.model?.door_types) {
        await apiService.users.updateMargins(currentUser.id, {
          door_model_prices: newPrices.model.door_types
        });
        
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(appActions.setSnackbarText("Successfully updated prices for door models"));
        dispatch(appActions.openSnackbar());
        
        setLoadingCollections(true);
        loadCollections();
      }
    } catch (error) {
      console.error('Failed to update door model prices:', error);
      dispatch(appActions.setSnackbarSeverity("error"));
      dispatch(appActions.setSnackbarText("Failed to update door model prices"));
      dispatch(appActions.openSnackbar());
    } finally {
      setUpdateNewPricesLoading(false);
    }
  };


  const updatePrices = async () => {
    setUpdateNewPricesLoading(true);
    try {
      const currentUser = apiService.getCurrentUser();
      if (currentUser) {
        await apiService.users.updateMargins(currentUser.id, {
          category_prices: newPrices
        });
        
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(appActions.setSnackbarText("Successfully updated prices"));
        dispatch(appActions.openSnackbar());
      }
    } catch (error) {
      console.error('Failed to update prices:', error);
      dispatch(appActions.setSnackbarSeverity("error"));
      dispatch(appActions.setSnackbarText("Failed to update prices"));
      dispatch(appActions.openSnackbar());
    } finally {
      setUpdateNewPricesLoading(false);
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
          id="selected-cat"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={sortedCategories}
          getOptionLabel={(category) => getCategoryOption(category)}
          onChange={(event, value, reason) => {
            setNewPrices({});
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

    if (!selectedCategory?.id) {
      message = t["select_category"];
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

  const setCustomPrice = (collection, evt) => {
    let newPricesCopy = { ...newPrices };
    let newPricesTemp = {
      [selectedCategory.id]: {
        [collection.id]: {
          [evt.id]: {
            price: evt.value,
          },
        },
      },
    };

    _.merge(newPricesCopy, newPricesTemp);

    setNewPrices(newPricesCopy);
  };

  const setCustomMillingPrice = (collection, item, milling, evt) => {
    let newPricesCopy = { ...newPrices };
    let newPricesTemp = {
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

    _.merge(newPricesCopy, newPricesTemp);

    setNewPrices(newPricesCopy);
  };

  const renderCustomPrice = (collection, item) => {
    return (
      <TextField
        value={
          newPrices?.[selectedCategory.id]?.[collection.id]?.[item.id]
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

  const renderCustomMillingPrice = (collection, milling, item) => {
    return (
      <TextField
        value={
          newPrices?.[selectedCategory.id]?.[collection.id]?.[item.id]?.[
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
          <TableCell className={classes.noBorder} align="right">
            {t["current_price"]}
          </TableCell>
          <TableCell className={classes.noBorder} align="right">
            {t["new_price"]}
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

  const renderTableSection = (collection, index) => {
    if (collection.id === "millings") {
      return collection.data.map((item, index) =>
        renderMillings(collection, item, index)
      );
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
    if (!selectedCategory?.id) {
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
    if (!selectedCategory?.id || !collections?.length) {
      return null;
    }
    return (
      <React.Fragment>
        <div className={classes.buttons}>
          <Button
            disabled={updateNewPricesLoading}
            variant="contained"
            color="primary"
            onClick={() => setNewPrices({})}
            className={classes.button}
          >
            {t["reset"]}
          </Button>
          <Button
            disabled={updateNewPricesLoading}
            variant="contained"
            color="primary"
            onClick={updatePrices}
            className={classes.button}
          >
            {updateNewPricesLoading ? renderSmallSpinner() : t["save"]}
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
          {t["prices"]}
        </Typography>

        {categoriesLoading ? renderSpinner() : renderContent()}
      </main>
    </React.Fragment>
  );
}
