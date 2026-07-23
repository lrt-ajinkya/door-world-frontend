import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import * as newSpecActions from "../actions/newSpecificationActions";
import * as appActions from "../actions/appActions";
import authService from "../services/authService";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { Transition } from "react-transition-group";
import TextField from "@material-ui/core/TextField";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import ReplayIcon from "@material-ui/icons/ReplayOutlined";
import EuroIcon from "@material-ui/icons/Euro";
import _ from "lodash";

import Autocomplete from "@material-ui/lab/Autocomplete";
import ListboxComponent from "../components/ListBox";

import { useHistory } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import getTotalPrice from "../common/totalPriceUtil";
import TranslationsContext from "../providers/translation";
import PriceContext from "../providers/price";
import specificationService from "../services/specificationService";
import draftService from "../services/draftService";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export default function NewSpecButtons(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();

  const { disabled = false, users } = props;
  const [loading, setLoading] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [animate, setAnimate] = useState(false);

  const [selectPricesDialogOpen, setSelectPricesDialogOpen] = useState(false);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [saveNewSpecDialogOpen, setsaveNewSpecDialogOpen] = useState(false);
  const [newSpecificationDialogOpen, setNewSpecificationDialogOpen] =
    useState(false);
  const [selectedUserState, setSelectedUserState] = useState({});

  const specName = useSelector((state) => state.newSpec.name);
  const selectedUser = useSelector((state) => state.app.selectedUser);

  const [error, setError] = useState("");

  const user = authService.getCurrentUser();

  const activeStep = useSelector((state) => state.newSpec.activeStep);
  const completed = useSelector((state) => state.newSpec.completed);
  const steps = useSelector((state) => state.newSpec.steps);
  const spec = useSelector((state) => state.newSpec);

  const t = useContext(TranslationsContext);
  const p = useContext(PriceContext);

  useEffect(() => {
    const selected = _.find(users, (usr) => usr.id === selectedUser);
    setSelectedUserState(selected);
  }, []);

  const transitionStyles = {
    entering: { opacity: 1, display: "inline" },
    entered: { opacity: 1, display: "inline" },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  const defaultStyle = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0,
    display: "none",
  };

  const handleSave = async () => {
    setLoading(true);
    let specCopy = { ...spec };

    delete specCopy.activeStep;
    delete specCopy.completed;
    delete specCopy.steps;
    delete specCopy.editMode;
    specCopy.selectedPrice = selectedUserState;
    specCopy.lastUpdated = new Date();

    let access = specCopy?.access || [];

    specCopy.access = [...access, user.email];

    if (spec.id) {
      try {
        await specificationService.updateSpecification(spec.id, specCopy);
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(appActions.setSnackbarText(`Saved ${specCopy.name}`));
        dispatch(appActions.openSnackbar());
      } catch (error) {
        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(
          appActions.setSnackbarText(`Failed to save ${specCopy.name}`)
        );
        dispatch(appActions.openSnackbar());
        console.error("Error updating specification: ", error);
      } finally {
        dispatch(newSpecActions.reset());
        setLoading(false);
        history.push({ pathname: `/my` });
      }
    } else {
      specCopy.createdAt = new Date();
      specCopy.createdBy = user.email;
      specCopy.access = [user.email];
      specCopy.totalPrice = getTotalPrice(spec, p);

      try {
        const newSpec = await specificationService.create(specCopy);
        console.info("Specification created with ID: ", newSpec.id);
        dispatch(newSpecActions.reset());
        setLoading(false);
        history.push({ pathname: `/specification/${newSpec.id}` });

        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(
          appActions.setSnackbarText(`Saved specification "${specCopy.name}"`)
        );
        dispatch(appActions.openSnackbar());
      } catch (error) {
        setLoading(false);

        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(appActions.setSnackbarText(error.message));
        dispatch(appActions.openSnackbar());
        console.error("Error creating specification: ", error);
      }
    }
  };

  const isAllCompleted = () => {
    return completed
      .filter((item) => item.name !== "Price")
      .every((item) => item.completed);
  };

  const handleNext = () => {
    if (activeStep + 1 !== 13 || isAllCompleted()) {
      dispatch(newSpecActions.setCompletedStep(activeStep));
      dispatch(newSpecActions.setActiveStep(activeStep + 1));
    }
  };

  const saveDraft = async () => {
    setLoading(true);
    let specCopy = { ...spec };
    specCopy.lastUpdated = new Date();
    specCopy.selectedPrice = selectedUserState;

    if (!specCopy.id) {
      try {
        specCopy.createdAt = new Date();
        specCopy.createdBy = user.email;
        specCopy.access = [user.email];

        await draftService.create(specCopy);
        setDraftMessage(t["draft_saved"]);
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(appActions.setSnackbarText(`Saved draft ${specCopy.name}`));
        dispatch(appActions.openSnackbar());
        
        // Close the draft dialog immediately on successful save
        setDraftDialogOpen(false);
        setDraftMessage("");
      } catch (error) {
        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(
          appActions.setSnackbarText(`Failed to save draft: ${error.message}`)
        );
        dispatch(appActions.openSnackbar());
        console.error("Error creating draft: ", error);
        setError(t["error"]);
      } finally {
        setAnimate(true);
        setLoading(false);
        setTimeout(() => setAnimate(false), 3000);
      }
    } else {
      try {
        await draftService.update(specCopy.id, specCopy);
        setDraftMessage(t["draft_updated"]);
        dispatch(appActions.setSnackbarSeverity("success"));
        dispatch(
          appActions.setSnackbarText(
            `Successfuly updated draft ${specCopy.name}`
          )
        );
        dispatch(appActions.openSnackbar());
        
        // Close the draft dialog immediately on successful update
        setDraftDialogOpen(false);
        setDraftMessage("");
      } catch (error) {
        dispatch(appActions.setSnackbarSeverity("error"));
        dispatch(
          appActions.setSnackbarText(`Failed to update draft: ${error.message}`)
        );
        dispatch(appActions.openSnackbar());
        console.error("Error updating draft: ", error);
        setError(t["error"]);
      } finally {
        setAnimate(true);
        setLoading(false);
        setTimeout(() => setAnimate(false), 3000);
      }
    }
  };

  const newSpecification = () => {
    dispatch(newSpecActions.reset());
    setNewSpecificationDialogOpen(false);
    window.location.reload();
  };

  const handleBack = () => {
    dispatch(newSpecActions.setActiveStep(activeStep - 1));
  };

  const handleDraftClose = () => {
    setError("");
    setDraftDialogOpen(false);
  };

  const handleNewSpecSaveClose = () => {
    setError("");
    setsaveNewSpecDialogOpen(false);
  };

  const handleNewSpecificationClose = () => {
    setNewSpecificationDialogOpen(false);
  };

  const handleSaveDraftClick = () => {
    setDraftDialogOpen(true);
  };

  const handleSaveNewSpecClick = () => {
    setsaveNewSpecDialogOpen(true);
  };

  const handleNewSpecificationClick = () => {
    setNewSpecificationDialogOpen(true);
  };

  const renderError = () => {
    return (
      <DialogContentText
        id="alert-dialog-description"
        style={{ color: "orangered" }}
      >
        {error}
      </DialogContentText>
    );
  };

  const renderDraftNameDialog = () => {
    return (
      <Dialog
        open={draftDialogOpen}
        onClose={handleDraftClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {spec.id ? "Update draft" : "Save draft"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t["draft_name"]}
            type="text"
            value={specName}
            onChange={(e) => dispatch(newSpecActions.setName(e.target.value))}
            fullWidth
          />
          {renderError()}
        </DialogContent>
        <DialogActions>
          <div className={classes.buttons}>
            <div>
              <Transition in={animate} timeout={300}>
                {(state) => (
                  <Button
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                  >
                    {draftMessage}
                  </Button>
                )}
              </Transition>
            </div>
            <div>
              <Button onClick={handleDraftClose}>{t["close"]}</Button>
              <Button onClick={saveDraft} color="secondary" autoFocus>
                {loading ? (
                  <CircularProgress color="secondary" size={24} />
                ) : spec.id ? (
                  t["update_draft"]
                ) : (
                  t["save_draft"]
                )}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  const renderSaveNewSpecDialog = () => {
    return (
      <Dialog
        open={saveNewSpecDialogOpen}
        onClose={handleNewSpecSaveClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {spec.id ? t["update_specification"] : t["save"]}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t["specification_name"]}
            type="text"
            value={specName}
            onChange={(e) => dispatch(newSpecActions.setName(e.target.value))}
            fullWidth
          />
          {renderError()}
        </DialogContent>
        <DialogActions>
          <div className={classes.buttons}>
            <div>
              <Transition in={animate} timeout={300}>
                {(state) => (
                  <Button
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                  >
                    {draftMessage}
                  </Button>
                )}
              </Transition>
            </div>
            <div>
              <Button onClick={handleNewSpecSaveClose}>{t["close"]}</Button>
              <Button onClick={handleSave} color="secondary" autoFocus>
                {loading ? (
                  <CircularProgress color="secondary" size={24} />
                ) : spec.id ? (
                  t["update_specification"]
                ) : (
                  t["save"]
                )}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  const getOption = (user) => {
    if (!user || !user.id) {
      return "";
    }
    if (user.displayName) {
      return `${user.email} (${user.displayName})`;
    }
    return user.email;
  };

  const selectUser = (user) => {
    setSelectedUserState(user);
    dispatch(appActions.setSelectedUser(user.id));
    setSelectPricesDialogOpen(false);
    dispatch(appActions.setSnackbarSeverity("success"));
    dispatch(
      appActions.setSnackbarText(
        `Prices selected from ${user.email} (${user.displayName})`
      )
    );
    dispatch(appActions.openSnackbar());
  };

  const renderSelectPricesDialog = () => {
    if (!props?.isAdmin) return null;

    const sortedUsers = _.orderBy(props.users, [
      (user) => _.get(user, "email", "").toLowerCase(),
    ]);

    return (
      <Dialog
        open={selectPricesDialogOpen}
        onClose={() => setSelectPricesDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {spec.id ? t["update_specification"] : t["save"]}
        </DialogTitle>

        <DialogContent>
          <Autocomplete
            value={selectedUserState}
            style={{ flex: 1, margin: 8 }}
            id="selected-user"
            disableListWrap
            ListboxComponent={ListboxComponent}
            options={sortedUsers}
            getOptionLabel={(user) => getOption(user)}
            onChange={(event, value, reason) => {
              selectUser(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label={t["user"]} variant="outlined" />
            )}
            renderOption={(user, index) => {
              return (
                <div
                  style={{ height: 56, display: "flex", alignItems: "center" }}
                >
                  {getOption(user)}
                </div>
              );
            }}
          />
        </DialogContent>

        <DialogActions>
          <div className={classes.buttons}>
            <div>
              <Button onClick={() => setSelectPricesDialogOpen(false)}>
                {t["close"]}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  const renderNewSpecificationDialog = () => {
    return (
      <Dialog
        open={newSpecificationDialogOpen}
        onClose={handleNewSpecificationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t["new_specification"]}
        </DialogTitle>
        <DialogContent>
          {t["are_you_sure_new_spec"]}
          <br />
          {t["unsaved_changes"]}
        </DialogContent>
        <DialogActions>
          <div className={classes.buttons}>
            <div>
              <Transition in={animate} timeout={300}>
                {(state) => (
                  <Button
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                  >
                    {draftMessage}
                  </Button>
                )}
              </Transition>
            </div>
            <div>
              <Button onClick={handleNewSpecificationClose}>
                {t["close"]}
              </Button>
              <Button onClick={newSpecification} color="secondary" autoFocus>
                {t["create_new"]}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  const renderSelectPricesButton = () => {
    if (!props?.isAdmin) return null;

    return (
      <React.Fragment>
        <Button
          onClick={() => setSelectPricesDialogOpen(true)}
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ paddingRight: 12 }}
        >
          {t["select_prices"]}
          <EuroIcon fontSize="small" style={{ marginLeft: 5 }} />
        </Button>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className={classes.buttons}>
        <div>
          {activeStep !== steps.length - 1 && !spec.editMode && (
            <React.Fragment>
              <Button
                onClick={handleSaveDraftClick}
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={loading}
                style={{ paddingRight: 12 }}
              >
                {loading ? "" : spec.id ? t["update_draft"] : t["save_draft"]}
                {loading ? (
                  <CircularProgress color="secondary" size={24} />
                ) : (
                  <InsertDriveFileIcon
                    fontSize="small"
                    style={{ marginLeft: 5 }}
                  />
                )}
              </Button>
              <Transition in={animate} timeout={300}>
                {(state) => (
                  <Button
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                    className={classes.button}
                  >
                    {draftMessage}
                  </Button>
                )}
              </Transition>
            </React.Fragment>
          )}
          <React.Fragment>
            <Button
              onClick={handleNewSpecificationClick}
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={loading}
              style={{ paddingRight: 12 }}
            >
              {t["new_specification"]}
              <ReplayIcon fontSize="small" style={{ marginLeft: 5 }} />
            </Button>
          </React.Fragment>
          {renderSelectPricesButton()}
        </div>
        <div>
          {activeStep !== 0 && (
            <Button onClick={handleBack} className={classes.button}>
              {t["back"]}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeStep === steps.length - 1
                ? handleSaveNewSpecClick
                : handleNext
            }
            className={classes.button}
            disabled={loading || disabled}
          >
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : activeStep === steps.length - 1 ? (
              t["save"]
            ) : (
              t["next"]
            )}
          </Button>
        </div>
      </div>
      {renderSelectPricesDialog()}
      {renderSaveNewSpecDialog()}
      {renderDraftNameDialog()}
      {renderNewSpecificationDialog()}
    </React.Fragment>
  );
}
