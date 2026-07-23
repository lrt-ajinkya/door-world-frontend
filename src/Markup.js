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


import PriceContext, {
  getBasePrice,
  getBaseMillingPrice,
} from "./providers/price";
import TranslationsContext from "./providers/translation";
import apiService from "./services/apiService";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
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

export default function Markup(props) {
  const p = useContext(PriceContext);
  const classes = useStyles();

  const language = useSelector((state) => state.navigation.language);

  const [updateUserMarkupLoading, setUpdateUserMarkupLoading] = useState(false);
  const [userData, setUserData] = useState({ user_markup: {} });
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const t = useContext(TranslationsContext);

  const [markup, setMarkup] = useState({});
  const [selectedCategory, setSelectedCategory] = useState({});
  const previousSelections = usePrevious({ selectedCategory });

  const [loadingCollections, setLoadingCollections] = useState(false);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data and categories in parallel
        const [userData, categoriesData] = await Promise.all([
          (async () => {
            const currentUser = apiService.getCurrentUser();
            if (currentUser) {
              return await apiService.users.getDetails(currentUser.id);
            }
            return { user_markup: {} };
          })(),
          apiService.products.getCategories()
        ]);
        
        console.log('🔍 [MARKUP] Loaded categories:', categoriesData);
        console.log('🔍 [MARKUP] Loaded user data:', userData);
        
        setUserData(userData);
        setCategories(categoriesData);
        setMarkup(userData.user_markup || {});
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setUserDataLoading(false);
        setCategoriesLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    console.log('🔍 [MARKUP] Category selection changed:', {
      selectedCategory,
      previousSelections: previousSelections?.selectedCategory,
      hasId: selectedCategory?.id,
      changed: selectedCategory?.id !== previousSelections?.selectedCategory?.id
    });
    
    const categoryId = selectedCategory?.id;
    const previousCategoryId = previousSelections?.selectedCategory?.id;
    
    if (
      selectedCategory &&
      previousSelections &&
      categoryId &&
      categoryId !== previousCategoryId
    ) {
      console.log('🔍 [MARKUP] Loading collections for category:', selectedCategory);
      setMarkup(userData.user_markup || {});
      setLoadingCollections(true);
      loadCollections();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const updateUserMarkups = async () => {
    setUpdateUserMarkupLoading(true);
    try {
      const currentUser = apiService.getCurrentUser();
      if (currentUser) {
        await apiService.users.updateMargins(currentUser.id, {
          user_markup: markup
        });
        setUserData({ ...userData, user_markup: markup });
      }
    } catch (error) {
      console.error('Failed to update user markups:', error);
    } finally {
      setUpdateUserMarkupLoading(false);
    }
  };

  const loadCollections = async () => {
    console.log('🔍 [MARKUP] loadCollections called for category:', {
      selectedCategory,
      slug: selectedCategory?.slug,
      language
    });
    
    try {
      if (selectedCategory?.slug) {
        console.log('🔍 [MARKUP] Fetching products for category slug:', selectedCategory.slug);
        const productsData = await apiService.products.getProductsByCategory(selectedCategory.slug, language);
        console.log('🔍 [MARKUP] Products loaded:', productsData);
        setCollections(productsData);
      } else {
        console.log('🔍 [MARKUP] No category slug, clearing collections');
        setCollections([]);
      }
    } catch (error) {
      console.error('❌ [MARKUP] Failed to load collections:', error);
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
    // All categories from the API should be selectable
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
            console.log('🔍 [MARKUP] Category selected:', { value, reason });
            setMarkup(userData.user_markup || {});
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
        <TableCell component="th" scope="row" colSpan={4}>
          <Typography className={classes.basicHeaderText} variant="h6">
            {text}
          </Typography>
        </TableCell>
      </StyledTableRow>
    );
  };

  const setCustomPrice = (collection, evt) => {
    const markupTemp = { ...markup };
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

    setMarkup(markupTemp);
  };

  const getCustomPrice = (collection, item) => {
    const price =
      markup?.[selectedCategory.id]?.[collection.id]?.[item.id]?.price || 0;
    return Number(price);
  };

  const getCustomMillingPrice = (collection, item, milling) => {
    const price =
      markup?.[selectedCategory.id]?.[collection.id]?.[item.id]?.[
        milling.name
      ]?.price || 0;
    return Number(price);
  };

  const renderCustomPrice = (collection, item) => {
    return (
      <TextField
        value={getCustomPrice(collection, item)}
        style={{ width: 100 }}
        id={item.id}
        name="customPrice"
        label={t["markup"]}
        variant="outlined"
        type="number"
        onChange={(e) => setCustomPrice(collection, e.target)}
      />
    );
  };

  const renderTableRow = (collection, item, index) => {
    const basePrice = getBasePrice(
      selectedCategory.id,
      collection.id,
      item,
      p
    );
    return (
      <StyledTableRow key={`${item.id}${index}`}>
        <TableCell>
          <b>{item[language]}</b>
        </TableCell>
        <TableCell align="right">
          {renderCustomPrice(collection, item)}
        </TableCell>
        <TableCell align="right">{basePrice} EUR</TableCell>
        <TableCell align="right">
          <b>{basePrice + getCustomPrice(collection, item)} EUR</b>
        </TableCell>
      </StyledTableRow>
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
            {t["markup"]}
          </TableCell>
          <TableCell className={classes.noBorder} align="right">
            {t["base_price"]}
          </TableCell>
          <TableCell className={classes.noBorder} align="right">
            {t["total_price"]}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const setCustomMillingPrice = (collection, item, milling, evt) => {
    const markupTemp = { ...markup };
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
    setMarkup(markupTemp);
  };

  const renderCustomMillingPrice = (collection, milling, item) => {
    return (
      <TextField
        value={getCustomMillingPrice(collection, item, milling)}
        style={{ width: 100 }}
        id={milling.name}
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

  const rendedrMilling = (collection, milling, item, index) => {
    const basePrice = getBaseMillingPrice(
      selectedCategory.id,
      collection.id,
      item.id,
      milling,
      p
    );
    return (
      <StyledTableRow key={`${item.id}${milling.name}${index}`}>
        <TableCell>
          <b>{milling.name}</b>
        </TableCell>
        <TableCell align="right">
          {renderCustomMillingPrice(collection, milling, item)}
        </TableCell>
        <TableCell align="right">{basePrice} EUR</TableCell>
        <TableCell align="right">
          <b>
            {basePrice + getCustomMillingPrice(collection, item, milling)} EUR
          </b>
        </TableCell>
      </StyledTableRow>
    );
  };

  const renderMillingRows = (collection, item) => {
    return item.items.map((milling, index) =>
      rendedrMilling(collection, milling, item, index)
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
              renderTableRow(selectedCategory, item, index)
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
    if (!selectedCategory?.id || !collections.length) {
      return null;
    }
    return (
      <React.Fragment>
        <div className={classes.buttons}>
          <Button
            disabled={updateUserMarkupLoading}
            variant="contained"
            color="primary"
            onClick={() => setMarkup(userData.user_markup || {})}
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
          {t["markup"]}
        </Typography>

        {userDataLoading || categoriesLoading
          ? renderSpinner()
          : renderContent()}
      </main>
    </React.Fragment>
  );
}
