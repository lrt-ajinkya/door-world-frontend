import React, { useState, useEffect, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import finishingService from "./services/finishingService";
import doorComponentsService from "./services/doorComponentsService";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import * as newSpecActions from "./actions/newSpecificationActions";
import NewSpecButtons from "./components/NewSpecButtons";
import TotalPrice from "./components/TotalPrice";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ral from "./common/ral";
import hex from "ral-to-hex";

import ListboxComponent from "./components/ListBox";

import PriceContext, { getPrice, getMillingPrice } from "./providers/price";
import TranslationsContext from "./providers/translation";
import { getImageUrl } from "./utils/imageUtils";

const useStyles = makeStyles((theme) => ({
  selectCustom: {
    padding: "11px 0px 10px 0px",
  },
  customSelect: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    flex: 1,
  },
  formControlPrice: {
    margin: theme.spacing(1),
    minWidth: 60,
    maxWidth: 120,
    flex: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
}));

const MILLING_NONE = {
  name: "None",
  en: "None",
  lt: "Nėra",
  price: "0",
  image: "",
};

export default function Finishings(props) {
  const classes = useStyles();

  const finishings = useSelector((state) => state.newSpec.finishings);
  const doorType = useSelector((state) => state.newSpec.doorType);
  const selectedDoorTypePrices = useSelector(
    (state) => state.newSpec.doorTypePrices
  );
  const finishingNote = useSelector((state) => state.newSpec.finishingNote);
  const language = useSelector((state) => state.navigation.language);


  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const dispatch = useDispatch();

  const [allFinishings, setAllFinishings] = useState([]);
  const [millings, setMillings] = useState([]);
  const [carvings, setCarvings] = useState([]);
  const [doorTypePrices, setDoorTypePrices] = useState([]);
  const [standardColors, setStandardColors] = useState([]);
  const [pvcColors, setPvcColors] = useState([]);
  const [stainedColors, setStainedColors] = useState([]);
  const [allFinishingsLoading, setAllFinishingsLoading] = useState(true);
  const [millingsLoading, setMillingsLoading] = useState(true);
  const [carvingsLoading, setCarvingsLoading] = useState(true);
  const [doorTypePricesLoading, setDoorTypePricesLoading] = useState(true);
  const [standardColorsLoading, setStandardColorsLoading] = useState(true);
  const [pvcColorsLoading, setPvcColorsLoading] = useState(true);
  const [stainedColorsLoading, setStainedColorsLoading] = useState(true);

  useEffect(() => {
    const loadAllFinishings = async () => {
      try {
        setAllFinishingsLoading(true);
        const data = await finishingService.getFinishings();
        setAllFinishings(data);
      } catch (error) {
        console.error('Failed to load finishings:', error);
      } finally {
        setAllFinishingsLoading(false);
      }
    };
    loadAllFinishings();
  }, []);

  useEffect(() => {
    const loadMillings = async () => {
      try {
        setMillingsLoading(true);
        const data = await finishingService.getMillings();
        setMillings(data);
      } catch (error) {
        console.error('Failed to load millings:', error);
      } finally {
        setMillingsLoading(false);
      }
    };
    loadMillings();
  }, []);


  useEffect(() => {
    const loadCarvings = async () => {
      try {
        setCarvingsLoading(true);
        const data = await finishingService.getCarvings();
        setCarvings(data);
      } catch (error) {
        console.error('Failed to load carvings:', error);
      } finally {
        setCarvingsLoading(false);
      }
    };
    loadCarvings();
  }, []);

  useEffect(() => {
    const loadDoorTypePrices = async () => {
      try {
        setDoorTypePricesLoading(true);
        const data = await doorComponentsService.getDoorTypePrices();
        setDoorTypePrices(data);
      } catch (error) {
        console.error('Failed to load door type prices:', error);
      } finally {
        setDoorTypePricesLoading(false);
      }
    };
    loadDoorTypePrices();
  }, []);

  useEffect(() => {
    const loadStandardColors = async () => {
      try {
        setStandardColorsLoading(true);
        const data = await doorComponentsService.getStandardMetalColors();
        setStandardColors(data);
      } catch (error) {
        console.error('Failed to load standard colors:', error);
      } finally {
        setStandardColorsLoading(false);
      }
    };
    loadStandardColors();
  }, []);

  useEffect(() => {
    const loadPvcColors = async () => {
      try {
        setPvcColorsLoading(true);
        const data = await doorComponentsService.getPvcColors();
        setPvcColors(data);
      } catch (error) {
        console.error('Failed to load PVC colors:', error);
      } finally {
        setPvcColorsLoading(false);
      }
    };
    loadPvcColors();
  }, []);

  useEffect(() => {
    const loadStainedColors = async () => {
      try {
        setStainedColorsLoading(true);
        const data = await doorComponentsService.getStainedColors();
        setStainedColors(data);
      } catch (error) {
        console.error('Failed to load stained colors:', error);
      } finally {
        setStainedColorsLoading(false);
      }
    };
    loadStainedColors();
  }, []);

  useEffect(() => {
    if (
      !allFinishingsLoading &&
      !millingsLoading &&
      !carvingsLoading &&
      !doorTypePricesLoading &&
      !standardColorsLoading &&
      !pvcColorsLoading &&
      !stainedColorsLoading
    ) {
      if (finishings.length === 0) {
        const sortedFinishings = _.sortBy(
          allFinishings,
          (finishing) => finishing.order
        );
        const sortedPVCColors = _.sortBy(pvcColors, (color) => color.name);
        const defaultCarving = _.find(
          carvings,
          (carving) => carving.default === true
        );

        const initialFinishings = [
          "hPoJm4Y9ZSDDTavB08qE",
          ...doorType.prices,
        ].map((price, index) => {
          const item = _.find(doorTypePrices, (item) => item.id === price);

          return {
            index,
            name: item?.[language],
            doorTypePrice: item,
            color: sortedPVCColors[0],
            ...sortedFinishings[0],
            carving: defaultCarving,
          };
        });

        dispatch(
          newSpecActions.setFinishings({
            internal: initialFinishings,
            external: initialFinishings,
          })
        );
        dispatch(newSpecActions.setCompletedStep(5));
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allFinishingsLoading,
    millingsLoading,
    carvingsLoading,
    doorTypePricesLoading,
    standardColorsLoading,
    pvcColorsLoading,
    stainedColorsLoading,
  ]);

  const setFinishing = (price, index, id, internal) => {
    let finishing = _.find(allFinishings, (finishing) => id === finishing.id);
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];
    const colors = _.get(finishing, "colors", false);
    const defaultCarving = _.find(
      carvings,
      (carving) => carving.default === true
    );
    let color = "";

    if (colors === "ral") {
      color = ral[0];
    }

    if (colors === "pvc") {
      color = pvcColors[0];
    }

    if (colors === "ral_all") {
      color = ral[0];
    }

    if (colors === "ral_and_stained") {
      color = ral[0];
    }

    tempFinishings[index] = {
      index,
      name: price.name,
      doorTypePrice: price,
      color,
      carving: defaultCarving,
      ...finishing,
    };
    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setMilling = (milling, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    tempFinishings[index] = { index, ...finishing, milling };
    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setCarving = (id, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    const carving = _.find(carvings, (item) => item.id === id);

    tempFinishings[index] = {
      index,
      ...finishing,
      carving,
      glassType: [],
      glass: [],
      glassFilm: [],
      glassAddon: [],
    };

    if (internal) {
      dispatch(newSpecActions.resetSteps([11, 12]));
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
      dispatch(newSpecActions.setGlass([]));
    } else {
      dispatch(newSpecActions.resetSteps([11, 12]));
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
      dispatch(newSpecActions.setGlass([]));
    }
  };

  const setRALColor = (id, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    const color = _.find(standardColors, (item) => item.id === id);
    tempFinishings[index] = { index, ...finishing, color };
    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setCustomColor = (value, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    finishing.customColor = value;
    tempFinishings[index] = { index, ...finishing };

    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setCustomColorPrice = (value, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    finishing.customColorPrice = value;
    tempFinishings[index] = { index, ...finishing };

    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setRalAndStainedColor = (index, internal, value) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let filtered = _.filter(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index !== index
    );

    const color = value;

    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: [{ index, ...finishing, color }, ...filtered],
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: [{ index, ...finishing, color }, ...filtered],
        })
      );
    }
  };

  const setPVCColor = (id, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    const color = _.find(pvcColors, (item) => item.id === id);
    tempFinishings[index] = { index, ...finishing, color };
    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const setRadioValue = (customColorRadio, index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    tempFinishings[index] = {
      index,
      ...finishing,
      customColorRadio: customColorRadio === "true",
      customColorPrice: "0",
      customColor: "",
    };
    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const renderSelectedMilling = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!finishing?.milling?.image) return null;

    return <img alt="Milling" src={getImageUrl(finishing.milling.image)} height="70px" width="auto" />;
  };

  const renderSelectedPVC = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "color.image", false)) return null;

    return <img alt="PVC" src={getImageUrl(finishing.color.image)} height="40px" width="auto" />;
  };

  const renderSelectedAllRalAndStained = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "color", false)) return null;

    if (finishing.color.image) {
      return <img alt="Stained" src={getImageUrl(finishing.color.image)} height="40px" width="auto" />;
    }

    if (finishing.color.HEX) {
      return (
        <span
          style={{
            marginLeft: 8,
            width: 20,
            height: 20,
            background: finishing.color.HEX,
          }}
        />
      );
    }

    return null;
  };

  const renderSelectedCarving = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (
      !_.get(finishing, "carvings", false) ||
      !_.get(finishing, "carving.image", false)
    )
      return null;

    return <img alt="Carving" src={getImageUrl(finishing.carving.image)} height="80px" width="auto" />;
  };

  const renderCarving = (index, internal) => {
    const finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    if (!_.get(finishing, "carvings", false)) return null;
    const sortedCarvings = _.orderBy(
      _.sortBy(carvings, (carving) => Number(carving.name.substring(1))),
      ["order"]
    );
    const defaultCarving = _.find(
      carvings,
      (carving) => carving.default === true
    );

    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Autocomplete
          value={_.get(finishing, "carving", null) || defaultCarving}
          style={{ flex: 1, margin: 8 }}
          id="virtualize-demo"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={sortedCarvings}
          getOptionLabel={(option) => `${option?.[language] || option.name}`}
          onChange={(event, value, reason) => {
            const val = value && value.id ? value.id : defaultCarving;
            setCarving(val, index, internal);
          }}
          renderInput={(params) => (
            <TextField {...params} label={t["carving"]} variant="outlined" />
          )}
          renderOption={(carving, index) => {
            return (
              <div
                style={{ height: 56, display: "flex", alignItems: "center" }}
              >
                {carving?.[language] || carving.name}
                {carving.image ? (
                  <img
                    alt="Carving"
                    src={getImageUrl(carving.image)}
                    style={{ marginLeft: 16 }}
                    width="auto"
                    height="40px"
                  />
                ) : null}
              </div>
            );
          }}
        />
        {renderSelectedCarving(index, internal)}
      </Grid>
    );
  };

  const getFinishingPrice = (item, finishing) => {
    const price = getPrice("finishing", "finishings", finishing, p);
    const doorTypePrice = _.find(
      selectedDoorTypePrices,
      (price) => price.id === item.id
    );

    if (
      price &&
      doorTypePrice &&
      (doorTypePrice.type === "percentage_size" ||
        doorTypePrice.type === "fixed")
    ) {
      if (doorTypePrice.dimensions >= 500) {
        return Number(price);
      }

      if (doorTypePrice.position === "top" && doorType.double) {
        return Number(price * 2);
      }

      return Number(price / 2);
    }

    return Number(price);
  };

  const renderMilling = (index, internal) => {
    const finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );
    if (!finishing) {
      return null;
    }

    const millingOptions = _.find(
      millings,
      (milling) => milling.id === finishing.millings
    )?.items;

    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="select-milling-label">{t["milling"]}</InputLabel>
          <Select
            classes={{ root: classes.selectCustom }}
            labelId="select-milling-label"
            id="select-milling"
            value={getMillingValue(index, internal)}
            onChange={(evt) => setMilling(evt.target.value, index, internal)}
            renderValue={(value) => (
              <MenuItem>
                {value?.[language]}{" "}
                {getMillingPrice(
                  "finishing",
                  "millings",
                  finishing.millings,
                  value,
                  p
                )}{" "}
                EUR
              </MenuItem>
            )}
          >
            {[MILLING_NONE, ...millingOptions].map((milling) => {
              return (
                <Tooltip
                  key={`${milling.name}${index}`}
                  placement="right"
                  value={milling}
                  title={
                    <React.Fragment>
                      <img
                        alt="Milling"
                        src={getImageUrl(milling.image)}
                        height="auto"
                        width="280px"
                      />
                    </React.Fragment>
                  }
                >
                  <MenuItem>
                    {milling?.[language]}{" "}
                    {getMillingPrice(
                      "finishing",
                      "millings",
                      finishing.millings,
                      milling,
                      p
                    )}{" "}
                    EUR
                  </MenuItem>
                </Tooltip>
              );
            })}
          </Select>
        </FormControl>
        {renderSelectedMilling(index, internal)}
      </Grid>
    );
  };

  const getMillingValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );

    if (!_.get(finishing, "milling", false)) {
      setMilling(MILLING_NONE, index, internal);
      return MILLING_NONE;
    }

    return finishing.milling;
  };

  const getFinishingValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!finishing) {
      const sortedFinishings = _.sortBy(
        allFinishings,
        (finishing) => finishing.order
      );

      if (!sortedFinishings?.length) {
        return null
      }
      return sortedFinishings[0].id;
    }
    return finishing.id;
  };

  const getCustomColorValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "customColor", false)) {
      return "";
    }
    return finishing.customColor;
  };

  const getCustomColorPriceValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "customColorPrice", false)) {
      return "";
    }
    return finishing.customColorPrice;
  };

  const getRalValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "color", false)) {
      const sortedColors = _.sortBy(standardColors, (color) => color.ral);
      return sortedColors[0].id;
    }
    return finishing.color.id;
  };

  const getIsRadioChecked = (index, internal, value) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "customColorRadio", false)) {
      return false === value;
    }
    return finishing.customColorRadio === value;
  };

  const getPVCValue = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    if (!_.get(finishing, "color", false)) {
      const sortedColors = _.sortBy(pvcColors, (color) => color.name);
      return sortedColors[0].id;
    }
    return finishing.color.id;
  };

  const renderCustomColor = (index, internal) => {
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Radio
          checked={getIsRadioChecked(index, internal, true)}
          value={true}
          color="primary"
          onChange={(event) =>
            setRadioValue(event.target.value, index, internal)
          }
        />
        <FormControl className={classes.formControl} variant="outlined">
          <TextField
            onClick={(e) => e.stopPropagation()}
            disabled={getIsRadioChecked(index, internal, false)}
            value={getCustomColorValue(index, internal)}
            id="customColor"
            name="customColor"
            label={t["custom_color"]}
            variant="outlined"
            onChange={(e) => setCustomColor(e.target.value, index, internal)}
          />
        </FormControl>

        <FormControl className={classes.formControlPrice} variant="outlined">
          <TextField
            onClick={(e) => e.stopPropagation()}
            disabled={getIsRadioChecked(index, internal, false)}
            value={getCustomColorPriceValue(index, internal)}
            id="customColorPrice"
            name="customColorPrice"
            label={t["custom_price"]}
            variant="outlined"
            onChange={(e) =>
              setCustomColorPrice(e.target.value, index, internal)
            }
          />
        </FormControl>
      </Grid>
    );
  };

  const renderRAL = (index, internal) => {
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Radio
          checked={getIsRadioChecked(index, internal, false)}
          value={false}
          color="primary"
          onChange={(event) =>
            setRadioValue(event.target.value, index, internal)
          }
        />
        <FormControl variant="outlined">
          <InputLabel id="select-milling-label">{t["color"]}</InputLabel>
          <Select
            disabled={getIsRadioChecked(index, internal, true)}
            classes={{ root: classes.customSelect }}
            labelId="select-color-label"
            id="select-color"
            value={getRalValue(index, internal)}
            onChange={(evt) => setRALColor(evt.target.value, index, internal)}
          >
            {standardColors &&
              _.sortBy(standardColors, (color) => color.ral).map((color) => {
                let hexVal = "";

                try {
                  hexVal = hex(color.ral);
                } catch (e) {
                  hexVal = "#ffffff";
                }
                return (
                  <MenuItem value={color.id}>
                    {color.name}{" "}
                    <div
                      style={{
                        marginLeft: 8,
                        width: 20,
                        height: 20,
                        background: hexVal,
                      }}
                    />
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  const renderPVC = (index, internal) => {
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Radio
          checked={getIsRadioChecked(index, internal, false)}
          value={false}
          color="primary"
          onChange={(event) =>
            setRadioValue(event.target.value, index, internal)
          }
        />
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="select-pvc-label">{t["color"]}</InputLabel>
          <Select
            disabled={getIsRadioChecked(index, internal, true)}
            classes={{ root: classes.selectCustom }}
            labelId="select-pvc-label"
            id="select-pvc"
            value={getPVCValue(index, internal)}
            onChange={(evt) => setPVCColor(evt.target.value, index, internal)}
          >
            {_.sortBy(pvcColors, (color) => color.name).map((color) => {
              return (
                <Tooltip
                  key={`${color.id}${index}`}
                  placement="right"
                  value={color.id}
                  title={
                    <React.Fragment>
                      <img
                        alt="PVC"
                        src={getImageUrl(color.image)}
                        height="auto"
                        width="280px"
                      />
                    </React.Fragment>
                  }
                >
                  <MenuItem>{color.name}</MenuItem>
                </Tooltip>
              );
            })}
          </Select>
        </FormControl>
        {renderSelectedPVC(index, internal)}
      </Grid>
    );
  };

  const setAllRal = (index, internal, value) => {
    console.log(index, internal, value);
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (item) => item.index === index
    );

    let tempFinishings = internal
      ? [...finishings.internal]
      : [...finishings.external];

    const color = value;
    tempFinishings[index] = { index, ...finishing, color };

    if (internal) {
      dispatch(
        newSpecActions.setFinishings({
          internal: tempFinishings,
          external: finishings.external,
        })
      );
    } else {
      dispatch(
        newSpecActions.setFinishings({
          internal: finishings.internal,
          external: tempFinishings,
        })
      );
    }
  };

  const renderSelectedAllRAL = (index, internal) => {
    let finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );

    if (!_.get(finishing, "color", false)) return null;

    return (
      <span
        style={{
          marginLeft: 8,
          width: 20,
          height: 20,
          background: finishing.color.HEX,
        }}
      />
    );
  };

  const renderAllRAL = (index, internal) => {
    const color = internal
      ? finishings.internal?.[index]?.color
      : finishings.external?.[index]?.color;
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Radio
          checked={getIsRadioChecked(index, internal, false)}
          value={false}
          color="primary"
          onChange={(event) =>
            setRadioValue(event.target.value, index, internal)
          }
        />
        <Autocomplete
          value={color}
          disabled={getIsRadioChecked(index, internal, true)}
          style={{ flex: 1, margin: 8 }}
          id="combo-box-ral"
          options={ral}
          getOptionLabel={(option) => `${option.English} ${option.RAL}`}
          onChange={(event, value, reason) => setAllRal(index, internal, value)}
          renderOption={(option) => (
            <React.Fragment>
              {option.English} {option.RAL}
              <span
                style={{
                  marginLeft: 8,
                  width: 20,
                  height: 20,
                  background: option.HEX,
                }}
              />
            </React.Fragment>
          )}
          // style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="RAL" variant="outlined" />
          )}
        />
        {renderSelectedAllRAL(index, internal)}
      </Grid>
    );
  };

  const renderRalAndStained = (index, internal) => {
    const color = internal
      ? finishings.internal?.[index]?.color
      : finishings.external?.[index]?.color;
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <Radio
          checked={getIsRadioChecked(index, internal, false)}
          value={false}
          color="primary"
          onChange={(event) =>
            setRadioValue(event.target.value, index, internal)
          }
        />
        <Autocomplete
          value={color}
          disabled={getIsRadioChecked(index, internal, true)}
          style={{ flex: 1, margin: 8 }}
          id="combo-box-ral-stained"
          options={[...stainedColors, ...ral]}
          getOptionLabel={(option) => {
            if (!option.English) {
              return option.name;
            }
            return `${option.English} ${option.RAL}`;
          }}
          onChange={(event, value, reason) =>
            setRalAndStainedColor(index, internal, value)
          }
          renderOption={(option) => {
            if (!option.English) {
              return (
                <React.Fragment>
                  {option.name}
                  {option.image ? (
                    <img
                      alt="Stained"
                      src={getImageUrl(option.image)}
                      style={{ marginLeft: 8 }}
                      height="20px"
                      width="20px"
                    />
                  ) : null}
                </React.Fragment>
              );
            }
            return (
              <React.Fragment>
                {option.English} {option.RAL}
                <span
                  style={{
                    marginLeft: 8,
                    width: 20,
                    height: 20,
                    background: option.HEX,
                  }}
                />
              </React.Fragment>
            );
          }}
          // style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Stained and RAL" variant="outlined" />
          )}
        />
        {renderSelectedAllRalAndStained(index, internal)}
      </Grid>
    );
  };

  const renderColorSelect = (index, internal) => {
    const finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    const colors = _.get(finishing, "colors", false);

    if (!colors) return null;

    if (colors === "ral") {
      return renderRAL(index, internal);
    }

    if (colors === "pvc") {
      return renderPVC(index, internal);
    }

    if (colors === "ral_all") {
      return renderAllRAL(index, internal);
    }

    if (colors === "ral_and_stained") {
      return renderRalAndStained(index, internal);
    }
  };

  const renderCustomColorSelect = (index, internal) => {
    const finishing = _.find(
      internal ? finishings.internal : finishings.external,
      (finishing) => finishing.index === index
    );
    const colors = _.get(finishing, "colors", false);

    if (!colors) return null;

    return renderCustomColor(index, internal);
  };

  const isDisabled = () => {
    if (
      _.get(finishings, "internal.length", 0) > 0 &&
      _.get(finishings, "external.length", 0) > 0
    ) {
      if (
        finishings.internal.every((finishing) => finishing.color) &&
        finishings.external.every((finishing) => finishing.color)
      ) {
        return false;
      }
    }

    return true;
  };

  const renderFinishing = (item, index, internal) => {
    const sortedFinishings = _.sortBy(
      allFinishings,
      (finishing) => finishing.order
    );
    return (
      <Grid item xs={12} style={{ display: "flex", alignItems: "center" }}>
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="select-finishing-label">{t["finishing"]}</InputLabel>
          <Select
            classes={{ root: classes.selectCustom }}
            labelId="select-finishing-label"
            id="select-finishing"
            value={getFinishingValue(index, internal)}
            onChange={(evt) =>
              setFinishing(item, index, evt.target.value, internal)
            }
          >
            {sortedFinishings.map((finishing, index) => (
              <Tooltip
                key={`${finishing.id}${index}`}
                title=""
                placement="right"
                value={finishing.id}
              >
                <MenuItem value={finishing.id}>
                  {finishing?.[language]}{" "}
                  {getFinishingPrice(item, finishing, internal)} EUR
                </MenuItem>
              </Tooltip>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  };

  const renderItem = (item, index, internal) => {
    return (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
        <Grid container spacing={3} key={index}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {item?.[language]}
            </Typography>
          </Grid>

          {renderFinishing(item, index, internal)}
          {renderColorSelect(index, internal)}
          {renderCustomColorSelect(index, internal)}
          {renderCarving(index, internal)}
          {renderMilling(index, internal, item)}
        </Grid>
      </Grid>
    );
  };

  const renderAdditionalNote = () => {
    return (
      <React.Fragment>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#e31e24", marginTop: 48 }}
        >
          {t["note"]}
        </Typography>

        <TableContainer>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow key="note">
                <TableCell component="th" scope="row">
                  <TextField
                    onClick={(e) => e.stopPropagation()}
                    value={finishingNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setFinishingNote(
                          e.target.value,
                          finishingNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={finishingNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label={t["custom_price"]}
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setFinishingNote(
                          finishingNote?.note || "",
                          e.target.value
                        )
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["external"]}
            </Typography>
          </Grid>

          {doorTypePrices && doorTypePrices.length &&
            ["hPoJm4Y9ZSDDTavB08qE", ...doorType.prices].map((price, index) => {
              const item = _.find(doorTypePrices, (item) => item.id === price);
              if (item?.hasExternal) {
                return renderItem(item, index, false);
              }
              return null;
            })}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["internal"]}
            </Typography>
          </Grid>

          {doorTypePrices &&
            ["hPoJm4Y9ZSDDTavB08qE", ...doorType.prices].map((price, index) => {
              const item = _.find(doorTypePrices, (item) => item.id === price);
              if (item?.hasInternal) {
                return renderItem(item, index, true);
              }
              return null;
            })}
        </Grid>

        {renderAdditionalNote()}

        <TotalPrice />
        <NewSpecButtons
          users={props.users}
          isAdmin={props.isAdmin}
          disabled={isDisabled()}
        />
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {!allFinishings ||
      !millings ||
      !carvings ||
      !doorTypePrices ||
      !standardColors ||
      !pvcColors ||
      !stainedColors
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
