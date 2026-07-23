import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import authService from './services/authService';
import specificationService from './services/specificationService';
import userService from './services/userService';
import * as appActions from './actions/appActions';
import * as mySpecActions from './actions/mySpecificationsActions';
import * as newSpecificationActions from './actions/newSpecificationActions';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Autocomplete from '@material-ui/lab/Autocomplete';
import ListboxComponent from './components/ListBox';

import TranslationsContext from './providers/translation';
import PriceContext from './providers/price';

import {
  useHistory,
} from "react-router-dom";

import getTotalPrice from './common/totalPriceUtil';

import moment from 'moment';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(2),
    },
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 48,
    marginBottom: 48,
  },
  tableRow: {
      cursor: 'pointer',
  },
}));

export default function MySpecifications(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  let history = useHistory()

  const [open, setOpen] = useState(false)
  const [copyOpen, setCopyOpen] = useState(false)
  const [specToDelete, setSpecToDelete] = useState('')
  const [specToCopy, setSpecToCopy] = useState('')
  const [specToCopyNewName, setSpecToCopyNewName] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})

  const user = authService.getCurrentUser();
  const specs = useSelector(state => state.mySpecs.specifications)
  const language = useSelector(state => state.navigation.language)

  const [specifications, setSpecifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [specificationsLoading, setSpecificationsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const t = useContext(TranslationsContext)
  const p = useContext(PriceContext)

  useEffect(() => {
    const loadSpecifications = async () => {
      try {
        setSpecificationsLoading(true);
        const data = await specificationService.getAll();
        const remappedData = data.map(item => ({...item.specification, id: item.id, createdBy: item.createdBy}));
        setSpecifications(remappedData);
      } catch (error) {
        console.error('Failed to load specifications:', error);
      } finally {
        setSpecificationsLoading(false);
      }
    };

    loadSpecifications();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const data = await userService.getAll();
        setUsers(data.users || data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (!specificationsLoading) {
      const filteredSpecifications = specifications.filter((spec) => spec.createdBy === props?.user?.email);
      dispatch(mySpecActions.setSpecifications(filteredSpecifications))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specificationsLoading])

  useEffect(() => {
    if (!usersLoading) {
      const initialSelected = _.find(users, (user) => user.id === props?.user?.uid);
      if (initialSelected) {
        setSelectedUser(initialSelected)
        dispatch(appActions.setSelectedUser(initialSelected.id))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersLoading])

  const handleRowClick = specId => {
    history.push({ pathname: `/specification/${specId}`})
  }

  const handleClose = () => {
    setSpecToDelete('')
    setOpen(false)
  };

  const handleCopyClose = () => {
    setSpecToCopy('')
    setSpecToCopyNewName(``)
    setCopyOpen(false)
  };

  const onDeleteClick = (id, event) => {
    event.stopPropagation()
    setSpecToDelete(id)
    setOpen(true)
  }

  const onCopyClick = (spec, event) => {
    event.stopPropagation()
    setSpecToCopy(spec)
    setSpecToCopyNewName(`${spec.name} Copy`)
    setCopyOpen(true)
  }

  const onEditClick = (spec, event) => {
    event.stopPropagation()

    if (spec?.selectedPrice?.id) {
      dispatch(appActions.setSelectedUser(spec.selectedPrice.id))
    }

    dispatch(newSpecificationActions.setSpecification(spec, true, true))
    history.push({ pathname: `/new`})
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await specificationService.delete(specToDelete);
      const newSpecs = _.filter(specs, spec => spec.id !== specToDelete);
      dispatch(mySpecActions.setSpecifications(newSpecs));
      setSpecToDelete('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete specification:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      setCopyLoading(true);

      const copiedSpec = await specificationService.copy(specToCopy.id, specToCopyNewName);
      dispatch(mySpecActions.setSpecifications([copiedSpec, ...specs]));
      setSpecToCopy('');
      setSpecToCopyNewName('');
      setCopyOpen(false);
      
      dispatch(appActions.setSnackbarSeverity('success'));
      dispatch(appActions.setSnackbarText(`Copied specification with new name "${specToCopyNewName}"`));
      dispatch(appActions.openSnackbar());
    } catch (error) {
      dispatch(appActions.setSnackbarSeverity('error'));
      dispatch(appActions.setSnackbarText(`Failed to copy specification`));
      dispatch(appActions.openSnackbar());
    } finally {
      setCopyLoading(false);
    }
  };

  const renderSpecRow = spec => {
    let prices = p;

    if (spec?.selectedPrice?.id) {
      prices = { basePrices: spec.selectedPrice.markup, markup: null };
    }

    const date = spec?.createdAt?.seconds ? spec.createdAt.seconds * 1000 : spec.createdAt

    return (
      <TableRow
        hover
        className={classes.tableRow}
        key={spec.id}
        onClick={() => handleRowClick(spec.id)}
      >
        <TableCell component="th" scope="row"><b>{spec.name}</b></TableCell>
        <TableCell component="th" scope="row">{moment(date).format('DD-MM-YYYY HH:mm')}</TableCell>
        <TableCell align="right">{getTotalPrice(spec, prices)} EUR</TableCell>
        <TableCell align="right">
          <IconButton onClick={event => onCopyClick(spec, event)} aria-label="copy" color="primary">
            <FileCopyIcon />
          </IconButton>
          <IconButton onClick={event => onEditClick(spec, event)} aria-label="edit" color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={event => onDeleteClick(spec.id, event)} aria-label="delete" color="primary">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  const renderEmpty = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" style={{marginTop: 48, marginBottom: 48, color: '#e31e24'}}>
            {t['no_specifications']}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  const getOption = (user) => {
    if (!user || !user.id) {
      return ""
    }
    if (user.displayName) {
      return `${user.email} (${user.displayName})`
    }
    return user.email
  }

  const filterSpecs = (user) => {
    const filteredSpecs = specifications.filter((spec) => spec.createdBy === user?.email);
    dispatch(mySpecActions.setSpecifications(filteredSpecs))
  }

  const selectUser = (user) => {
    if (props?.isAdmin && user) {
      dispatch(appActions.setSelectedUser(user.id))
    }
    setSelectedUser(user);
  } 

  const renderUserSelect = () => {
    if (!props.isAdmin) return null

    const sortedUsers = _.orderBy(
      users,
      [
        user => _.get(user, 'email', '').toLowerCase()
      ]  
    )

    return (
      <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
        <Autocomplete
          value={selectedUser}
          style={{ flex: 1, margin: 8 }}
          id="selected-user"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={sortedUsers}
          getOptionLabel={(user) => getOption(user)}
          onChange={(event, value, reason) => {
            selectUser(value);
            filterSpecs(value);
          }}
          renderInput={(params) => <TextField {...params} label={t['user']} variant="outlined" />}
          renderOption={(user, index) => {
            return (
              <div style={{ height: 56, display: 'flex', alignItems: 'center' }}>
                {getOption(user)} 
              </div>
            )}}
        />
      </Grid>      
    )
  }

  const renderContent = () => {
    if (!specs?.length) {
      return (
        <React.Fragment>
          {renderUserSelect()}
          {renderEmpty()}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {renderUserSelect()}
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t['name']}</TableCell>
                <TableCell>{t['created_at']}</TableCell>
                <TableCell align="right">{t['total_amount']}</TableCell>
                <TableCell align="right">
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ marginRight: 16  }}>{t['edit']}</div>
                      <div>{t['delete']}</div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(specs, ['createdAt'], ['desc']).map(spec => renderSpecRow(spec))}
            </TableBody>
          </Table>
        </TableContainer>
        {renderDialog()}
        {renderCopyDialog()}
      </React.Fragment>
    )
  }

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const renderDialog = () => {
    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t['my_specifications.are_you_sure']}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t['my_specifications.delete_text']}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >
            {t['cancel']}
          </Button>
          <Button onClick={handleDelete} style={{ color: 'orangered'}} autoFocus>
            {deleteLoading
              ? <CircularProgress color="secondary" size={24} />
              : t['delete']
            }
          </Button>
        </DialogActions>
      </Dialog>)
  }

  const renderCopyDialog = () => {

    return (<Dialog
        open={copyOpen}
        onClose={handleCopyClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t['copy_specification']} {''} {specToCopy.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t['specification_name']}
            type="text"
            value={specToCopyNewName}
            onChange={e => setSpecToCopyNewName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyClose} >
            {t['cancel']}
          </Button>
          <Button onClick={handleCopy} color='secondary' autoFocus>
            {copyLoading
              ? <CircularProgress color="secondary" size={24} />
              : t['copy']
            }
          </Button>
        </DialogActions>
      </Dialog>)
  }

  return (
    <React.Fragment>
        <main className={classes.layout}>

            <Typography variant="h4" align="left" gutterBottom style={{marginBottom: 24, color: '#e31e24', marginTop: 24}}>
              {t['my_specifications']}
            </Typography>

            {specificationsLoading || usersLoading ? renderSpinner() : renderContent()}

        </main>
    </React.Fragment>
  );
}
