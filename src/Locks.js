import React, { useEffect, useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@material-ui/core/RadioGroup";
import NewSpecButtons from "./components/NewSpecButtons";
import CircularProgress from "@material-ui/core/CircularProgress";
import hardwareService from "./services/hardwareService";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";

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
  accessoryRow: {
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
    backgroundColor: "#f0f0f0",
  },
}));

export default function Locks(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const mainLockAccessories = useSelector(
    (state) => state.newSpec.mainLockAccessories
  );

  const language = useSelector((state) => state.navigation.language);

  const mainLock = useSelector((state) => state.newSpec.mainLock);
  const cylinder = useSelector((state) => state.newSpec.cylinder);
  const electricStrike = useSelector((state) => state.newSpec.electricStrike);
  const lockNote = useSelector((state) => state.newSpec.lockNote);
  const doorModel = useSelector((state) => state.newSpec.doorModel);


  const [customPrice, setCustomPrice] = useState("");

  const [mainLocks, setMainLocks] = useState([]);
  const [mainLocksAdditionalAccessories, setMainLocksAdditionalAccessories] = useState([]);
  const [cylinders, setCylinders] = useState([]);
  const [electricStrikes, setElectricStrikes] = useState([]);
  const [smartLocks, setSmartLocks] = useState([]);
  const [smartLockAccessories, setSmartLockAccessories] = useState([]);
  const [easyLocks, setEasyLocks] = useState([]);
  const [easyLockAccessories, setEasyLockAccessories] = useState([]);
  
  const [mainLocksLoading, setMainLocksLoading] = useState(true);
  const [mainLocksAdditionalAccessoriesLoading, setMainLocksAdditionalAccessoriesLoading] = useState(true);
  const [cylindersLoading, setCylindersLoading] = useState(true);
  const [electricStrikesLoading, setElectricStrikesLoading] = useState(true);
  const [smartLocksLoading, setSmartLocksLoading] = useState(true);
  const [smartLockAccessoriesLoading, setSmartLockAccessoriesLoading] = useState(true);
  const [easyLocksLoading, setEasyLocksLoading] = useState(true);
  const [easyLockAccessoriesLoading, setEasyLockAccessoriesLoading] = useState(true);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  useEffect(() => {
    const loadMainLocks = async () => {
      try {
        setMainLocksLoading(true);
        const data = await hardwareService.getMainLocks();
        setMainLocks(data);
      } catch (error) {
        console.error('Failed to load main locks:', error);
      } finally {
        setMainLocksLoading(false);
      }
    };
    loadMainLocks();
  }, []);

  useEffect(() => {
    const loadMainLocksAccessories = async () => {
      try {
        setMainLocksAdditionalAccessoriesLoading(true);
        const data = await hardwareService.getMainLockAccessories();
        setMainLocksAdditionalAccessories(data);
      } catch (error) {
        console.error('Failed to load main locks accessories:', error);
      } finally {
        setMainLocksAdditionalAccessoriesLoading(false);
      }
    };
    loadMainLocksAccessories();
  }, []);

  useEffect(() => {
    const loadCylinders = async () => {
      try {
        setCylindersLoading(true);
        const data = await hardwareService.getCylinders();
        setCylinders(data);
      } catch (error) {
        console.error('Failed to load cylinders:', error);
      } finally {
        setCylindersLoading(false);
      }
    };
    loadCylinders();
  }, []);

  useEffect(() => {
    const loadElectricStrikes = async () => {
      try {
        setElectricStrikesLoading(true);
        const data = await hardwareService.getElectricStrikes();
        setElectricStrikes(data);
      } catch (error) {
        console.error('Failed to load electric strikes:', error);
      } finally {
        setElectricStrikesLoading(false);
      }
    };
    loadElectricStrikes();
  }, []);

  useEffect(() => {
    const loadSmartLocks = async () => {
      try {
        setSmartLocksLoading(true);
        const data = await hardwareService.getLocksSmart();
        setSmartLocks(data);
      } catch (error) {
        console.error('Failed to load smart locks:', error);
      } finally {
        setSmartLocksLoading(false);
      }
    };
    loadSmartLocks();
  }, []);

  useEffect(() => {
    const loadSmartLockAccessories = async () => {
      try {
        setSmartLockAccessoriesLoading(true);
        const data = await hardwareService.getLocksSmartAccessories();
        setSmartLockAccessories(data);
      } catch (error) {
        console.error('Failed to load smart lock accessories:', error);
      } finally {
        setSmartLockAccessoriesLoading(false);
      }
    };
    loadSmartLockAccessories();
  }, []);

  useEffect(() => {
    const loadEasyLocks = async () => {
      try {
        setEasyLocksLoading(true);
        const data = await hardwareService.getLocksEasy();
        setEasyLocks(data);
      } catch (error) {
        console.error('Failed to load easy locks:', error);
      } finally {
        setEasyLocksLoading(false);
      }
    };
    loadEasyLocks();
  }, []);

  useEffect(() => {
    const loadEasyLockAccessories = async () => {
      try {
        setEasyLockAccessoriesLoading(true);
        const data = await hardwareService.getLocksEasyAccessories();
        setEasyLockAccessories(data);
      } catch (error) {
        console.error('Failed to load easy lock accessories:', error);
      } finally {
        setEasyLockAccessoriesLoading(false);
      }
    };
    loadEasyLockAccessories();
  }, []);

  useEffect(() => {
    if (
      !mainLocksLoading &&
      !cylindersLoading &&
      !electricStrikesLoading &&
      !easyLocksLoading &&
      !easyLockAccessoriesLoading &&
      !smartLocksLoading
    ) {
      let defaultLock = _.orderBy(mainLocks, ["maker", "name"])[0];
      let defaultCylinder = _.orderBy(cylinders, ["group", "maker"])[0];
      let defaultElectricStrike = _.orderBy(electricStrikes, ["maker"])[0];

      if (mainLock) {
        defaultLock = mainLock;
      }

      if (cylinder) {
        defaultCylinder = cylinder;
      }

      if (electricStrike) {
        defaultElectricStrike = electricStrike;
      }

      dispatch(newSpecActions.setMainLock(defaultLock));
      dispatch(newSpecActions.setCylinder(defaultCylinder));
      dispatch(newSpecActions.setElectricStrike(defaultElectricStrike));
      dispatch(newSpecActions.setCompletedStep(8));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mainLocksLoading,
    cylindersLoading,
    electricStrikesLoading,
    easyLocksLoading,
    easyLockAccessoriesLoading,
  ]);

  const setCustomPriceAndUpdate = (price) => {
    if (mainLock.custom_price) {
      dispatch(newSpecActions.setMainLock({ ...mainLock, price }));
      dispatch(newSpecActions.setCompletedStep(8));
    }
    setCustomPrice(price);
  };

  const renderPrice = (item, index, collection) => {
    if (item.custom_price) {
      return (
        <TextField
          disabled={!mainLock || !mainLock.custom_price}
          value={customPrice}
          style={{ width: 100 }}
          id="customPrice"
          name="customPrice"
          label={t["price"]}
          variant="outlined"
          onChange={(e) => setCustomPriceAndUpdate(e.target.value)}
        />
      );
    }

    return `${getPrice("locks", collection, item, p)} EUR`;
  };

  const handleRowClick = (lockId, lockType = "main") => {
    setMainLock(lockId, lockType);
  };

  const handleCylinderRowClick = (cylId) => {
    setCylinder(cylId);
  };

  const handleStrikeRowClick = (strikeId) => {
    setElectricStrike(strikeId);
  };

  const setCustomQuantity = (value, accessory) => {
    const filteredArray = _.filter(
      mainLockAccessories,
      (item) => item.id !== accessory.id
    );
    dispatch(
      newSpecActions.setMainLockAccessories([
        ...filteredArray,
        { ...accessory, quantity: value },
      ])
    );
  };

  const handleCheckbox = (accessoryId, accessoryType = "easy") => {
    const acc = _.find(mainLockAccessories, (item) => item.id === accessoryId);
    if (acc) {
      const filteredArray = _.filter(
        mainLockAccessories,
        (accessory) => accessory.id !== accessoryId
      );
      dispatch(newSpecActions.setMainLockAccessories(filteredArray));
    } else if (accessoryType === "easy") {
      const item = _.find(
        easyLockAccessories,
        (item) => item.id === accessoryId
      );
      dispatch(
        newSpecActions.setMainLockAccessories([item, ...mainLockAccessories])
      );
    } else if (accessoryType === "smart") {
      const item = _.find(
        smartLockAccessories,
        (item) => item.id === accessoryId
      );
      dispatch(
        newSpecActions.setMainLockAccessories([item, ...mainLockAccessories])
      );
    } else if (accessoryType === "main") {
      const item = _.find(
        mainLocksAdditionalAccessories,
        (item) => item.id === accessoryId
      );
      dispatch(
        newSpecActions.setMainLockAccessories([item, ...mainLockAccessories])
      );
    }
  };

  const getQuantifiable = (accessory) => {
    const selected = _.find(
      mainLockAccessories,
      (acc) => acc.id === accessory.id
    );
    if (accessory.quantifiable) {
      return (
        <TextField
          onClick={(e) => e.stopPropagation()}
          disabled={!selected}
          value={_.get(selected, "quantity", 0)}
          style={{ width: 100 }}
          id="customQuantity"
          name="customQuantity"
          label="Quantity"
          variant="outlined"
          onChange={(e) => setCustomQuantity(e.target.value, accessory)}
        />
      );
    }

    return null;
  };

  const renderEasyLockAccessory = (accessoryId) => {
    const accessory = _.find(
      easyLockAccessories,
      (item) => item.id === accessoryId
    );
    const isChecked =
      accessory &&
      _.find(mainLockAccessories, (acc) => acc.id === accessory.id)
        ? true
        : false;

    return (
      <TableRow
        key={accessory.id}
        onClick={() => handleCheckbox(accessory.id, "easy")}
        className={classes.accessoryRow}
      >
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row">
          {accessory[language]}
        </TableCell>
        <TableCell align="right">{getQuantifiable(accessory)}</TableCell>
        <TableCell align="right">
          {getPrice("locks", "locks_easy_accessories", accessory, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Checkbox
            value={accessory.id}
            onChange={(event) => handleCheckbox(accessory.id, "easy")}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderSmartLockAccessory = (accessoryId) => {
    const accessory = _.find(
      smartLockAccessories,
      (item) => item.id === accessoryId
    );
    const isChecked =
      accessory &&
      _.find(mainLockAccessories, (acc) => acc.id === accessory.id)
        ? true
        : false;

    return (
      <TableRow
        key={accessory.id}
        onClick={() => handleCheckbox(accessory.id, "smart")}
        className={classes.accessoryRow}
      >
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row">
          {accessory[language]}
        </TableCell>
        <TableCell align="right">{getQuantifiable(accessory)}</TableCell>
        <TableCell align="right">
          {getPrice("locks", "locks_smart_accessories", accessory, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Checkbox
            value={accessory.id}
            onChange={(event) => handleCheckbox(accessory.id, "smart")}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderMainLockAccessory = (accessoryId) => {
    const accessory = _.find(
      mainLocksAdditionalAccessories,
      (item) => item.id === accessoryId
    );
    const isChecked =
      accessory &&
      _.find(mainLockAccessories, (acc) => acc.id === accessory.id)
        ? true
        : false;

    return (
      <TableRow
        key={accessory.id}
        onClick={() => handleCheckbox(accessory.id, "main")}
        className={classes.accessoryRow}
      >
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row"></TableCell>
        <TableCell component="th" scope="row">
          {accessory[language]}
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">{getQuantifiable(accessory)}</TableCell>
        <TableCell align="right">
          {getPrice("locks", "main_locks_additional_accessories", accessory, p)}{" "}
          EUR
        </TableCell>
        <TableCell align="right">
          <Checkbox
            value={accessory.id}
            onChange={(event) => handleCheckbox(accessory.id, "main")}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderEasyLock = (lock, index) => {
    return (
      <React.Fragment key={`${lock.id}${index}`}>
        <TableRow
          key={`${lock.id}${index}`}
          onClick={() => handleRowClick(lock.id, "easy")}
          className={classes.tableRowHover}
        >
          <TableCell component="th" scope="row">
            {lock.image ? (
              <img alt="Lock" src={getImageUrl(lock.image)} width="auto" height="80px" />
            ) : null}
          </TableCell>
          <TableCell component="th" scope="row">
            {lock.maker}
          </TableCell>
          <TableCell component="th" scope="row">
            {lock.set} {lock[language]}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            {renderPrice(lock, index, "locks_easy")}
          </TableCell>
          <TableCell align="right">
            <Radio value={lock.id} onChange={() => {}} />
          </TableCell>
        </TableRow>
        {mainLock &&
          mainLock.id === lock.id &&
          lock.accessories.map((accessoryId) =>
            renderEasyLockAccessory(accessoryId)
          )}
      </React.Fragment>
    );
  };

  const renderSmartLock = (lock, index) => {
    return (
      <React.Fragment key={lock.id}>
        <TableRow
          key={lock.id}
          onClick={() => handleRowClick(lock.id, "smart")}
          className={classes.tableRowHover}
        >
          <TableCell component="th" scope="row">
            {lock.image ? (
              <img alt="Lock" src={getImageUrl(lock.image)} width="auto" height="80px" />
            ) : null}
          </TableCell>
          <TableCell component="th" scope="row">
            {lock.maker}
          </TableCell>
          <TableCell component="th" scope="row">
            {lock.set} {lock[language]}
          </TableCell>
          <TableCell align="right"></TableCell>
          <TableCell align="right">
            {renderPrice(lock, index, "locks_smart")}
          </TableCell>
          <TableCell align="right">
            <Radio value={lock.id} onChange={() => {}} />
          </TableCell>
        </TableRow>
        {mainLock &&
          mainLock.id === lock.id &&
          lock.accessories.map((accessoryId) =>
            renderSmartLockAccessory(accessoryId)
          )}
      </React.Fragment>
    );
  };

  const setLockCustom = (value) => {
    dispatch(newSpecActions.setMainLock({ ...mainLock, name: value }));
  };

  const renderMainLock = (lockToRender, index) => {
    if (lockToRender.template) {
      return (
        <React.Fragment>
          <TableRow
            key={lockToRender.id}
            onClick={() => handleRowClick(lockToRender.id, "main")}
            className={classes.tableRowHover}
          >
            <TableCell component="th" scope="row">
              {lockToRender.image ? (
                <img alt="Lock" src={getImageUrl(lockToRender.image)} width="auto" height="80px" />
              ) : null}
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row">
              <TextField
                onClick={(e) => e.stopPropagation()}
                value={
                  mainLock?.id === lockToRender.id
                    ? mainLock[language]
                    : lockToRender[language]
                }
                style={{ display: "flex" }}
                id="note"
                name="note"
                disabled={mainLock?.id !== lockToRender.id}
                variant="outlined"
                multiline
                onChange={(e) => {
                  setLockCustom(e.target.value);
                }}
              />
            </TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right">
              {renderPrice(lockToRender, index, "main_locks")}
            </TableCell>
            <TableCell align="right">
              <Radio value={lockToRender.id} onChange={() => {}} />
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <TableRow
          key={lockToRender.id}
          onClick={() => handleRowClick(lockToRender.id, "main")}
          className={classes.tableRowHover}
        >
          <TableCell component="th" scope="row">
            {lockToRender.image ? (
              <img alt="Lock" src={getImageUrl(lockToRender.image)} width="auto" height="80px" />
            ) : null}
          </TableCell>
          <TableCell component="th" scope="row">
            {lockToRender.maker}
          </TableCell>
          <TableCell component="th" scope="row">
            {lockToRender[language]}
          </TableCell>
          <TableCell align="right">{lockToRender.locking_directions}</TableCell>
          <TableCell align="right">{lockToRender.security_class}</TableCell>
          <TableCell align="right">
            {renderPrice(lockToRender, index, "main_locks")}
          </TableCell>
          <TableCell align="right">
            <Radio value={lockToRender.id} onChange={() => {}} />
          </TableCell>
        </TableRow>
        {mainLock &&
          mainLock.id === lockToRender.id &&
          lockToRender.accessories &&
          lockToRender.accessories.map((accessoryId) =>
            renderMainLockAccessory(accessoryId)
          )}
      </React.Fragment>
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

  const renderStrike = (strike, index) => {
    return (
      <TableRow
        key={strike.id}
        onClick={() => handleStrikeRowClick(strike.id)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row">
          {strike.image ? (
            <img alt="strike" src={getImageUrl(strike.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {strike.maker === "1" ? "" : strike.maker}
        </TableCell>
        <TableCell component="th" scope="row">
          {strike[language]}
        </TableCell>
        <TableCell align="right">
          {getPrice("locks", "electric_strikes", strike, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Radio value={strike.id} onChange={() => {}} />
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
    if (mainLock && cylinder && electricStrike) {
      return false;
    }

    return true;
  };

  const setMainLock = (mainLockId, lockType = "main") => {
    let lock = {};

    if (lockType === "easy") {
      lock = _.find(easyLocks, (mainLock) => mainLockId === mainLock.id);
    } else if (lockType === "smart") {
      lock = _.find(smartLocks, (mainLock) => mainLockId === mainLock.id);
    } else {
      lock = _.find(mainLocks, (mainLock) => mainLockId === mainLock.id);
    }

    dispatch(newSpecActions.setMainLockAccessories([]));

    if (lock.custom_price) {
      dispatch(newSpecActions.setMainLock({ ...lock, price: customPrice }));
      return;
    }
    dispatch(newSpecActions.setMainLock(lock));
  };

  const setCylinder = (cylId) => {
    const cyl = _.find(cylinders, (cyl) => cylId === cyl.id);

    dispatch(newSpecActions.setCylinder(cyl));
  };

  const setElectricStrike = (strikeId) => {
    const strike = _.find(electricStrikes, (strike) => strikeId === strike.id);
    dispatch(newSpecActions.setElectricStrike(strike));
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

  const renderEasyLocks = () => {
    return (
      <RadioGroup
        value={_.get(mainLock, "id", "")}
        name="customized-radios"
        onChange={(evt) => setMainLock(evt.target.value, "easy")}
      >
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["manufacturer"]}</TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {easyLocks &&
                _.sortBy(easyLocks, (lock) => lock.id).map((lock, index) =>
                  renderEasyLock(lock, index)
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    );
  };

  const renderSmartLocks = () => {
    return (
      <RadioGroup
        value={_.get(mainLock, "id", "")}
        name="customized-radios"
        onChange={(evt) => setMainLock(evt.target.value, "smart")}
      >
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["manufacturer"]}</TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {smartLocks &&
                _.sortBy(smartLocks, (lock) => lock.id).map((lock, index) =>
                  renderSmartLock(lock, index)
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    );
  };

  const renderLocks = () => {
    return (
      <RadioGroup
        value={_.get(mainLock, "id", "")}
        name="customized-radios"
        onChange={(evt) => setMainLock(evt.target.value, "main")}
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
              {mainLocks &&
                _.orderBy(mainLocks, ["maker", "name"]).map((lock, index) =>
                  renderMainLock(lock, index)
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
    );
  };

  const renderCylinders = () => {
    return (
      <RadioGroup
        value={_.get(cylinder, "id", "")}
        name="customized-radios"
        onChange={(evt) => setCylinder(evt.target.value)}
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
              {cylinders &&
                _.orderBy(cylinders, ["group", "maker"])
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

  const renderElectricStrikes = () => {
    return (
      <RadioGroup
        value={electricStrike?.id}
        name="customized-radios"
        onChange={(evt) => setElectricStrike(evt.target.value)}
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
              {electricStrikes &&
                _.orderBy(electricStrikes, ["maker", "price"]).map(
                  (strike, index) =>
                    (mainLock &&
                      mainLock.id &&
                      strike.fits.includes(mainLock.id)) ||
                    strike.maker === "1"
                      ? renderStrike(strike, index)
                      : null
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </RadioGroup>
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
                    value={lockNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setLockNote(
                          e.target.value,
                          lockNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={lockNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setLockNote(
                          lockNote?.note || "",
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
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          Easy
        </Typography>
        {renderEasyLocks()}

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          Smart
        </Typography>
        {renderSmartLocks()}

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

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          Electric strikes
        </Typography>

        {renderElectricStrikes()}
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
      {mainLocksLoading ||
      cylindersLoading ||
      electricStrikesLoading ||
      easyLocksLoading ||
      easyLockAccessoriesLoading ||
      smartLocksLoading ||
      mainLocksAdditionalAccessoriesLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
