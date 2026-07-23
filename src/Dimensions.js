import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { useDispatch } from "react-redux";
import * as newSpecActions from "./actions/newSpecificationActions";
import { useSelector } from "react-redux";
// Storage operations removed - using backend API
import TranslationsContext from "./providers/translation";

import { makeStyles } from "@material-ui/core/styles";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import TotalPrice from "./components/TotalPrice";
import NewSpecButtons from "./components/NewSpecButtons";

const DEFAULT_HANDLE_HEIGHT = "standardHandleHeight";
const OTHER_HANDLE_HEIGHT = "otherHandleHeight";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
  },
}));

export default function Dimensions(props) {
  const classes = useStyles();

  const height = useSelector((state) => state.newSpec.height);
  const width = useSelector((state) => state.newSpec.width);

  const totalHeight = useSelector((state) => state.newSpec.totalHeight);
  const totalWidth = useSelector((state) => state.newSpec.totalWidth);

  const handleHeight = useSelector((state) => state.newSpec.handleHeight);
  const doorTypePricesState = useSelector(
    (state) => state.newSpec.doorTypePrices
  );
  const doorType = useSelector((state) => state.newSpec.doorType);

  const dimensionNote = useSelector((state) => state.newSpec.dimensionNote);

  const [handleHeightRadioValue, setHandleHeightRadioValue] = useState(
    handleHeight !== 1000 ? OTHER_HANDLE_HEIGHT : DEFAULT_HANDLE_HEIGHT
  );
  const [doorTypeImage, setDoorTypeImage] = useState("");

  const t = useContext(TranslationsContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const arrayCopy = [...doorTypePricesState];

    if (Number(totalHeight) && Number(height)) {
      if (doorTypePricesState && doorTypePricesState.length > 0) {
        for (const price of doorTypePricesState) {
          if (price.position === "top") {
            const index = _.findIndex(
              arrayCopy,
              (item) => item.id === price.id
            );

            arrayCopy.splice(index, 1, {
              ...price,
              dimensions: totalHeight - height,
            });
          }
        }
      }
    }

    if (Number(totalWidth) && Number(width)) {
      if (doorTypePricesState && doorTypePricesState.length > 0) {
        const sides = _.filter(
          doorTypePricesState,
          (price) => price.position === "side"
        );

        if (sides.length > 0) {
          const oneSideDimension = (totalWidth - width) / sides.length;

          for (const side of sides) {
            const index = _.findIndex(
              arrayCopy,
              (item) => item.id === side.id
            );
            arrayCopy.splice(index, 1, {
              ...side,
              dimensions: oneSideDimension,
            });
          }

          dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
        }
      }
    }

    // Image is now served directly from backend
    setDoorTypeImage(doorType.image || '');

    dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
    dispatch(newSpecActions.setCompletedStep(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTotalHeight = (totalHeight) => {
    try {
      const dimension = Number(totalHeight) - Number(height);

      if (dimension || dimension === 0) {
        if (doorTypePricesState && doorTypePricesState.length > 0) {
          const someAreTop = doorTypePricesState.some(
            (price) => price.position === "top"
          );

          if (someAreTop) {
            for (const price of doorTypePricesState) {
              if (price.position === "top") {
                const arrayCopy = [...doorTypePricesState];
                const index = _.findIndex(
                  doorTypePricesState,
                  (item) => item.id === price.id
                );

                arrayCopy.splice(index, 1, { ...price, dimensions: dimension });
                dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
              }
            }
          } else {
            setHeight(totalHeight);
          }
        }

        dispatch(newSpecActions.setTotalHeight(totalHeight));
      }
    } catch (e) {
      console.error(e);
      dispatch(newSpecActions.setTotalHeight(0));
    }
  };

  const setTotalWidth = (totalWidth) => {
    try {
      const dimension = Number(totalWidth) - Number(width);
      if (dimension || dimension === 0) {
        if (doorTypePricesState && doorTypePricesState.length > 0) {
          const sides = _.filter(
            doorTypePricesState,
            (price) => price.position === "side"
          );

          if (sides.length > 0) {
            const oneSideDimension = dimension / sides.length;
            let arrayCopy = [...doorTypePricesState];

            for (const side of sides) {
              const index = _.findIndex(
                arrayCopy,
                (item) => item.id === side.id
              );
              arrayCopy.splice(index, 1, {
                ...side,
                dimensions: oneSideDimension,
              });
            }

            dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
          }
        }

        dispatch(newSpecActions.setTotalWidth(totalWidth));
      }
    } catch (e) {
      console.error(e);
      dispatch(newSpecActions.setTotalWidth(0));
    }
  };

  const setHeight = (height) => {
    try {
      const dimension = Number(totalHeight) - Number(height);

      if (dimension || dimension === 0) {
        if (doorTypePricesState && doorTypePricesState.length > 0) {
          for (const price of doorTypePricesState) {
            if (price.position === "top") {
              const arrayCopy = [...doorTypePricesState];
              const index = _.findIndex(
                doorTypePricesState,
                (item) => item.id === price.id
              );

              arrayCopy.splice(index, 1, { ...price, dimensions: dimension });
              dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
            }
          }
        }

        dispatch(newSpecActions.setHeight(height));

        if (doorTypePricesState?.length === 0) {
          dispatch(newSpecActions.setTotalHeight(height));
        }
      }
    } catch (e) {
      console.error(e);
      dispatch(newSpecActions.setHeight(height));
    }
  };

  const setWidth = (width) => {
    try {
      const dimension = Number(totalWidth) - Number(width);
      if (dimension || dimension === 0) {
        if (doorTypePricesState && doorTypePricesState.length > 0) {
          const sides = _.filter(
            doorTypePricesState,
            (price) => price.position === "side"
          );

          if (sides.length > 0) {
            const oneSideDimension = dimension / sides.length;
            let arrayCopy = [...doorTypePricesState];

            for (const side of sides) {
              const index = _.findIndex(
                arrayCopy,
                (item) => item.id === side.id
              );
              arrayCopy.splice(index, 1, {
                ...side,
                dimensions: oneSideDimension,
              });
            }

            dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
          }
        }
      }

      dispatch(newSpecActions.setWidth(width));

      if (doorTypePricesState?.length === 0) {
        dispatch(newSpecActions.setTotalWidth(width));
      }
    } catch (e) {
      console.error(e);
      dispatch(newSpecActions.setWidth(width));
    }
  };

  const setHandleHeight = (height) => {
    dispatch(newSpecActions.setHandleHeight(height));
  };

  const handleOnText = (text, data) => {
    const dimension = Number(text);

    if (dimension || dimension === 0) {
      if (data.position === "top") {
        dispatch(newSpecActions.setTotalHeight(dimension + height));
      }

      if (data.position === "side") {
        const sides = _.filter(
          doorTypePricesState,
          (price) => price.position === "side" && price.id !== data.id
        );

        let calculatedWidth = width;
        if (sides.length > 0) {
          for (const side of sides) {
            calculatedWidth += side.dimensions;
          }
        }

        dispatch(newSpecActions.setTotalWidth(calculatedWidth + dimension));
      }

      const arrayCopy = [...doorTypePricesState];
      const index = _.findIndex(
        doorTypePricesState,
        (item) => item.id === data.id
      );

      arrayCopy.splice(index, 1, { ...data, dimensions: dimension });
      dispatch(newSpecActions.setDoorTypePrices(arrayCopy));
    }
  };

  const renderPercentageSize = (data) => {
    return (
      <Grid
        style={{ marginTop: 16, marginBottom: 16 }}
        container
        spacing={3}
        key={data.id}
      >
        <Grid item xs={6} sm={4} md={2}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
          >
            {data.name}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <TextField
            id={data.id}
            name={data.id}
            label={data.name}
            variant="outlined"
            fullWidth
            onChange={(e) => handleOnText(e.target.value, data)}
            value={data.dimensions}
          />
        </Grid>
      </Grid>
    );
  };

  const renderField = (data) => {
    switch (data.type) {
      case "fixed":
        return null;
      case "percentage_size":
        return renderPercentageSize(data);
      default:
        break;
    }
  };

  const isDisabled = () => {
    if (height > 0 && width > 0) {
      if (
        doorTypePricesState &&
        doorTypePricesState &&
        doorTypePricesState.length > 0
      ) {
        for (const price of doorTypePricesState) {
          if (price.type === "percentage_size" && price.dimensions <= 0) {
            return true;
          }
        }
        return false;
      }
      return false;
    }

    return true;
  };

  const renderTotalDimensions = () => {
    if (doorTypePricesState && doorTypePricesState.length === 0) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
          >
            Total dimensions
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <TextField
            value={totalWidth}
            id="totalWidth"
            name="totalWidth"
            label={t["width"]}
            variant="outlined"
            fullWidth
            onChange={(e) => setTotalWidth(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <TextField
            value={totalHeight}
            id="totalHeight"
            name="totalHeight"
            label={t["height"]}
            variant="outlined"
            fullWidth
            onChange={(e) => setTotalHeight(e.target.value)}
          />
        </Grid>
      </Grid>
    );
  };

  const renderFields = () => {
    if (doorTypePricesState && doorTypePricesState.length > 0) {
      return (
        <React.Fragment>
          <div style={{ height: 36, marginTop: 16, marginBottom: 16 }} />

          {doorTypePricesState.map((item) => renderField(item))}

          <div style={{ height: 36, marginTop: 16, marginBottom: 16 }} />
        </React.Fragment>
      );
    }
    return null;
  };

  const renderDoorTypeImage = () => {
    return (
      <React.Fragment>
        <img
          alt="Door type"
          src={doorTypeImage}
          width="auto"
          height="140px"
          style={{ marginTop: "12px", marginRight: "5px", marginBottom: "4px" }}
        />
      </React.Fragment>
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
                    value={dimensionNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setDimensionNote(
                          e.target.value,
                          dimensionNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={dimensionNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setDimensionNote(
                          dimensionNote?.note || "",
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

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {renderDoorTypeImage()}
        {renderTotalDimensions()}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["door_dimensions"]}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <TextField
              value={width}
              id="width"
              name="width"
              label={t["width"]}
              variant="outlined"
              fullWidth
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <TextField
              value={height}
              id="height"
              name="height"
              label={t["height"]}
              variant="outlined"
              fullWidth
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        {renderFields()}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["handle_height"]}
            </Typography>
            <RadioGroup
              defaultValue={DEFAULT_HANDLE_HEIGHT}
              aria-label="handleHeight"
              onChange={(event) =>
                setHandleHeightRadioValue(event.target.value)
              }
              row
            >
              <FormControlLabel
                value={DEFAULT_HANDLE_HEIGHT}
                control={<Radio />}
                label={t["standard"]}
                labelPlacement="start"
              />
              <FormControlLabel
                value={OTHER_HANDLE_HEIGHT}
                control={<Radio color="primary" />}
                label={
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div>{t["other"]}</div>
                    {handleHeightRadioValue === OTHER_HANDLE_HEIGHT ? (
                      <TextField
                        value={handleHeight}
                        style={{ marginLeft: 22, width: 100 }}
                        id="height"
                        name={t["height"]}
                        label="CM"
                        variant="outlined"
                        fullWidth
                        onChange={(e) =>
                          setHandleHeight(Number(e.target.value))
                        }
                      />
                    ) : null}
                  </div>
                }
                labelPlacement="start"
              />
            </RadioGroup>
          </Grid>
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
    <React.Fragment>{false ? renderSpinner() : renderContent()}</React.Fragment>
  );
}
