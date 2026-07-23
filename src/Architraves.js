import React, { useEffect, useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import NewSpecButtons from "./components/NewSpecButtons";
import CircularProgress from "@material-ui/core/CircularProgress";
import accessoriesService from "./services/accessoriesService";
import doorComponentsService from "./services/doorComponentsService";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ral from "./common/ral";

import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import PriceContext, { getPrice } from "./providers/price";
import TotalPrice from "./components/TotalPrice";
import TranslationsContext from "./providers/translation";
import { getImageUrl } from "./utils/imageUtils";

const useStyles = makeStyles((theme) => {
  return {
    spinner: {
      display: "flex",
      justifyContent: "center",
      marginTop: 48,
      marginBottom: 48,
    },
    selectCustom: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: theme.palette.tableHoverColor,
      },
    },
  };
});

export default function Architraves(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.navigation.language);

  const architrave = useSelector((state) => state.newSpec.architraves);
  const architraveNote = useSelector((state) => state.newSpec.architraveNote);

  const [customPrice, setCustomPrice] = useState("");

  const doorModel = useSelector((state) => state.newSpec.doorModel);
  const doorType = useSelector((state) => state.newSpec.doorType);

  const hingeMultiplier = useSelector((state) => state.newSpec.hingeMultiplier);
  const oppositeMultiplier = useSelector(
    (state) => state.newSpec.oppositeMultiplier
  );

  const [architraves, setArchitraves] = useState([]);
  const [pvcColors, setPvcColors] = useState([]);
  const [stainedColors, setStainedColors] = useState([]);
  const [architravesLoading, setArchitravesLoading] = useState(true);
  const [pvcColorsLoading, setPvcColorsLoading] = useState(true);
  const [stainedColorsLoading, setStainedColorsLoading] = useState(true);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  useEffect(() => {
    const loadArchitraves = async () => {
      try {
        setArchitravesLoading(true);
        const data = await accessoriesService.getArchitraves();
        setArchitraves(data);
      } catch (error) {
        console.error('Failed to load architraves:', error);
      } finally {
        setArchitravesLoading(false);
      }
    };

    loadArchitraves();
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
    if (!architravesLoading && !pvcColorsLoading && !stainedColorsLoading) {
      const defaultArchitrave = _.find(
        architraves,
        (item) => item.default === true
      );
      let defaultArchitraves = {
        hingeSide: defaultArchitrave,
        oppositeSide: defaultArchitrave,
      };

      if (architrave && (architrave.hingeSide || architrave.oppositeSide)) {
        defaultArchitraves = architrave;
      }

      dispatch(newSpecActions.setArchitraves(defaultArchitraves));
      dispatch(newSpecActions.setCompletedStep(6));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [architravesLoading, pvcColorsLoading, stainedColorsLoading]);

  const setCustomPriceAndUpdate = (price, hingeSide, item) => {
    let updatedArchitraves = { ...architrave };
    updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = {
      ...item,
      price,
    };

    if (architrave[hingeSide ? "hingeSide" : "oppositeSide"].custom_price) {
      dispatch(newSpecActions.setArchitraves(updatedArchitraves));
    }
    setCustomPrice(price);
  };

  const renderPrice = (item, index, hingeSide) => {
    if (item.custom_price) {
      return (
        <TextField
          disabled={
            !architrave[hingeSide ? "hingeSide" : "oppositeSide"] ||
            !architrave[hingeSide ? "hingeSide" : "oppositeSide"].custom_price
          }
          value={customPrice}
          style={{ width: 100 }}
          id="customPrice"
          name="customPrice"
          label="Price"
          variant="outlined"
          onChange={(e) =>
            setCustomPriceAndUpdate(e.target.value, hingeSide, item)
          }
        />
      );
    }

    const shouldMultiply = hingeSide ? hingeMultiplier : oppositeMultiplier;

    if (item.alt_price && shouldMultiply) {
      return `${getPrice("architraves", "architraves", item, p, true)} EUR`;
    }

    return item.price
      ? `${getPrice(
          "architraves",
          "architraves",
          item,
          p,
          item.double && doorType.double
        )} EUR`
      : "";
  };

  const setWRBColor = (architraveToRender, value, hingeSide) => {
    const color = value;
    let updatedArchitraves = { ...architrave };
    updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = {
      ...architraveToRender,
      color,
    };

    dispatch(newSpecActions.setArchitraves(updatedArchitraves));
  };

  const setPVCColor = (architraveToRender, id, hingeSide) => {
    const color = _.find(pvcColors, (item) => item.id === id);
    let updatedArchitraves = { ...architrave };
    updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = {
      ...architraveToRender,
      color,
    };

    dispatch(newSpecActions.setArchitraves(updatedArchitraves));
  };

  const setAllRal = (architraveToRender, value, hingeSide) => {
    const color = value;
    let updatedArchitraves = { ...architrave };
    updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = {
      ...architraveToRender,
      color,
    };

    dispatch(newSpecActions.setArchitraves(updatedArchitraves));
  };

  const renderSelectedAllRAL = (architraveToRender, hingeSide) => {
    if (
      !_.get(
        architrave[hingeSide ? "hingeSide" : "oppositeSide"],
        "color.HEX",
        false
      ) ||
      architrave[hingeSide ? "hingeSide" : "oppositeSide"].id !==
        architraveToRender.id
    )
      return null;

    return (
      <span
        style={{
          marginLeft: 8,
          width: 20,
          height: 20,
          background:
            architrave[hingeSide ? "hingeSide" : "oppositeSide"].color.HEX,
        }}
      />
    );
  };

  const renderSelectedWrb = (architraveToRender, hingeSide) => {
    if (
      !_.get(
        architrave[hingeSide ? "hingeSide" : "oppositeSide"],
        "color",
        false
      )
    )
      return null;

    const color = architrave[hingeSide ? "hingeSide" : "oppositeSide"].color;

    if (color.image) {
      return (
        <img
          alt="Stained"
          style={{ marginLeft: 8 }}
          src={getImageUrl(color.image)}
          height="50px"
          width="auto"
        />
      );
    }

    if (!architrave[hingeSide ? "hingeSide" : "oppositeSide"].color.HEX)
      return null;

    return (
      <span
        style={{
          marginLeft: 8,
          width: 20,
          height: 20,
          background:
            architrave[hingeSide ? "hingeSide" : "oppositeSide"].color.HEX,
        }}
      />
    );
  };

  const renderSelectedPVC = (architraveToRender, hingeSide) => {
    if (
      !_.get(
        architrave[hingeSide ? "hingeSide" : "oppositeSide"],
        "color",
        false
      )
    )
      return null;
    if (
      architrave[hingeSide ? "hingeSide" : "oppositeSide"].color.color_type !==
      "pvc"
    )
      return null;

    const color = architrave[hingeSide ? "hingeSide" : "oppositeSide"].color;

    return (
      <img
        alt="PVC"
        style={{ marginTop: "10px" }}
        src={getImageUrl(color.image)}
        height="73px"
        width="auto"
      />
    );
  };

  const getPVCValue = (architraveToRender, hingeSide) => {
    const colorId = _.get(
      architrave[hingeSide ? "hingeSide" : "oppositeSide"],
      "color.id",
      null
    );
    if (
      !colorId ||
      architraveToRender.id !==
        architrave[hingeSide ? "hingeSide" : "oppositeSide"].id
    ) {
      return _.sortBy(pvcColors, (color) => color.name)[0].id;
    }
    return architrave[hingeSide ? "hingeSide" : "oppositeSide"].color.id;
  };

  const getAllRal = (architraveToRender, hingeSide) => {
    const colorHEX = _.get(
      architrave[hingeSide ? "hingeSide" : "oppositeSide"],
      "color.HEX",
      null
    );
    if (
      !colorHEX ||
      architraveToRender.id !==
        architrave[hingeSide ? "hingeSide" : "oppositeSide"].id
    ) {
      return null;
    }
    return architrave[hingeSide ? "hingeSide" : "oppositeSide"].color;
  };

  const renderPVC = (architraveToRender, hingeSide) => {
    return (
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FormControl className={classes.formControl} variant="outlined">
          <InputLabel id="select-pvc-label">{t["color"]}</InputLabel>
          <Select
            classes={{ root: classes.selectCustom }}
            labelId="select-pvc-label"
            id="select-pvc"
            value={getPVCValue(architraveToRender, hingeSide)}
            onChange={(evt) =>
              setPVCColor(architraveToRender, evt.target.value, hingeSide)
            }
            disabled={
              !architrave[hingeSide ? "hingeSide" : "oppositeSide"] ||
              architrave[hingeSide ? "hingeSide" : "oppositeSide"].id !==
                architraveToRender.id
            }
          >
            {_.sortBy(pvcColors, (color) => color.name).map((color, index) => {
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
        {renderSelectedPVC(architraveToRender, hingeSide)}
      </div>
    );
  };

  const renderWRB = (architraveToRender, hingeSide) => {
    return (
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Autocomplete
          style={{ flex: 1, margin: 8 }}
          disabled={
            !architrave[hingeSide ? "hingeSide" : "oppositeSide"] ||
            architrave[hingeSide ? "hingeSide" : "oppositeSide"].id !==
              architraveToRender.id
          }
          id="combo-box-ral-stained"
          options={[...stainedColors, ...ral]}
          getOptionLabel={(option) => {
            if (!option.English) {
              return option.name;
            }
            return `${option.English} ${option.RAL}`;
          }}
          onChange={(event, value, reason) =>
            setWRBColor(architraveToRender, value, hingeSide)
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
        {renderSelectedWrb(architraveToRender, hingeSide)}
      </div>
    );
  };

  const renderAllRAL = (architraveToRender, hingeSide) => {
    return (
      <div
        style={{
          marginTop: 8,
          marginLeft: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Autocomplete
          style={{ flex: 1, margin: 8 }}
          disabled={
            !architrave[hingeSide ? "hingeSide" : "oppositeSide"] ||
            architrave[hingeSide ? "hingeSide" : "oppositeSide"].id !==
              architraveToRender.id
          }
          id="combo-box-ral"
          options={ral}
          value={getAllRal(architraveToRender, hingeSide)}
          getOptionLabel={(option) => `${option.English} ${option.RAL}`}
          onChange={(event, value, reason) =>
            setAllRal(architraveToRender, value, hingeSide)
          }
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
        {renderSelectedAllRAL(architraveToRender, hingeSide)}
      </div>
    );
  };

  const renderColor = (architraveToRender, hingeSide) => {
    if (architraveToRender.colors === "RAL") {
      return renderAllRAL(architraveToRender, hingeSide);
    }

    if (architraveToRender.colors === "pvc") {
      return renderPVC(architraveToRender, hingeSide);
    }

    if (architraveToRender.colors === "wrb") {
      return renderWRB(architraveToRender, hingeSide);
    }

    return null;
  };

  const handleCheckbox = (architraveToRender, hingeSide) => {
    const isChecked = hingeSide ? hingeMultiplier : oppositeMultiplier;

    if (hingeSide) {
      dispatch(newSpecActions.setHingeMultiplier(!isChecked));
    } else {
      dispatch(newSpecActions.setOppositeMultiplier(!isChecked));
    }
  };

  const getSelector = (architraveToRender, hingeSide) => {
    if (architraveToRender.multiplier) {
      const isChecked = hingeSide ? hingeMultiplier : oppositeMultiplier;
      return (
        <Checkbox
          value={architraveToRender.id}
          onChange={(event) => handleCheckbox(architraveToRender, hingeSide)}
          checked={isChecked}
        />
      );
    }

    return <Radio value={architraveToRender.id} onChange={() => {}} />;
  };

  const onTableRowClick = (architraveToRender, hingeSide) => {
    if (architraveToRender.multiplier) {
      handleCheckbox(architraveToRender, hingeSide);
    } else {
      setArchitrave(architraveToRender.id, hingeSide);
    }
  };

  const renderArchitrave = (architraveToRender, index, hingeSide) => {
    return (
      <TableRow
        key={architraveToRender.id}
        onClick={() => onTableRowClick(architraveToRender, hingeSide)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row">
          {architraveToRender.image ? (
            <img alt="Architrave" src={getImageUrl(architraveToRender.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {architraveToRender[language]}
        </TableCell>
        <TableCell align="right">
          {renderColor(architraveToRender, hingeSide)}
        </TableCell>
        <TableCell align="right">
          {renderPrice(architraveToRender, index, hingeSide)}
        </TableCell>
        <TableCell align="right">
          {getSelector(architraveToRender, hingeSide)}
        </TableCell>
      </TableRow>
    );
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const isDisabled = () => {
    if (architrave.hingeSide && architrave.oppositeSide) {
      return false;
    }

    return true;
  };

  const setArchitrave = (architraveId, hingeSide) => {
    const item = _.find(architraves, (arch) => architraveId === arch.id);
    let updatedArchitraves = { ...architrave };

    if (item.custom_price) {
      updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = {
        ...item,
        price: customPrice,
      };
      dispatch(newSpecActions.setArchitraves(updatedArchitraves));
      return;
    }

    updatedArchitraves[hingeSide ? "hingeSide" : "oppositeSide"] = { ...item };
    dispatch(newSpecActions.setArchitraves(updatedArchitraves));
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
                    value={architraveNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setArchitraveNote(
                          e.target.value,
                          architraveNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={architraveNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setArchitraveNote(
                          architraveNote?.note || "",
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

  const renderArchitraves = (hingeSide, sortedArchitraves) => {
    return (
      <React.Fragment>
        <Typography
          variant="h4"
          gutterBottom
          style={{
            marginBottom: 24,
            color: "#e31e24",
            marginTop: hingeSide ? 24 : 64,
          }}
        >
          {hingeSide
            ? t["hinge_side_architraves"]
            : t["opposite_side_architraves"]}
        </Typography>

        <RadioGroup
          value={_.get(
            hingeSide ? architrave.hingeSide : architrave.oppositeSide,
            "id",
            ""
          )}
          name="customized-radios"
          onChange={(evt) => setArchitrave(evt.target.value, hingeSide)}
        >
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t["name_alt"]}</TableCell>
                  <TableCell align="right">{t["color"]}</TableCell>
                  <TableCell align="right">{t["price"]}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedArchitraves.map((architrave, index) => {
                  return architrave.fits.includes(
                    getDoorModelKey(doorModel.key)
                  )
                    ? renderArchitrave(architrave, index, hingeSide)
                    : null;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </RadioGroup>
      </React.Fragment>
    );
  };

  const getDoorModelKey = (key) => {
    if (key === "fe15") {
      return "max";
    }

    if (key === "fe5") {
      return "classic";
    }

    return key;
  };

  const renderContent = () => {
    const sortedArchitraves = _.orderBy(architraves, ["group", "order"]);
    const hingeSideArchitraves = _.filter(
      sortedArchitraves,
      (architrave) => architrave.side === "hinge" || architrave.side === "both"
    );
    const oppositeSideArchitraves = _.filter(
      sortedArchitraves,
      (architrave) =>
        architrave.side === "opposite" || architrave.side === "both"
    );

    return (
      <div>
        {renderArchitraves(true, hingeSideArchitraves)}
        {renderArchitraves(false, oppositeSideArchitraves)}

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
      {!architraves || !pvcColors || !stainedColors
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
