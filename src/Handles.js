import React, { useEffect, useState, useContext } from "react";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import hardwareService from "./services/hardwareService";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import NewSpecButtons from "./components/NewSpecButtons";
import _ from "lodash";
import Typography from "@material-ui/core/Typography";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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

export default function Handles(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const [customPriceInside, setCustomPriceInside] = useState("");
  const [customPriceOutside, setCustomPriceOutside] = useState("");

  const handle = useSelector((state) => state.newSpec.handle);
  const handleNote = useSelector((state) => state.newSpec.handleNote);
  const completed = useSelector((state) => state.newSpec.completed);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const [handles, setHandles] = useState([]);
  const [handlesLoading, setHandlesLoading] = useState(true);

  useEffect(() => {
    const loadHandles = async () => {
      try {
        setHandlesLoading(true);
        const data = await hardwareService.getHandles();
        setHandles(data);
      } catch (error) {
        console.error('Failed to load handles:', error);
      } finally {
        setHandlesLoading(false);
      }
    };

    loadHandles();
  }, []);

  useEffect(() => {
    if (!handlesLoading) {
      if (_.isEmpty(handle.exterior) || _.isEmpty(handle.interior)) {
        const defaultHandle = handles.find((handle) => handle.default);
        dispatch(
          newSpecActions.setHandle({
            interior: defaultHandle,
            exterior: defaultHandle,
          })
        );
        dispatch(newSpecActions.setCompletedStep(10));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlesLoading]);

  const getCheckedValue = (handleToRender, interior) => {
    if (handleToRender.custom_price) {
      if (handleToRender.inside) {
        return handle.interior.id === handleToRender.id;
      } else {
        return handle.exterior.id === handleToRender.id;
      }
    }

    return handle[interior].id === handleToRender.id;
  };

  const renderHandle = (handleToRender) => {
    return (
      <TableRow key={handleToRender.id} className={classes.tableRowHover}>
        <TableCell component="th" scope="row">
          {handleToRender.image ? (
            <img alt="" src={getImageUrl(handleToRender.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {handleToRender.maker}
        </TableCell>
        <TableCell component="th" scope="row">
          {handleToRender[language]}
        </TableCell>
        <TableCell align="right">
          {getPrice("handles", "handles", handleToRender, p)} EUR
        </TableCell>
        <TableCell align="right">
          {handleToRender.custom_price ? (
            <TextField
              disabled={!handle.exterior || !handle.exterior.custom_price}
              value={
                handleToRender.inside ? customPriceInside : customPriceOutside
              }
              style={{ width: 100 }}
              id="customPrice"
              name="customPrice"
              label="Price"
              variant="outlined"
              onChange={(e) =>
                setCustomPriceAndUpdate(handleToRender, e.target.value)
              }
            />
          ) : (
            <Radio
              checked={getCheckedValue(handleToRender, "interior")}
              value={handleToRender.id}
              onChange={(evt) => setHandle(evt.target.value, true)}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <Radio
            checked={getCheckedValue(handleToRender, "exterior")}
            value={handleToRender.id}
            onChange={(evt) => setHandle(evt.target.value, false)}
          />
        </TableCell>
      </TableRow>
    );
  };

  const setCustomPriceAndUpdate = (handleToRender, price) => {
    if (handleToRender.inside) {
      dispatch(
        newSpecActions.setHandle({
          ...handle,
          interior: { ...handleToRender, price },
        })
      );
      setCustomPriceInside(price);
    } else {
      dispatch(
        newSpecActions.setHandle({
          ...handle,
          exterior: { ...handleToRender, price },
        })
      );
      setCustomPriceOutside(price);
    }
  };

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const isDisabled = () => {
    if (handle.interior.id && handle.exterior.id) {
      if (!completed[10].completed) {
        dispatch(newSpecActions.setCompletedStep(10));
      }
      return false;
    }

    return true;
  };

  const setHandle = (handleId, interior) => {
    const item = _.find(handles, (handle) => handleId === handle.id);
    const price = item.custom_price
      ? item.inside
        ? customPriceInside
        : customPriceOutside
      : item.price;

    if (item.custom_price) {
      if (item.inside) {
        dispatch(
          newSpecActions.setHandle({
            ...handle,
            interior: { ...item, price },
          })
        );
      } else {
        dispatch(
          newSpecActions.setHandle({
            ...handle,
            exterior: { ...item, price },
          })
        );
      }

      return;
    }

    if (interior) {
      dispatch(
        newSpecActions.setHandle({ ...handle, interior: { ...item, price } })
      );
      return;
    }

    dispatch(
      newSpecActions.setHandle({ ...handle, exterior: { ...item, price } })
    );
  };

  const renderContent = () => {
    return (
      <div>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["manufacturer"]}</TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell align="right">{t["interior"]}</TableCell>
                <TableCell align="right">{t["exterior"]}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {handles &&
                _.orderBy(handles, ["group", "order"]).map((handle) =>
                  renderHandle(handle)
                )}
            </TableBody>
          </Table>
        </TableContainer>

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
              <TableRow key="handleNote" className={classes.tableRowHover}>
                <TableCell component="th" scope="row">
                  <TextField
                    onClick={(e) => e.stopPropagation()}
                    value={handleNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setHandleNote(
                          e.target.value,
                          handleNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={handleNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setHandleNote(
                          handleNote?.note || "",
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
      {handlesLoading ? renderSpinner() : renderContent()}
    </React.Fragment>
  );
}
