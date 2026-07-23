import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import glassService from "./services/glassService";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import TotalPrice from "./components/TotalPrice";

import NewSpecButtons from "./components/NewSpecButtons";
import TranslationsContext from "./providers/translation";
import { PhoneEnabled } from "@material-ui/icons";
import { getImageUrl } from "./utils/imageUtils";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  submit: {
    height: 48,
  },
}));

export default function Glass(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const language = useSelector((state) => state.navigation.language);

  const glass = useSelector((state) => state.newSpec.glass);
  const finishings = useSelector((state) => state.newSpec.finishings);
  const doorModel = useSelector((state) => state.newSpec.doorModel);
  const glassNote = useSelector((state) => state.newSpec.glassNote);
  const doorTypePrices = useSelector((state) => state.newSpec.doorTypePrices);

  const t = useContext(TranslationsContext);

  // PACKS
  const [glassPacks, setGlassPacks] = useState([]);
  const [glassShapes, setGlassShapes] = useState([]);
  const [glassFilms, setGlassFilms] = useState([]);
  const [glassAddons, setGlassAddons] = useState([]);
  const [glassBulletproofSizes, setGlassBulletproofSizes] = useState([]);
  const [glassShapesBulletproof, setGlassShapesBulletproof] = useState([]);
  
  const [glassPacksLoading, setGlassPacksLoading] = useState(true);
  const [glassShapesLoading, setGlassShapesLoading] = useState(true);
  const [glassFilmsLoading, setGlassFilmsLoading] = useState(true);
  const [glassAddonsLoading, setGlassAddonsLoading] = useState(true);
  const [glassBulletproofSizesLoading, setGlassBulletproofSizesLoading] = useState(true);
  const [glassShapesBulletproofLoading, setGlassShapesBulletproofLoading] = useState(true);

  useEffect(() => {
    const loadAllGlassData = async () => {
      try {
        const {
          glassAddonTypes,
          glassTypeNew,
          glassFilm,
          glassAddon,
          bulletproofSizes,
          bulletproofShapes
        } = await glassService.getAllGlassData();
        
        setGlassPacks(glassAddonTypes);
        setGlassShapes(glassTypeNew);
        setGlassFilms(glassFilm);
        setGlassAddons(glassAddon);
        setGlassBulletproofSizes(bulletproofSizes);
        setGlassShapesBulletproof(bulletproofShapes);
      } catch (error) {
        console.error('Failed to load glass data:', error);
      } finally {
        setGlassPacksLoading(false);
        setGlassShapesLoading(false);
        setGlassFilmsLoading(false);
        setGlassAddonsLoading(false);
        setGlassBulletproofSizesLoading(false);
        setGlassShapesBulletproofLoading(false);
      }
    };

    loadAllGlassData();
  }, []);

  useEffect(() => {
    if (
      !glassPacksLoading &&
      !glassShapesLoading &&
      !glassFilmsLoading &&
      !glassAddonsLoading &&
      !glassBulletproofSizesLoading &&
      !glassShapesBulletproofLoading
    ) {
      const filteredExternal = _.filter(
        finishings.external,
        (finishing) =>
          finishing.carving.glazings.length > 0 ||
          finishing.carving.custom_glazings
      );
      const filteredInternal = _.filter(
        finishings.internal,
        (finishing) =>
          finishing.carving.glazings.length > 0 ||
          finishing.carving.custom_glazings
      );

      let filteredUnion = _.unionBy(
        filteredExternal,
        filteredInternal,
        (finishing) => finishing.carving.id
      ).map((finishing) => ({
        id: finishing.id,
        carving: finishing.carving,
        glass: [],
        name: finishing[language] || finishing.name,
      }));

      // eslint-disable-next-line no-unused-expressions
      doorTypePrices?.forEach((panel) => {
        if (panel?.isPassive === false) {
          filteredUnion.push({
            id: panel.id,
            carving: null,
            glass: [],
            name: panel[language] || panel.name,
            isPanel: true,
          });
        }
      });

      if (glass.length === 0) {
        dispatch(newSpecActions.setGlass(filteredUnion));
      }
      dispatch(newSpecActions.setCompletedStep(12));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    glassPacksLoading,
    glassShapesLoading,
    glassFilmsLoading,
    glassAddonsLoading,
    glassBulletproofSizesLoading,
    glassShapesBulletproofLoading,
  ]);

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  };

  const isDisabled = () => {
    return false;
  };

  const addGlass = (index) => {
    const glassCopy = [...glass];

    let item = {};
    item.glassPack = { ...glassPacks[0] };

    item.glassShape = { ...glassShapes[0] };
    item.glassFilm = { ...glassFilms[0] };
    item.glassAddon = { ...glassAddons[0] };
    item.glassBulletproofAddon = { ...glassAddons[0] };

    item.glassBulletproofSize = { ...glassBulletproofSizes[0] };
    item.glassBulletproofType = { ...glassShapesBulletproof[0] };

    glassCopy[index].glass.push(item);

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const renderAddButton = (index) => {
    return (
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={() => addGlass(index)}
        >
          {t["plus_add_glass"]}
        </Button>
      </Grid>
    );
  };

  const renderSection = (item, glassIndex) => {
    return (
      <React.Fragment key={`${item.id}${glassIndex}`}>
        <Grid item xs={12} style={{ marginTop: 16 }}>
          {item.carving?.image ? (
            <img
              alt="Carving"
              src={getImageUrl(item.carving.image)}
              height="100px"
              width="auto"
              style={{ marginRight: "5px", marginBottom: "4px" }}
            />
          ) : null}
        </Grid>

        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <Typography variant="h6">
            {`${item[language] || item.name} (${t["carving"]} ${
              item.carving[language] || item.carving.name
            })`}
          </Typography>
        </Grid>

        {item.glass &&
          item.glass.map((selectedGlass, index) =>
            renderGlass(selectedGlass, glassIndex, index)
          )}

        {renderAddButton(glassIndex)}
      </React.Fragment>
    );
  };

  const renderPanelSection = (item, glassIndex) => {
    return (
      <React.Fragment key={`${item.id}${glassIndex}`}>
        <Grid item xs={12} style={{ marginTop: 16 }}></Grid>

        <Grid item xs={12} style={{ paddingTop: 0 }}>
          <Typography variant="h6">{`${
            item[language] || item.name
          }`}</Typography>
        </Grid>

        {item.glass &&
          item.glass.map((selectedGlass, index) =>
            renderGlass(selectedGlass, glassIndex, index)
          )}

        {renderAddButton(glassIndex)}
      </React.Fragment>
    );
  };

  const getGlassPackValue = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassPack.id;
  };

  const getGlassFilmValue = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassFilm.id;
  };

  const getGlassShapeValue = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassShape.id;
  };

  const getGlassAddonValue = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassAddon.id;
  };

  const getGlassBulletproofAddonValue = (glassIndex, index) => {
    return (
      glass[glassIndex]?.glass?.[index]?.glassBulletproofAddon?.id ||
      glassAddons[0].id
    );
  };

  const getGlassBulletproofSize = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassBulletproofSize.id;
  };

  const getGlassBulletproofType = (glassIndex, index) => {
    return glass[glassIndex].glass[index].glassBulletproofType.id;
  };

  const getGlassBulletproofItems = (glassIndex, index) => {
    const sizeId = getGlassBulletproofSize(glassIndex, index);
    const sizes = _.find(glassBulletproofSizes, (size) => size.id === sizeId);

    return sizes.size
      .map((item) =>
        _.find(glassShapesBulletproof, (shape) => shape.id === item)
      )
      .filter((item) => item.price[getDoorModelKey(doorModel.key)]);
  };

  const setGlassShape = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const shape = _.find(glassShapes, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassShape = shape;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const setGlassFilm = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const film = _.find(glassFilms, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassFilm = film;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const setGlassAddon = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const addon = _.find(glassAddons, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassAddon = addon;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const setGlassBulletproofAddon = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const addon = _.find(glassAddons, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassBulletproofAddon = addon;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const setGlassPack = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const pack = _.find(glassPacks, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassPack = pack;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const deleteGlass = (glassIndex, index) => {
    const tempGlass = [...glass];
    tempGlass[glassIndex].glass.splice(index, 1);

    dispatch(newSpecActions.setGlass(tempGlass));
  };

  const setGlassBulletproofSize = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const size = _.find(glassBulletproofSizes, (item) => item.id === id);
    const type = size.size
      .map((item) =>
        _.find(glassShapesBulletproof, (shape) => shape.id === item)
      )
      .filter((item) => item.price[getDoorModelKey(doorModel.key)])[0];

    glassCopy[glassIndex].glass[index].glassBulletproofSize = size;
    glassCopy[glassIndex].glass[index].glassBulletproofType = type;

    dispatch(newSpecActions.setGlass(glassCopy));
  };

  const setGlassBulletproofType = (id, glassIndex, index) => {
    let glassCopy = [...glass];

    const type = _.find(glassShapesBulletproof, (item) => item.id === id);
    glassCopy[glassIndex].glass[index].glassBulletproofType = type;

    dispatch(newSpecActions.setGlass(glassCopy));
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

  const renderGlassPack = (glassIndex, index) => {
    return (
      <FormControl
        className={classes.formControl}
        style={{ marginBottom: 16, marginRight: 16, minWidth: 130 }}
        variant="outlined"
      >
        <InputLabel id="select-glass-label">{t["pack_type"]}</InputLabel>
        <Select
          labelId="select-glass-label"
          id="select-glass"
          value={getGlassPackValue(glassIndex, index)}
          onChange={(evt) => setGlassPack(evt.target.value, glassIndex, index)}
        >
          {glassPacks.map((item) => {
            return (
              <MenuItem key={`${item.id}${index}`} value={item.id}>
                {`${item[language] || item.name}`}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const renderGlass = (selectedGlass, glassIndex, index) => {
    return (
      <React.Fragment key={`${selectedGlass.id}${glassIndex}${index}`}>
        <Grid item xs={12}>
          <Typography
            style={{ display: "inline-flex", marginTop: 10, marginRight: 16 }}
            variant="h6"
          >
            {index + 1}
          </Typography>

          {renderGlassPack(glassIndex, index)}

          {renderGlazing(glassIndex, index)}
          {renderBulletproof(glassIndex, index)}

          <IconButton
            onClick={() => deleteGlass(glassIndex, index)}
            aria-label="delete"
            color="primary"
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </React.Fragment>
    );
  };

  const renderGlazing = (glassIndex, index) => {
    const glassPackValue = getGlassPackValue(glassIndex, index);
    if (
      glassPackValue === "GLASS_ADDON_TYPE_2" ||
      glassPackValue === "GLASS_ADDON_TYPE_4"
    ) {
      const glassShapeValue = getGlassShapeValue(glassIndex, index);
      return (
        <React.Fragment>
          <FormControl
            className={classes.formControl}
            variant="outlined"
            style={{ marginBottom: 16, marginRight: 16 }}
          >
            <InputLabel id="select-glass-label">
              {t["shape_and_size"]}
            </InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={glassShapeValue}
              onChange={(evt) =>
                setGlassShape(evt.target.value, glassIndex, index)
              }
            >
              {glassShapes.map((item) => {
                return (
                  <MenuItem key={`${item.id}${index}`} value={item.id}>
                    {`${item[language] || item.name} ${Number(
                      item.price[
                        glassPackValue === "GLASS_ADDON_TYPE_4"
                          ? `${getDoorModelKey(doorModel.key)}_thick`
                          : getDoorModelKey(doorModel.key)
                      ]
                    )} EUR`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            className={classes.formControl}
            style={{ marginBottom: 16, marginRight: 16 }}
            variant="outlined"
          >
            <InputLabel id="select-glass-label">{t["film"]}</InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={getGlassFilmValue(glassIndex, index)}
              onChange={(evt) =>
                setGlassFilm(evt.target.value, glassIndex, index)
              }
            >
              {glassFilms
                .filter((item) =>
                  _.get(item, `price[${glassShapeValue}]`, false)
                )
                .map((item) => {
                  return (
                    <MenuItem key={`${item.id}${index}`} value={item.id}>
                      {`${item[language] || item.name} ${Number(
                        item.price[glassShapeValue]
                      )} EUR`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <FormControl
            className={classes.formControl}
            style={{ marginBottom: 16 }}
            variant="outlined"
          >
            <InputLabel id="select-glass-label">{t["addon"]}</InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={getGlassAddonValue(glassIndex, index)}
              onChange={(evt) =>
                setGlassAddon(evt.target.value, glassIndex, index)
              }
            >
              {glassAddons
                .filter((item) =>
                  _.get(item, `price[${glassShapeValue}]`, false)
                )
                .map((item) => {
                  return (
                    <MenuItem key={`${item.id}${index}`} value={item.id}>
                      {`${item[language] || item.name} ${Number(
                        item.price[glassShapeValue]
                      )} EUR`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    return null;
  };

  const renderBulletproof = (glassIndex, index) => {
    const glassPackValue = getGlassPackValue(glassIndex, index);
    if (glassPackValue === "GLASS_ADDON_TYPE_3") {
      const glassShapeValue = getGlassBulletproofSize(glassIndex, index);
      console.log(glassShapeValue);
      return (
        <React.Fragment>
          <FormControl
            className={classes.formControl}
            style={{ marginBottom: 16, marginRight: 16 }}
            variant="outlined"
          >
            <InputLabel id="select-glass-label">{t["shape"]}</InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={getGlassBulletproofSize(glassIndex, index)}
              onChange={(evt) =>
                setGlassBulletproofSize(evt.target.value, glassIndex, index)
              }
            >
              {glassBulletproofSizes.map((item) => {
                return (
                  <MenuItem key={`${item.id}${index}`} value={item.id}>
                    {`${item[language] || item.name}`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            className={classes.formControl}
            style={{ marginBottom: 16, marginRight: 16 }}
            variant="outlined"
          >
            <InputLabel id="select-glass-label">{t["type"]}</InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={getGlassBulletproofType(glassIndex, index)}
              onChange={(evt) =>
                setGlassBulletproofType(evt.target.value, glassIndex, index)
              }
            >
              {getGlassBulletproofItems(glassIndex, index).map((item) => {
                return (
                  <MenuItem key={`${item.id}${index}`} value={item.id}>
                    {`${item[language] || item.name} ${Number(
                      item.price[getDoorModelKey(doorModel.key)]
                    )} EUR`}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl
            className={classes.formControl}
            style={{ marginBottom: 16 }}
            variant="outlined"
          >
            <InputLabel id="select-glass-label">{t["addon"]}</InputLabel>
            <Select
              labelId="select-glass-label"
              id="select-glass"
              value={getGlassBulletproofAddonValue(glassIndex, index)}
              onChange={(evt) =>
                setGlassBulletproofAddon(evt.target.value, glassIndex, index)
              }
            >
              {glassAddons
                .filter((item) =>
                  _.get(item, `price[${glassShapeValue}]`, false)
                )
                .map((item) => {
                  return (
                    <MenuItem key={`${item.id}${index}`} value={item.id}>
                      {`${item[language] || item.name} ${Number(
                        item.price[glassShapeValue]
                      )} EUR`}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </React.Fragment>
      );
    }
    return null;
  };

  const renderNoGlazings = () => {
    return (
      <Grid item xs={12}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["no_glass"]}
        </Typography>
      </Grid>
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
                    value={glassNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setGlassNote(
                          e.target.value,
                          glassNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={glassNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setGlassNote(
                          glassNote?.note || "",
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
            >
              {t["addons"]}
            </Typography>
          </Grid>
          {glass.length
            ? glass.map((item, index) => {
                if (item.isPanel) {
                  return renderPanelSection(item, index);
                }
                return renderSection(item, index);
              })
            : renderNoGlazings()}
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
    <React.Fragment>
      {glassPacksLoading ||
      glassShapesLoading ||
      glassFilmsLoading ||
      glassAddonsLoading ||
      glassBulletproofSizesLoading ||
      glassShapesBulletproofLoading
        ? renderSpinner()
        : renderContent()}
    </React.Fragment>
  );
}
