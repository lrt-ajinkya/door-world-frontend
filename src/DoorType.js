import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Grid from "@material-ui/core/Grid";
import doorComponentsService from "./services/doorComponentsService";
import { useDispatch } from "react-redux";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";

import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import TranslationsContext from "./providers/translation";
import NewSpecButtons from "./components/NewSpecButtons";
import TotalPrice from "./components/TotalPrice";
import { getImageUrl } from "./utils/imageUtils";

const useStyles = makeStyles((theme) => ({
  selectCustom: {
    padding: "11px 0px 10px 0px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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

export default function DoorType(props) {
  const classes = useStyles();


  const dispatch = useDispatch();

  const doorType = useSelector((state) => state.newSpec.doorType);
  const doorTypePricesState = useSelector(
    (state) => state.newSpec.doorTypePrices
  );
  const typeNote = useSelector((state) => state.newSpec.typeNote);

  const [types, setTypes] = useState([]);
  const [doorTypePrices, setDoorTypePrices] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [doorTypePricesLoading, setDoorTypePricesLoading] = useState(true);

  const t = useContext(TranslationsContext);

  useEffect(() => {
    const loadDoorTypes = async () => {
      try {
        setTypesLoading(true);
        const data = await doorComponentsService.getDoorTypes();
        setTypes(data);
      } catch (error) {
        console.error('Failed to load door types:', error);
      } finally {
        setTypesLoading(false);
      }
    };

    loadDoorTypes();
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
    if (!typesLoading && !doorTypePricesLoading) {
      let defaultDoorType =
        _.find(types, (type) => type.default === true) || types[0];

      if (doorType) {
        defaultDoorType = doorType;
      }

      if (doorTypePricesState.length > 0) {
        dispatch(newSpecActions.setDoorTypePrices(doorTypePricesState));
      } else {
        dispatch(
          newSpecActions.setDoorTypePrices(
            defaultDoorType.prices.map((price) => {
              return { price, dimensions: 0 };
            })
          )
        );
      }
      dispatch(newSpecActions.setCompletedStep(1));
      dispatch(newSpecActions.setDoorType(defaultDoorType));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typesLoading, doorTypePricesLoading]);

  const renderType = (type, index) => {

    return (
      <Grid key={type.id} item xs={6} sm={4} md={2}>
        <FormControlLabel
          key={type.id}
          value={type.id}
          control={<Radio />}
          style={{ display: "flex" }}
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                alt="Door type"
                src={getImageUrl(type.image)}
                width="auto"
                height="140px"
                style={{ marginRight: "5px", marginBottom: "4px" }}
              />
              <div>{type.name}</div>
            </div>
          }
          labelPlacement="top"
        />
      </Grid>
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
    if (doorType) {
      return false;
    }

    return true;
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
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow key="note" className={classes.tableRowHover}>
                <TableCell component="th" scope="row">
                  <TextField
                    onClick={(e) => e.stopPropagation()}
                    value={typeNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setTypeNote(
                          e.target.value,
                          typeNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={typeNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setTypeNote(
                          typeNote?.note || "",
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
        <RadioGroup
          value={_.get(doorType, "id", "")}
          name="customized-radios"
          onChange={(evt) => {
            const data = _.find(types, (type) => evt.target.value === type.id);
            const priceData = data.prices.map((price) => {
              const retrievedData = _.find(
                doorTypePrices,
                (doorTypePrice) => doorTypePrice.id === price
              );
              return { ...retrievedData, dimensions: 0 };
            });
            dispatch(newSpecActions.setDoorType(data));
            dispatch(newSpecActions.setDoorTypePrices(priceData));

            dispatch(newSpecActions.setTotalHeight());
            dispatch(newSpecActions.setTotalWidth());
            dispatch(newSpecActions.setHandleHeight());

            dispatch(newSpecActions.setHingeCaps());
            dispatch(newSpecActions.setHingeCapFinishing());
            dispatch(newSpecActions.setHinges());

            dispatch(newSpecActions.setFinishings());
            dispatch(newSpecActions.setThreshold());

            dispatch(newSpecActions.resetSteps([2, 4, 5, 7, 11, 12]));
          }}
          row
        >
          <Grid container spacing={3}>
            {types &&
              _.sortBy(types, (type) => Number(type.name)).map((type) =>
                renderType(type)
              )}
          </Grid>
        </RadioGroup>

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
      {typesLoading || doorTypePricesLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
