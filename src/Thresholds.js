import React, { useEffect, useState, useContext } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import accessoriesService from "./services/accessoriesService";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";
import NewSpecButtons from "./components/NewSpecButtons";

import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import TotalPrice from "./components/TotalPrice";
import TranslationsContext from "./providers/translation";
import PriceContext, { getPrice } from "./providers/price";
import { getImageUrl } from "./utils/imageUtils";

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

export default function Thresholds(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);
  const threshold = useSelector((state) => state.newSpec.threshold);
  const doorModel = useSelector((state) => state.newSpec.doorModel);
  const doorTypePricesState = useSelector(
    (state) => state.newSpec.doorTypePrices
  );
  const thresholdMultiplier = useSelector(
    (state) => state.newSpec.thresholdMultiplier
  );
  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);


  const [thresholds, setThresholds] = useState([]);
  const [thresholdOptions, setThresholdOptions] = useState([]);
  const [thresholdsLoading, setThresholdsLoading] = useState(true);
  const [thresholdOptionsLoading, setThresholdOptionsLoading] = useState(true);
  const thresholdNote = useSelector((state) => state.newSpec.thresholdNote);

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        setThresholdsLoading(true);
        const data = await accessoriesService.getThresholds();
        setThresholds(data);
      } catch (error) {
        console.error('Failed to load thresholds:', error);
      } finally {
        setThresholdsLoading(false);
      }
    };

    loadThresholds();
  }, []);

  useEffect(() => {
    const loadThresholdOptions = async () => {
      try {
        setThresholdOptionsLoading(true);
        const data = await accessoriesService.getThresholdOptions();
        setThresholdOptions(data);
      } catch (error) {
        console.error('Failed to load threshold options:', error);
      } finally {
        setThresholdOptionsLoading(false);
      }
    };

    loadThresholdOptions();
  }, []);

  useEffect(() => {
    if (!thresholdsLoading && !thresholdOptionsLoading) {
      if (!threshold || !threshold.id) {
        dispatch(
          newSpecActions.setThreshold(
            _.orderBy(thresholds, ["group", "order"])[thresholds.length - 1]
          )
        );
        dispatch(newSpecActions.setCompletedStep(7));
      }

      if (doorTypePricesState.some((price) => price.isPassive)) {
        dispatch(newSpecActions.setThresholdMultiplier(2));
      } else {
        dispatch(newSpecActions.setThresholdMultiplier(1));
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdsLoading, thresholdOptionsLoading]);

  const handleRowClick = (threshId, isOption) => {
    if (isOption) {
      onThresholdOptionSelect(threshId);
    } else {
      onThresholdSelect(threshId);
    }
  };

  const renderThreshold = (thresh, isOption) => {
    return (
      <TableRow
        key={thresh.id}
        onClick={() => handleRowClick(thresh.id, isOption)}
        className={classes.tableRowHover}
      >
        <TableCell>
          {thresh.image ? (
            <img alt="threshold" src={getImageUrl(thresh.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell>{thresh[language]}</TableCell>
        <TableCell align="right">
          {thresholdMultiplier *
            getPrice("thresholds", "thresholds", thresh, p)}{" "}
          EUR
        </TableCell>
        <TableCell align="right">
          <Radio value={thresh.id} onChange={() => {}} />
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
    if (threshold) {
      return false;
    }

    return true;
  };

  const onThresholdSelect = (threshId) => {
    const item = _.find(thresholds, (thresh) => threshId === thresh.id);
    if (item) {
      dispatch(newSpecActions.setThreshold(item));
    }
  };

  const onThresholdOptionSelect = (optionId) => {
    const item = _.find(thresholdOptions, (opt) => optionId === opt.id);
    if (item) {
      if (threshold.selected_options) {
        const selected_option = _.find(
          threshold.selected_options,
          (opt) => item.id === opt.id
        );
        if (selected_option) {
          const filteredArray = _.filter(
            threshold.selected_options,
            (opt) => opt.id !== selected_option.id
          );
          dispatch(
            newSpecActions.setThreshold({
              ...threshold,
              selected_options: [...filteredArray],
            })
          );
        } else {
          dispatch(
            newSpecActions.setThreshold({
              ...threshold,
              selected_options: [...threshold.selected_options, item],
            })
          );
        }
      } else {
        dispatch(
          newSpecActions.setThreshold({
            ...threshold,
            selected_options: [item],
          })
        );
      }
    }
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

  const renderAdditionalOption = (thresh, isOption) => {
    const isChecked = _.find(
      threshold.selected_options || [],
      (thr) => thr.id === thresh.id
    )
      ? true
      : false;
    const price = Number(
      thresholdMultiplier > 1 && thresh.alt_price
        ? getPrice("thresholds", "thresholds", thresh, p, true)
        : getPrice("thresholds", "thresholds", thresh, p)
    );
    return (
      <TableRow
        key={thresh.id}
        onClick={() => handleRowClick(thresh.id, isOption)}
        className={classes.tableRowHover}
      >
        <TableCell>
          {thresh.image ? (
            <img alt="threshold" src={getImageUrl(thresh.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell>
          {thresholdMultiplier > 1 && thresh.double_leaf_name
            ? thresh[`double_leaf_${language}`]
            : thresh[language]}
        </TableCell>
        <TableCell align="right">{price} EUR</TableCell>
        <TableCell align="right">
          <Checkbox
            value={thresh.id}
            onChange={(event) => onThresholdOptionSelect(thresh.id)}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderAdditionalOptions = () => {
    if (thresholdOptions) {
      return (
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {thresholdOptions.map((opt, index) =>
                renderAdditionalOption(opt, true)
              )}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    return null;
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
                    value={thresholdNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setThresholdNote(
                          e.target.value,
                          thresholdNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={thresholdNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setThresholdNote(
                          thresholdNote?.note || "",
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
        <RadioGroup
          value={_.get(threshold, "id", "")}
          name="customized-radios"
          onChange={(evt) => onThresholdSelect(evt)}
        >
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t["name_alt"]}</TableCell>
                  <TableCell align="right">{t["price"]}</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {thresholds &&
                  _.orderBy(thresholds, ["group", "order"])
                    .filter(
                      (thresh) =>
                        thresh?.door_type?.some(
                          (item) => item === getDoorModelKey(doorModel.key)
                        ) || !thresh.door_type
                    )
                    .map((thresh, index) => renderThreshold(thresh))}
              </TableBody>
            </Table>
          </TableContainer>
        </RadioGroup>

        {renderAdditionalOptions()}
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
      {thresholdsLoading || thresholdOptionsLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
