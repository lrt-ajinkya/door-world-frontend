import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import doorComponentsService from "./services/doorComponentsService";
import { useDispatch } from "react-redux";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";
import hex from "ral-to-hex";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import TotalPrice from "./components/TotalPrice";
import NewSpecButtons from "./components/NewSpecButtons";
import TranslationsContext from "./providers/translation";

const RADIO_VAL_STANDARD = "STANDARD";
const RADIO_VAL_NON_STANDARD = "NON_STANDARD";
const NON_STANDARD_PRICE = 0;

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  selectCustom: {
    display: "flex",
  },
}));

export default function DoorColor(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const t = useContext(TranslationsContext);
  const doorColor = useSelector((state) => state.newSpec.doorColor);
  const colorNote = useSelector((state) => state.newSpec.colorNote);

  const [colorRadioValue, setColorRadioValue] = useState(RADIO_VAL_STANDARD);
  const [colorIsValid, setColorIsValid] = useState(false);
  const [standardColors, setStandardColors] = useState([]);
  const [standardColorsLoading, setStandardColorsLoading] = useState(true);

  useEffect(() => {
    const loadStandardColors = async () => {
      try {
        setStandardColorsLoading(true);
        const data = await doorComponentsService.getDoorColors('standard_metal');
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
    if (!standardColorsLoading) {
      if (doorColor && doorColor.type === RADIO_VAL_NON_STANDARD) {
        setColorRadioValue(RADIO_VAL_NON_STANDARD);
      }

      if (!doorColor) {
        dispatch(
          newSpecActions.setDoorColor({
            ..._.orderBy(standardColors, ["order", "ral"])[0],
            type: RADIO_VAL_STANDARD,
            price: 0,
          })
        );
        dispatch(newSpecActions.setCompletedStep(3));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardColorsLoading]);

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const isDisabled = () => {
    if (colorRadioValue === RADIO_VAL_STANDARD && doorColor) {
      return false;
    }

    if (colorIsValid && colorRadioValue === RADIO_VAL_NON_STANDARD) {
      return false;
    }
    return true;
  };

  const setNonStandardColor = (val) => {
    let hexVal = false;
    try {
      hexVal = hex(val);
    } catch (error) {
      hexVal = false;
    }

    if (!doorColor || (doorColor && doorColor.ral === "") || !hexVal) {
      setColorIsValid(false);
    } else {
      setColorIsValid(true);
    }

    dispatch(
      newSpecActions.setDoorColor({
        type: RADIO_VAL_NON_STANDARD,
        ral: val,
        name: "Non standard color",
        price: NON_STANDARD_PRICE,
      })
    );
  };

  const setNonStandartPrice = (val) => {
    dispatch(
      newSpecActions.setDoorColor({
        type: RADIO_VAL_NON_STANDARD,
        ral: doorColor.ral,
        name: "Non standard color",
        price: val || 0,
      })
    );
  };

  const renderValidator = () => {
    if (doorColor && doorColor.ral === "") {
      return null;
    }

    let hexVal = "";
    try {
      hexVal = hex(doorColor.ral);
    } catch (e) {}

    if (colorIsValid) {
      return (
        <div
          style={{ width: 20, height: 20, marginLeft: 8, background: hexVal }}
        />
      );
    }

    return (
      <Typography variant="h6" style={{ color: "red", marginLeft: 8 }}>
        {t["invalid_ral_color"]}
      </Typography>
    );
  };

  const renderCustomColor = () => {
    return (
      <div
        style={{ flexDirection: "row", display: "flex", alignItems: "center" }}
      >
        <TextField
          value={_.get(doorColor, "ral", "")}
          id="nonStandardColorInput"
          name="nonStandardColorInput"
          label="RAL"
          variant="outlined"
          fullWidth
          onChange={(e) => setNonStandardColor(e.target.value)}
        />
        {renderValidator()}
      </div>
    );
  };

  const setStandardColor = (id) => {
    const color = _.find(standardColors, (color) => color.id === id);
    if (color) {
      dispatch(
        newSpecActions.setDoorColor({
          ...color,
          type: RADIO_VAL_STANDARD,
          price: 0,
        })
      );
    }
  };

  const renderColorSelect = () => {
    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel id="select-color-label">{t["color"]}</InputLabel>
        <Select
          classes={{ root: classes.selectCustom }}
          labelId="select-color-label"
          id="select-color"
          value={_.get(doorColor, "id", "")}
          onChange={(evt) => setStandardColor(evt.target.value)}
          autoWidth
        >
          {standardColors &&
            _.orderBy(standardColors, ["order", "ral"]).map((color) => {
              let hexVal = "";

              try {
                hexVal = hex(color.ral);
              } catch (e) {
                hexVal = "#ffffff";
              }
              return (
                <MenuItem key={color.id} value={color.id}>
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
    );
  };

  const setRadio = (value) => {
    setColorRadioValue(value);

    if (value === RADIO_VAL_STANDARD) {
      dispatch(
        newSpecActions.setDoorColor({
          ..._.orderBy(standardColors, ["order", "ral"])[0],
          type: RADIO_VAL_STANDARD,
          price: 0,
        })
      );
    } else {
      dispatch(
        newSpecActions.setDoorColor({
          type: RADIO_VAL_NON_STANDARD,
          ral: "",
          name: "Non standard color",
          price: NON_STANDARD_PRICE,
        })
      );
    }
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
                    value={colorNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setColorNote(
                          e.target.value,
                          colorNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={colorNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setColorNote(
                          colorNote?.note || "",
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
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["metal_construction_color"]}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Radio
              checked={RADIO_VAL_STANDARD === colorRadioValue}
              value={RADIO_VAL_STANDARD}
              color="primary"
              onChange={(event) => setRadio(event.target.value)}
            />
            <span className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1">
              {t["standard"]}
            </span>
          </Grid>

          <Grid item xs={12}>
            <Radio
              checked={RADIO_VAL_NON_STANDARD === colorRadioValue}
              value={RADIO_VAL_NON_STANDARD}
              color="primary"
              onChange={(event) => setRadio(event.target.value)}
            />
            <span className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1">
              {t["other"]}
            </span>
          </Grid>

          {colorRadioValue === RADIO_VAL_STANDARD ? (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              {renderColorSelect()}
            </Grid>
          ) : null}

          {colorRadioValue === RADIO_VAL_NON_STANDARD ? (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              {renderCustomColor()}
            </Grid>
          ) : null}

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={RADIO_VAL_NON_STANDARD !== colorRadioValue}
                value={doorColor?.price}
                id="customPrice"
                name="customPrice"
                label="Price"
                variant="outlined"
                fullWidth
                onChange={(e) => setNonStandartPrice(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>

        {renderAdditionalNote()}

        <TotalPrice />
        <NewSpecButtons
          users={props.users}
          isAdmin={props.isAdmin}
          disabled={isDisabled()}
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      {standardColorsLoading ? renderSpinner() : renderContent()}
    </React.Fragment>
  );
}
