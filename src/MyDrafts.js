import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import draftService from "./services/draftService";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import * as myDraftsActions from "./actions/myDraftsActions";
import * as newSpecActions from "./actions/newSpecificationActions";
import * as appActions from "./actions/appActions";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import TranslationsContext from "./providers/translation";

import moment from "moment";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
    },
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    marginTop: 48,
    marginBottom: 48,
  },
  tableRow: {
    cursor: "pointer",
  },
}));

export default function MyDrafts(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  let history = useHistory();

  const [open, setOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const draftsState = useSelector((state) => state.myDrafts.drafts);
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(true);

  const t = useContext(TranslationsContext);

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        setDraftsLoading(true);
        const data = await draftService.getAll();
        const remappedData = data.map(item => ({...item.draft, id: item.id, createdBy: item.createdBy}));
        setDrafts(remappedData);
      } catch (error) {
        console.error('Failed to load drafts:', error);
      } finally {
        setDraftsLoading(false);
      }
    };

    loadDrafts();
  }, []);

  useEffect(() => {
    if (!draftsLoading) {
      const filteredDrafts = drafts.filter((spec) =>
        spec.access?.some((user) => user === props?.user?.email)
      );
      dispatch(myDraftsActions.setDrafts(filteredDrafts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftsLoading]);

  const handleRowClick = (draft) => {
    if (draft?.selectedPrice?.id) {
      dispatch(appActions.setSelectedUser(draft.selectedPrice.id));
    }

    console.log("DRAAA", draft)
    dispatch(newSpecActions.setSpecification(draft));
    history.push({ pathname: `/new` });
  };

  const handleClose = () => {
    setDraftToDelete("");
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await draftService.delete(draftToDelete);
      
      const newDrafts = _.filter(
        draftsState,
        (draft) => draft.id !== draftToDelete
      );
      dispatch(myDraftsActions.setDrafts(newDrafts));
      setDraftToDelete("");
      setOpen(false);
      dispatch(appActions.setSnackbarSeverity("success"));
      dispatch(appActions.setSnackbarText(`Successfully deleted draft`));
      dispatch(appActions.openSnackbar());
    } catch (error) {
      dispatch(appActions.setSnackbarSeverity("error"));
      dispatch(appActions.setSnackbarText(`Failed to delete draft: ${error.message}`));
      dispatch(appActions.openSnackbar());
    } finally {
      setDeleteLoading(false);
    }
  };

  const onDeleteClick = (id, event) => {
    event.stopPropagation();
    setDraftToDelete(id);
    setOpen(true);
  };

  const renderDraftRow = (draft) => {
    return (
      <TableRow
        hover
        className={classes.tableRow}
        key={draft.id}
        onClick={() => handleRowClick(draft)}
      >
        <TableCell>{draft.name}</TableCell>
        <TableCell align="right">
          {moment(
            draft.lastSaved
              ? draft.lastSaved
              : draft.createdAt
          ).format("DD-MM-YYYY HH:mm")}
        </TableCell>
        <TableCell align="right">
          {moment(draft.createdAt).format("DD-MM-YYYY HH:mm")}
        </TableCell>

        <TableCell align="right">
          <IconButton
            onClick={(event) => onDeleteClick(draft.id, event)}
            aria-label="delete"
            color="primary"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const renderEmpty = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            align="center"
            style={{ marginTop: 48, marginBottom: 48, color: "#e31e24" }}
          >
            {t["no_drafts"]}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    if (!draftsState?.length) {
      return renderEmpty();
    }

    return (
      <React.Fragment>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">{t["last_updated"]}</TableCell>
                <TableCell align="right">{t["created_at"]}</TableCell>
                <TableCell align="right">{t["delete"]}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(draftsState, ["lastSaved"], ["desc"]).map((draft) =>
                renderDraftRow(draft)
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {renderDialog()}
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

  const renderDialog = () => {
    const draft =
      _.find(draftsState, (draft) => draft.id === draftToDelete) || {};
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${
          t["my_drafts_are_you_sure"]
        } "${draft.name || ""}"  ?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t["my_drafts_delete_text"]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t["cancel"]}</Button>
          <Button
            disabled={deleteLoading}
            onClick={handleDelete}
            style={{ color: "orangered" }}
            autoFocus
          >
            {deleteLoading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              t["delete"]
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Typography
          variant="h4"
          align="left"
          gutterBottom
          style={{ marginBottom: 24, color: "#e31e24", marginTop: 24 }}
        >
          {t["my_drafts"]}
        </Typography>

        {draftsLoading ? renderSpinner() : renderContent()}
      </main>
    </React.Fragment>
  );
}
