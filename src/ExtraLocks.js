import React, { useEffect, useState, useContext } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import hardwareService from "./services/hardwareService";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";
import NewSpecButtons from "./components/NewSpecButtons";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TotalPrice from "./components/TotalPrice";
import TranslationsContext from "./providers/translation";
import { getImageUrl } from "./utils/imageUtils";

import PriceContext, { getPrice } from "./providers/price";

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

export default function ExtraLocks(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const doorModel = useSelector((state) => state.newSpec.doorModel);
  const extraLock = useSelector((state) => state.newSpec.extraLock);
  const extraCylinder = useSelector((state) => state.newSpec.extraCylinder);
  const extraLockNote = useSelector((state) => state.newSpec.extraLockNote);

  const [filteredExtraLocks, setFilteredExtraLocks] = useState([]);

  const [extraLocks, setExtraLocks] = useState([]);
  const [extraCylinders, setExtraCylinders] = useState([]);
  const [extraLocksLoading, setExtraLocksLoading] = useState(true);
  const [extraCylindersLoading, setExtraCylindersLoading] = useState(true);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  useEffect(() => {
    const loadExtraLocks = async () => {
      try {
        setExtraLocksLoading(true);
        const data = await hardwareService.getExtraLocks();
        setExtraLocks(data);
      } catch (error) {
        console.error('Failed to load extra locks:', error);
      } finally {
        setExtraLocksLoading(false);
      }
    };

    loadExtraLocks();
  }, []);

  useEffect(() => {
    const loadExtraCylinders = async () => {
      try {
        setExtraCylindersLoading(true);
        const data = await hardwareService.getExtraCylinders();
        setExtraCylinders(data);
      } catch (error) {
        console.error('Failed to load extra cylinders:', error);
      } finally {
        setExtraCylindersLoading(false);
      }
    };

    loadExtraCylinders();
  }, []);

  const getDoorModelKey = (key) => {
    if (key === "fe15") {
      return "max";
    }

    if (key === "fe5") {
      return "classic";
    }

    return key;
  };

  useEffect(() => {
    if (!extraLocksLoading && !extraCylindersLoading) {
      const locks = extraLocks.filter((lock) =>
        lock.door_model.some((mod) => mod === getDoorModelKey(doorModel.key))
      );
      setFilteredExtraLocks([
        {
          id: 111,
          name: "None",
          locking_directions: "",
          security_class: "",
          price: 0,
        },
        ...locks,
      ]);
      if (!extraLock) {
        dispatch(
          newSpecActions.setExtraLock({
            id: 111,
            name: "None",
            locking_directions: "",
            security_class: "",
            price: 0,
          })
        );
        dispatch(newSpecActions.setCompletedStep(9));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraLocksLoading, extraCylindersLoading]);

  const handleRowClick = (extraLockId) => {
    setExtraLock(extraLockId);
  };

  const setCylinder = (cylId) => {
    const cyl = _.find(extraCylinders, (cyl) => cylId === cyl.id);

    dispatch(newSpecActions.setExtraCylinder(cyl));
  };

  const handleCylinderRowClick = (cylId) => {
    setCylinder(cylId);
  };

  const renderExtraLock = (lock) => {
    if (lock.template) {
      return (
        <TableRow
          key={lock.id}
          onClick={() => handleRowClick(lock.id)}
          className={classes.tableRowHover}
        >
          <TableCell component="th" scope="row">
            {lock.image ? (
              <img alt="Extra lock" src={getImageUrl(lock.image)} width="auto" height="80px" />
            ) : null}
          </TableCell>
          <TableCell component="th" scope="row"></TableCell>
          <TableCell component="th" scope="row">
            <TextField
              onClick={(e) => e.stopPropagation()}
              value={
                extraLock.id === lock.id
                  ? extraLock[language]
                  : lock[language]
              }
              style={{ display: "flex" }}
              id="note"
              name="note"
              disabled={extraLock.id !== lock.id}
              variant="outlined"
              multiline
              onChange={(e) => {
                setExtraLockCustom(e.target.value);
              }}
            />
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            {getPrice("extra_locks", "extra_locks", lock, p)} EUR
          </TableCell>
          <TableCell align="right">
            <Radio value={lock.id} onChange={() => {}} />
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableRow
        key={lock.id}
        onClick={() => handleRowClick(lock.id)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row">
          {lock.image ? (
            <img alt="Extra lock" src={getImageUrl(lock.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {lock.maker}
        </TableCell>
        <TableCell component="th" scope="row">
          {lock[language]}
        </TableCell>
        <TableCell align="right">{lock.locking_directions}</TableCell>
        <TableCell align="right">{lock.security_class}</TableCell>
        <TableCell align="right">
          {getPrice("extra_locks", "extra_locks", lock, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Radio value={lock.id} onChange={() => {}} />
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
    if (extraLock) {
      return false;
    }

    return true;
  };

  const setExtraLock = (extraLockId) => {
    dispatch(
      newSpecActions.setExtraLock(
        _.find(filteredExtraLocks, (extraLock) => extraLockId === extraLock.id)
      )
    );
  };

  const setExtraLockCustom = (value) => {
    dispatch(newSpecActions.setExtraLock({ ...extraLock, name: value }));
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
                    value={extraLockNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setExtraLockNote(
                          e.target.value,
                          extraLockNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={extraLockNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setExtraLockNote(
                          extraLockNote?.note || "",
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

  const renderLocks = () => {
    return (
      <RadioGroup
        value={_.get(extraLock, "id", "")}
        name="customized-radios"
        onChange={(evt) => setExtraLock(evt.target.value)}
      >
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["manufacturer"]}</TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right">{t["locking_directions"]}</TableCell>
                <TableCell align="right">{t["security_class"]}</TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExtraLocks &&
                _.sortBy(filteredExtraLocks, (lock) => lock.maker).map(
                  (extraLock, index) => renderExtraLock(extraLock)
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    );
  };

  const renderCylinder = (cyl, index) => {
    return (
      <TableRow
        key={cyl.id}
        onClick={() => handleCylinderRowClick(cyl.id)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row">
          {cyl.image ? (
            <img alt="Cylinder" src={getImageUrl(cyl.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {cyl.make}
        </TableCell>
        <TableCell component="th" scope="row">
          {cyl[language]}
        </TableCell>
        <TableCell align="right">
          {getPrice("locks", "cylinders", cyl, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Radio value={cyl.id} onChange={() => {}} />
        </TableCell>
      </TableRow>
    );
  };

  const renderCylinders = () => {
    return (
      <RadioGroup
        value={_.get(extraCylinder, "id", "")}
        name="customized-radios-cylinders"
      >
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["manufacturer"]}</TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extraCylinders &&
                _.orderBy(extraCylinders, ["group", "maker"])
                  .filter((cyl) =>
                    cyl.fits.includes(getDoorModelKey(doorModel.key))
                  )
                  .map((cyl, index) => renderCylinder(cyl, index))}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    );
  };

  const renderContent = () => {
    return (
      <div>
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          Main
        </Typography>
        {renderLocks()}

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          Cylinders
        </Typography>
        {renderCylinders()}

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
      {extraLocksLoading || extraCylindersLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
