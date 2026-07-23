import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import accessoriesService from "./services/accessoriesService";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TotalPrice from "./components/TotalPrice";

import PriceContext, { getPrice } from "./providers/price";
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
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.tableHoverColor,
    },
  },
}));

export default function Accessories(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const accessories = useSelector((state) => state.newSpec.accessories);
  const accessoryNote = useSelector((state) => state.newSpec.accessoryNote);


  const [misc, setMisc] = useState([]);
  const [eyespots, setEyespots] = useState([]);
  const [packing, setPacking] = useState([]);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  const [otherAccessories, setOtherAccessories] = useState([]);
  const [otherAccessoriesLoading, setOtherAccessoriesLoading] = useState(true);

  useEffect(() => {
    const loadOtherAccessories = async () => {
      try {
        setOtherAccessoriesLoading(true);
        const data = await accessoriesService.getOtherAccessories();
        setOtherAccessories(data);
      } catch (error) {
        console.error('Failed to load other accessories:', error);
      } finally {
        setOtherAccessoriesLoading(false);
      }
    };

    loadOtherAccessories();
  }, []);

  useEffect(() => {
    if (!otherAccessoriesLoading) {
      const filteredMisc = otherAccessories.filter(
        (item) => item.umbrella === "misc"
      );
      const filteredEyespots = otherAccessories.filter(
        (item) => item.umbrella === "eyespot"
      );
      const filteredPacking = otherAccessories.filter(
        (item) => item.umbrella === "packing"
      );

      setMisc(filteredMisc);
      setEyespots(filteredEyespots);
      setPacking(filteredPacking);

      dispatch(newSpecActions.setCompletedStep(11));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherAccessoriesLoading]);

  const handleCheckbox = (accessoryId) => {
    const acc = _.find(accessories, (item) => item.id === accessoryId);
    if (acc) {
      const filteredArray = _.filter(
        accessories,
        (accessory) => accessory.id !== accessoryId
      );
      dispatch(newSpecActions.setAccessories(filteredArray));
    } else {
      const item = _.find(otherAccessories, (item) => item.id === accessoryId);
      dispatch(newSpecActions.setAccessories([item, ...accessories]));
    }
  };

  const setCustomQuantity = (value, otherAccessory) => {
    const selected = _.find(
      accessories,
      (acc) => acc.id === otherAccessory.id
    );
    if (selected) {
      const filteredArray = _.filter(
        accessories,
        (accessory) => accessory.id !== otherAccessory.id
      );
      dispatch(
        newSpecActions.setAccessories([
          ...filteredArray,
          { ...otherAccessory, quantity: value },
        ])
      );
    }
  };

  const getQuantifiable = (otherAccessory) => {
    const selected = _.find(
      accessories,
      (acc) => acc.id === otherAccessory.id
    );
    if (otherAccessory.quantifiable) {
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
          onChange={(e) => setCustomQuantity(e.target.value, otherAccessory)}
        />
      );
    }

    return null;
  };

  const handleRowClick = (accessoryId) => {
    handleCheckbox(accessoryId);
  };

  const renderOtherAccessoryWithoutMaker = (otherAccessory, index) => {
    const isChecked =
      otherAccessory && _.find(accessories, (acc) => acc.id === otherAccessory.id) ? true : false;
    return (
      <TableRow
        key={otherAccessory.id}
        onClick={() => handleRowClick(otherAccessory.id)}
        className={classes.tableRowHover}
      >
        <TableCell component="th" scope="row" style={{ width: 200 }}>
          {otherAccessory.image ? (
            <img alt="Accessory" src={getImageUrl(otherAccessory.image)} width="auto" height="80px" />
          ) : null}
        </TableCell>
        <TableCell component="th" scope="row">
          {otherAccessory[language]}
        </TableCell>
        <TableCell align="right">{getQuantifiable(otherAccessory)}</TableCell>
        <TableCell align="right">
          {getPrice("accessories", "other_accessories", otherAccessory, p)} EUR
        </TableCell>
        <TableCell align="right">
          <Checkbox
            value={otherAccessory.id}
            onChange={(event) => handleCheckbox(otherAccessory.id)}
            checked={isChecked}
          />
        </TableCell>
      </TableRow>
    );
  };

  const setCustomName = (id, value) => {
    let index = accessories.findIndex((item) => item.id === id);
    let accessoriesCopy = [...accessories];

    if (index !== -1) {
      accessoriesCopy[index][language] = value;
      dispatch(newSpecActions.setAccessories(accessoriesCopy));
    }
  };

  const setCustomPrice = (id, value) => {
    let index = accessories.findIndex((item) => item.id === id);
    let accessoriesCopy = [...accessories];

    if (index !== -1) {
      accessoriesCopy[index].price = value;
      dispatch(newSpecActions.setAccessories(accessoriesCopy));
    }
  };

  const onDeleteClick = (id) => {
    dispatch(
      newSpecActions.setAccessories(
        accessories.filter((acc) => acc.id !== id)
      )
    );
  };

  const renderCustomeAccessory = (otherAccessory, index) => {
    return (
      <TableRow key={otherAccessory.id} className={classes.tableRowHover}>
        <TableCell
          component="th"
          scope="row"
          style={{ width: 200 }}
        ></TableCell>
        <TableCell component="th" scope="row">
          <TextField
            value={otherAccessory[language]}
            style={{ width: 500 }}
            id="customName"
            name="customName"
            label="Name"
            variant="outlined"
            onChange={(e) => setCustomName(otherAccessory.id, e.target.value)}
          />
        </TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right">
          <TextField
            value={otherAccessory.price}
            style={{ width: 100 }}
            id="customPrice"
            name="customPrice"
            label="Price"
            variant="outlined"
            onChange={(e) => setCustomPrice(otherAccessory.id, e.target.value)}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={(event) => onDeleteClick(otherAccessory.id)}
            aria-label="delete"
            color="primary"
          >
            <DeleteIcon />
          </IconButton>
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

  const addNewRow = () => {
    const item = {
      id: new Date().getTime(),
      group: "custom",
      image: "",
      name: "",
      price: "0",
      umbrella: "custom",
    };

    dispatch(newSpecActions.setAccessories([item, ...accessories]));
  };

  const isDisabled = () => {
    return false;
  };

  const renderAddButton = () => {
    return (
      <TableRow>
        <TableCell component="th" scope="row" style={{ width: 200 }}>
          <Button
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => addNewRow()}
          >
            {t["add"]} +
          </Button>
        </TableCell>
        <TableCell component="th" scope="row"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
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
                    value={accessoryNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setAccessoryNote(
                          e.target.value,
                          accessoryNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={accessoryNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setAccessoryNote(
                          accessoryNote?.note || "",
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
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.sortBy(misc, (acc) => acc.group).map((otherAccessory, index) =>
                renderOtherAccessoryWithoutMaker(otherAccessory, index)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#e31e24", marginTop: 48 }}
        >
          {t["eyespots"]}
        </Typography>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.sortBy(eyespots, (acc) => acc.group).map(
                (otherAccessory, index) =>
                  renderOtherAccessoryWithoutMaker(otherAccessory, index)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#e31e24", marginTop: 48 }}
        >
          {t["packaging"]}
        </Typography>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t["name_alt"]}</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{t["price"]}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.sortBy(packing, (acc) => acc.group).map(
                (otherAccessory, index) =>
                  renderOtherAccessoryWithoutMaker(otherAccessory, index)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#e31e24", marginTop: 48 }}
        >
          {t["custom"]}
        </Typography>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {_.filter(accessories, (acc) => acc.group === "custom").map(
                (otherAccessory, index) =>
                  renderCustomeAccessory(otherAccessory, index)
              )}
              {renderAddButton()}
            </TableBody>
          </Table>
        </TableContainer>

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
      {otherAccessoriesLoading ? renderSpinner() : renderContent()}
    </React.Fragment>
  );
}
