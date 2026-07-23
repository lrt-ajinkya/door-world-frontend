import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import hardwareService from "./services/hardwareService";
import { useDispatch } from "react-redux";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";

import Checkbox from "@material-ui/core/Checkbox";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import TableHead from "@material-ui/core/TableHead";

import PriceContext, { getPrice } from "./providers/price";
import TotalPrice from "./components/TotalPrice";
import NewSpecButtons from "./components/NewSpecButtons";
import TranslationsContext from "./providers/translation";
import { getImageUrl } from "./utils/imageUtils";

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
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
  },
}));

export default function Hinges(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.navigation.language);


  const doorHinges = useSelector((state) => state.newSpec.hinges);
  const doorHingeCaps = useSelector((state) => state.newSpec.hingeCaps);
  const doorHingeCapFinishing = useSelector(
    (state) => state.newSpec.hingeCapFinishing
  );
  const doorTypePricesState = useSelector(
    (state) => state.newSpec.doorTypePrices
  );
  const hingeAccessoriesState = useSelector(
    (state) => state.newSpec.hingeAccessories
  );
  const hingeNote = useSelector((state) => state.newSpec.hingeNote);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const [hinges, setHinges] = useState([]);
  const [availableHingeCaps, setAvailableHingeCaps] = useState([]);
  const [hingeCapFinishings, setHingeCapFinishings] = useState([]);
  const [hingeAccessories, setHingeAccessories] = useState([]);
  const [hingesLoading, setHingesLoading] = useState(true);
  const [hingeCapsLoading, setHingeCapsLoading] = useState(true);
  const [hingeCapFinishingsLoading, setHingeCapFinishingsLoading] = useState(true);
  const [hingeAccessoriesLoading, setHingeAccessoriesLoading] = useState(true);

  useEffect(() => {
    const loadAllHingeData = async () => {
      try {
        const {hinges, accessories, caps, finishings} = await hardwareService.getAllHardwareForHinges();
        setHinges(hinges);
        setHingeAccessories(accessories);
        setAvailableHingeCaps(caps);
        setHingeCapFinishings(finishings);
      } catch (error) {
        console.error('Failed to load hinge data:', error);
      } finally {
        setHingesLoading(false);
        setHingeCapsLoading(false);
        setHingeCapFinishingsLoading(false);
        setHingeAccessoriesLoading(false);
      }
    };

    loadAllHingeData();
  }, []);

  useEffect(() => {
    if (!hingesLoading && !hingeCapsLoading && !hingeCapFinishingsLoading) {
      if (doorHinges.length === 0) {
        const hinge = _.find(hinges, (hinge) => hinge.default);
        const passives = _.filter(
          doorTypePricesState,
          (price) => price.isPassive
        );
        const passivesWithHinges = passives.map((passive) => ({
          ...passive,
          hinge,
        }));
        dispatch(
          newSpecActions.setHinges([
            { id: "111", name: "Main door", hinge },
            ...passivesWithHinges,
          ])
        );
      }

      if (!doorHingeCaps) {
        const hinge = _.find(
          _.sortBy(availableHingeCaps, (hinge) => hinge.order),
          (hinge) => hinge.default
        );
        dispatch(newSpecActions.setHingeCaps(hinge));
      }

      if (doorHingeCapFinishing.length === 0) {
        const hingeCapFinishing = _.find(
          hingeCapFinishings,
          (finishing) => finishing.default
        );
        dispatch(newSpecActions.setHingeCapFinishing([hingeCapFinishing]));
      }

      dispatch(newSpecActions.setCompletedStep(4));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hingesLoading, hingeCapsLoading, hingeCapFinishingsLoading]);

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const isDisabled = () => {
    if (doorHinges && doorHingeCaps) {
      return false;
    }

    return true;
  };

  const setNumberOfHinges = (id, item) => {
    const hinge = _.find(hinges, (hinge) => hinge.id === id);
    let filtered = _.filter(doorHinges, (hinge) => hinge.id !== item.id);

    dispatch(newSpecActions.setHinges([{ ...item, hinge }, ...filtered]));
  };

  const setHingeCaps = (id) => {
    const hingeCap = _.find(availableHingeCaps, (cap) => cap.id === id);
    dispatch(newSpecActions.setHingeCaps(hingeCap));
  };

  const renderHinge = (hinge, index) => {
    return (
      <FormControlLabel
        key={hinge.id}
        value={hinge.id}
        control={<Radio />}
        label={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>{hinge.name}</div>
          </div>
        }
        labelPlacement="end"
      />
    );
  };

  const renderHingeCap = (hinge, index) => {
    return (
      <FormControlLabel
        key={hinge.id}
        value={hinge.id}
        control={<Radio />}
        label={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>{hinge[language]}</div>
          </div>
        }
        labelPlacement="end"
      />
    );
  };

  const renderAdditionalPanels = () => {
    return doorTypePricesState.map((price) => {
      if (price.isPassive) {
        return (
          <Grid key={price.id} item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              {price.name} hinges
            </Typography>
            <RadioGroup
              value={getNumberOfHingesValue(price.id)}
              aria-label="color-type"
              onChange={(event) => setNumberOfHinges(event.target.value, price)}
            >
              {hinges &&
                hinges.map((hinge, index) => renderHinge(hinge, index))}
            </RadioGroup>
          </Grid>
        );
      }
      return null;
    });
  };

  const setHingeCapFinishing = (id) => {
    const finishing = _.find(
      hingeCapFinishings,
      (finishing) => finishing.id === id
    );
    if (finishing) {
      dispatch(newSpecActions.setHingeCapFinishing([finishing]));
    }
  };

  const renderSelectedHingeCapFinishing = () => {
    if (doorHingeCapFinishing.length === 0) return null;

    return (
      <img
        alt="Hinge cap finishing"
        style={{ marginLeft: "16px" }}
        src={getImageUrl(doorHingeCapFinishing[0].image)}
        height="80px"
        width="auto"
      />
    );
  };

  const renderHingeCapFinishings = () => {
    if (doorHingeCaps && doorHingeCaps.caps) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <FormControl variant="outlined">
            <InputLabel id="select-milling-label">Finishing</InputLabel>
            <Select
              classes={{ root: classes.selectCustom }}
              labelId="select-color-label"
              id="select-color"
              value={_.get(doorHingeCapFinishing[0], "id", "")}
              onChange={(evt) => setHingeCapFinishing(evt.target.value)}
            >
              {hingeCapFinishings &&
                hingeCapFinishings.map((finishing) => {
                  return (
                    <Tooltip
                      key={finishing.id}
                      placement="right"
                      value={finishing.id}
                      title={
                        <img
                          alt="Hinge cap finishing"
                          src={getImageUrl(finishing.image)}
                          width="auto"
                          height="100px"
                        />
                      }
                    >
                      <MenuItem>
                        {finishing[language]}{" "}
                        {getPrice(
                          "hinges",
                          "hinge_cap_finishings",
                          finishing,
                          p
                        )}{" "}
                        EUR
                      </MenuItem>
                    </Tooltip>
                  );
                })}
            </Select>
          </FormControl>
          {renderSelectedHingeCapFinishing()}
        </div>
      );
    }

    return null;
  };

  const getNumberOfHingesValue = (id) => {
    if (doorHinges && id) {
      const numberOfHinges = _.find(doorHinges, (hinge) => hinge.id === id);
      return _.get(numberOfHinges, "hinge.id", "");
    }

    return "";
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
                    value={hingeNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setHingeNote(
                          e.target.value,
                          hingeNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={hingeNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setHingeNote(
                          hingeNote?.note || "",
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

  const handleCheckbox = (accessoryId) => {
    const acc = _.find(
      hingeAccessoriesState,
      (item) => item.id === accessoryId
    );
    if (acc) {
      const filteredArray = _.filter(
        hingeAccessoriesState,
        (accessory) => accessory.id !== accessoryId
      );
      dispatch(newSpecActions.setHingeAccessories(filteredArray));
    } else {
      const item = _.find(hingeAccessories, (item) => item.id === accessoryId);
      dispatch(
        newSpecActions.setHingeAccessories([item, ...hingeAccessoriesState])
      );
    }
  };

  const setCustomQuantity = (value, otherAccessory) => {
    const selected = _.find(
      hingeAccessoriesState,
      (acc) => acc.id === otherAccessory.id
    );
    if (selected) {
      const filteredArray = _.filter(
        hingeAccessoriesState,
        (accessory) => accessory.id !== otherAccessory.id
      );
      dispatch(
        newSpecActions.setHingeAccessories([
          ...filteredArray,
          { ...otherAccessory, quantity: value },
        ])
      );
    }
  };

  const handleRowClick = (accessoryId) => {
    handleCheckbox(accessoryId);
  };

  const getQuantifiable = (otherAccessory) => {
    const selected = _.find(
      hingeAccessoriesState,
      (acc) => acc.id === otherAccessory.id
    );
    if (otherAccessory.quantifiable) {
      return (
        <TextField
          onClick={(e) => e.stopPropagation()}
          disabled={!selected}
          value={_.get(selected, "quantity", 1)}
          style={{ width: 100 }}
          id="customQuantity"
          name="customQuantity"
          label="Quantity"
          variant="outlined"
          onChange={(e) => setCustomQuantity(e.target.value, otherAccessory)}
        />
      );
    }

    return null;
  };

  const renderHingeAccessory = (hinge, index) => {
    const isChecked =
      hinge && _.find(hingeAccessoriesState, (acc) => acc.id === hinge.id)
        ? true
        : false;
    return (
      <TableRow
        key={hinge.id}
        onClick={() => handleRowClick(hinge.id)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row">
          {hinge[language]}
        </TableCell>
        <TableCell align="right">{getQuantifiable(hinge)}</TableCell>
        <TableCell align="right">
          {getPrice("hinges", "hinge_accessories", hinge, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Checkbox
            value={hinge.id}
            onChange={(event) => handleCheckbox(hinge.id)}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderHingeAccessories = () => {
    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
          >
            {t["hinge_accessories"]}
          </Typography>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t["name_alt"]}</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{t["price"]}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hingeAccessories &&
                  hingeAccessories.map((hinge, index) =>
                    renderHingeAccessory(hinge, index)
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["number_of_hinges"]}
            </Typography>
            <RadioGroup
              value={getNumberOfHingesValue("111")}
              aria-label="color-type"
              onChange={(event) =>
                setNumberOfHinges(event.target.value, {
                  id: "111",
                  name: "Main door",
                })
              }
            >
              {hinges &&
                hinges.map((hinge, index) => renderHinge(hinge, index))}
            </RadioGroup>
          </Grid>

          {renderAdditionalPanels()}

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["hinge_caps"]}
            </Typography>
            <RadioGroup
              value={_.get(doorHingeCaps, "id", "")}
              aria-label="hinge-caps"
              onChange={(event) => setHingeCaps(event.target.value)}
            >
              {availableHingeCaps &&
                _.sortBy(availableHingeCaps, (hinge) => hinge.order).map(
                  (hinge, index) => renderHingeCap(hinge, index)
                )}
            </RadioGroup>

            {renderHingeCapFinishings({ id: "111", name: "Main door" })}
          </Grid>
        </Grid>

        {renderHingeAccessories()}

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
      {hingesLoading &&
      hingeCapsLoading &&
      hingeCapFinishingsLoading &&
      doorHinges &&
      doorHingeCaps &&
      doorHingeCapFinishing &&
      hingeAccessoriesLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
