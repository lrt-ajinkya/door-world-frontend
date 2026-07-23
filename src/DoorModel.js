import React, { useEffect, useState, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import doorComponentsService from "./services/doorComponentsService";
import hardwareService from "./services/hardwareService";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";

import TotalPrice from "./components/TotalPrice";
import NewSpecButtons from "./components/NewSpecButtons";

import * as newSpecActions from "./actions/newSpecificationActions";
import _ from "lodash";

import TranslationsContext from "./providers/translation";
import PriceContext, { getPrice, getPriceByDoorModel } from "./providers/price";
import { getImageUrl } from "./utils/imageUtils";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
}));

export default function DoorModel(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.navigation.language);


  const doorModel = useSelector((state) => state.newSpec.doorModel);
  const bulletproofModel = useSelector(
    (state) => state.newSpec.bulletproofModel
  );
  const hingeType = useSelector((state) => state.newSpec.hingeType);
  const exploitation = useSelector((state) => state.newSpec.exploitation);
  const modelNote = useSelector((state) => state.newSpec.modelNote);

  const p = useContext(PriceContext);
  const t = useContext(TranslationsContext);

  const [models, setModels] = useState([]);
  const [bulletproofModels, setBulletproofModels] = useState([]);
  const [doorOpenings, setDoorOpenings] = useState([]);
  const [exploitationConditions, setExploitationConditions] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [bulletproofModelsLoading, setBulletproofModelsLoading] = useState(true);
  const [doorOpeningsLoading, setDoorOpeningsLoading] = useState(true);
  const [exploitationConditionsLoading, setExploitationConditionsLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setModelsLoading(true);
        const data  = await doorComponentsService.getDoorModels();
        setModels(data);
      } catch (error) {
        console.error('Failed to load door models:', error);
      } finally {
        setModelsLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const loadBulletproofModels = async () => {
      try {
        setBulletproofModelsLoading(true);
        const data = await doorComponentsService.getBulletproofModels();
        setBulletproofModels(data);
      } catch (error) {
        console.error('Failed to load bulletproof models:', error);
      } finally {
        setBulletproofModelsLoading(false);
      }
    };

    loadBulletproofModels();
  }, []);

  useEffect(() => {
    const loadDoorOpenings = async () => {
      try {
        setDoorOpeningsLoading(true);
        const data = await doorComponentsService.getDoorOpenings();
        setDoorOpenings(data);
      } catch (error) {
        console.error('Failed to load door openings:', error);
      } finally {
        setDoorOpeningsLoading(false);
      }
    };

    loadDoorOpenings();
  }, []);

  useEffect(() => {
    const loadExploitationConditions = async () => {
      try {
        setExploitationConditionsLoading(true);
        const data = await doorComponentsService.getExploitationConditions();
        setExploitationConditions(data);
      } catch (error) {
        console.error('Failed to load exploitation conditions:', error);
      } finally {
        setExploitationConditionsLoading(false);
      }
    };

    loadExploitationConditions();
  }, []);

  useEffect(() => {
    if (
      !modelsLoading &&
      !doorOpeningsLoading &&
      !exploitationConditionsLoading &&
      !bulletproofModelsLoading
    ) {
      let defaultDoorModel = _.sortBy(models, (model) => model.order)[0];
      if (doorModel) {
        defaultDoorModel = doorModel;
      }

      let defaultHingeType = doorOpenings[0];
      if (hingeType) {
        defaultHingeType = hingeType;
      }

      let defaultExploitationCondition = exploitationConditions.find(
        (condition) => condition.default
      );
      if (exploitation) {
        defaultExploitationCondition = exploitation;
      }

      let defaultBulletproofModel = _.sortBy(
        bulletproofModels,
        (model) => model.id
      )[0];

      if (bulletproofModel) {
        defaultBulletproofModel = bulletproofModel;
      }

      dispatch(newSpecActions.setDoorModel(defaultDoorModel));
      dispatch(newSpecActions.setBulletProofModel(defaultBulletproofModel));
      dispatch(newSpecActions.setHingeType(defaultHingeType));
      dispatch(
        newSpecActions.setExploitationConditions(defaultExploitationCondition)
      );
      dispatch(newSpecActions.setCompletedStep(0));

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    modelsLoading,
    doorOpeningsLoading,
    exploitationConditionsLoading,
    bulletproofModelsLoading,
  ]);

  const renderModel = (model, index) => {
    return (
      <Grid key={model.id} item xs={6} sm={4} md={2}>
        <FormControlLabel
          value={model.id}
          control={<Radio />}
          style={{ display: "flex" }}
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <img
                alt="Door model"
                src={getImageUrl(model.image)}
                style={{
                  marginRight: "5px",
                  marginBottom: "4px",
                  maxHeight: "100px",
                  maxWidth: "50px",
                }}
              />
              <div style={{ textAlign: "center" }}>{model[language]}</div>
              <div style={{ textAlign: "center" }}>
                {getPrice("model", "door_types", model, p)} EUR
              </div>
            </div>
          }
          labelPlacement="top"
        />
      </Grid>
    );
  };

  const renderBulletproofModel = (model, index) => {
    return (
      <Grid key={model.id} item xs={6} sm={4} md={2}>
        <FormControlLabel
          value={model.id}
          control={<Radio />}
          style={{ display: "flex" }}
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <div style={{ textAlign: "center" }}>{model[language]}</div>
              <div style={{ textAlign: "center" }}>
                {getPriceByDoorModel(
                  "model",
                  "bulletproofModel",
                  model,
                  p,
                  getDoorModelKey(doorModel.key)
                )}{" "}
                EUR
              </div>
            </div>
          }
          labelPlacement="top"
        />
      </Grid>
    );
  };

  const renderCondition = (condition, index) => {
    return (
      <Grid key={condition.id} item xs={6} sm={4} md={2}>
        <FormControlLabel
          value={condition.id}
          control={<Radio />}
          style={{ display: "flex" }}
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <div style={{ textAlign: "center" }}>{condition[language]}</div>
            </div>
          }
          labelPlacement="top"
        />
      </Grid>
    );
  };

  const renderDoorOpening = (opening, index) => {
    return (
      <Grid key={opening.id} item xs={6} sm={4} md={2}>
        <FormControlLabel
          value={opening.id}
          control={<Radio />}
          style={{ display: "flex" }}
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <img
                alt="Door Opening"
                src={getImageUrl(opening.image)}
                width="auto"
                height="120px"
                style={{ marginRight: "5px", marginBottom: "4px" }}
              />
              <div style={{ textAlign: "center" }}>{t[opening.key]}</div>
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
    return !doorModel || !hingeType;
  };

  const onChangeDoorModel = (evt) => {
    dispatch(
      newSpecActions.setDoorModel(
        _.find(models, (model) => evt.target.value === model.id)
      )
    );
  };

  const onChangeBulletproofModel = (evt) => {
    dispatch(
      newSpecActions.setBulletProofModel(
        _.find(
          bulletproofModels,
          (condition) => evt.target.value === condition.id
        )
      )
    );
  };

  const onChangeExploitation = (evt) => {
    dispatch(
      newSpecActions.setExploitationConditions(
        _.find(
          exploitationConditions,
          (condition) => evt.target.value === condition.id
        )
      )
    );
  };

  const onChangeHingeType = (evt) => {
    dispatch(
      newSpecActions.setHingeType(
        _.find(doorOpenings, (opening) => opening.id === evt.target.value)
      )
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
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              <TableRow key="note" className={classes.tableRowHover}>
                <TableCell component="th" scope="row">
                  <TextField
                    onClick={(e) => e.stopPropagation()}
                    value={modelNote?.note || ""}
                    style={{ display: "flex" }}
                    id="note"
                    name="note"
                    placeholder={t["note_placeholder"]}
                    variant="outlined"
                    multiline
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setModelNote(
                          e.target.value,
                          modelNote?.price || 0
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell align="right" style={{ width: 100 }}>
                  <TextField
                    value={modelNote?.price || 0}
                    style={{ width: 100 }}
                    id="customPrice"
                    name="customPrice"
                    label="Price"
                    variant="outlined"
                    onChange={(e) =>
                      dispatch(
                        newSpecActions.setModelNote(
                          modelNote?.note || "",
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
    return (
      <div>
        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["door"]}
        </Typography>
        <RadioGroup
          value={_.get(doorModel, "id", "")}
          name="customized-radios"
          onChange={onChangeDoorModel}
          row
        >
          <Grid container spacing={3}>
            {models &&
              _.sortBy(models, (model) => model.order).map((model, index) =>
                renderModel(model, index)
              )}
          </Grid>
        </RadioGroup>

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["exploitation_conditions"]}
        </Typography>
        <RadioGroup
          value={_.get(exploitation, "id", "")}
          name="customized-radios"
          onChange={onChangeExploitation}
          row
        >
          <Grid container spacing={3}>
            {exploitationConditions &&
              _.sortBy(
                exploitationConditions,
                (condition) => condition.default
              ).map((condition, index) => renderCondition(condition, index))}
          </Grid>
        </RadioGroup>

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["bulletproof_options"]}
        </Typography>
        <RadioGroup
          value={bulletproofModel?.id}
          name="customized-radio-bp"
          onChange={onChangeBulletproofModel}
          row
        >
          <Grid container spacing={3}>
            {bulletproofModels &&
              _.sortBy(bulletproofModels, (model) => model.id).map(
                (model, index) => {
                  return model.fits.includes(getDoorModelKey(doorModel?.key))
                    ? renderBulletproofModel(model, index)
                    : null;
                }
              )}
          </Grid>
        </RadioGroup>

        <Typography
          variant="h4"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["hinge_direction"]}
        </Typography>
        <RadioGroup
          value={_.get(hingeType, "id", "")}
          name="customized-radios"
          onChange={onChangeHingeType}
          row
        >
          <Grid container spacing={3}>
            {doorOpenings && doorOpenings.map((opening, index) => renderDoorOpening(opening, index))}
          </Grid>
        </RadioGroup>

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
      {!doorModel && !doorOpenings ? renderSpinner() : renderContent()}
    </React.Fragment>
  );
}
