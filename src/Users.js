import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import apiCalls from './common/apiCalls';
import TranslationsContext from './providers/translation';

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
  buttons: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
},
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export default function MySpecifications() {
  const classes = useStyles()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [createUserOpen, setCreateUserOpen] = useState(false)

  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [moreDataLoading, setMoreDataLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState('')
  const [moreData, setMoreData] = useState({})  

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)

  const t = useContext(TranslationsContext)

  const fetchUsers = () => {
    setUsersLoading(true)
    apiCalls.fetchUsers()
      .then(users => {
        setUsers(users)
        setUsersLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRowClick = id => {
    setSelectedUser(id)
    const selectedUserData = _.find(users, user => user.uid === id)
    setDisplayName(selectedUserData.displayName)
    setEmail(selectedUserData.email)

    setEditUserOpen(true)
    setMoreDataLoading(true)
    apiCalls.getMoreUserDetails(id)
    .then(data => {
      setMoreData(data)
    })
    .catch(e => {
      setError(e.message)
    })
    .finally(() => {
      setMoreDataLoading(false)
    })
  }

  const handleDeleteClose = () => {
    setSelectedUser('')
    setError('')
    setDeleteDialogOpen(false)
  };

  const handleCreateUserClose = () => {
    setError('')
    setSelectedUser('')
    setDisplayName('')
    setEmail('')
    setPassword('')
    setCreateUserOpen(false)
  };

  const onDeleteClick = (id, event) => {
    event.stopPropagation()
    setSelectedUser(id)
    setDeleteDialogOpen(true)
  }

  const onCreateClick = event => {
    event.stopPropagation()
    setSelectedUser('')
    setError('')
    setDisplayName('')
    setEmail('')
    setPassword('')
    setCreateUserOpen(true)
  }

  const handleEditUserClose = () => {
    setSelectedUser('')
    setError('')
    setDisplayName('')
    setEmail('')
    setPassword('')
    setEditUserOpen(false)
  };

  const handleEditSave = () => {
    setEditLoading(true)
    apiCalls.updateUser(selectedUser, displayName, email, moreData)
      .then(newUser => {
        const newUsers = users.filter(user => user.uid !== selectedUser)
        setUsers([...newUsers, newUser])
        setError('')
        setEditUserOpen(false)
      })
      .catch(e => {
        setError(e.message)
      })
      .finally(() => {
        setEditLoading(false)
      })
  }

  const handleCreate = () => {
    setCreateLoading(true)
    apiCalls.createUser(displayName, email, password)
      .then(newUser => {
        setUsers([...users, newUser])
        setError('')
        setCreateUserOpen(false)
      })
      .catch(e => {
        setError(e.message)
      })
      .finally(() => {
        setCreateLoading(false)
      })
  }

  const handleDelete = () => {
    setDeleteLoading(true)
    apiCalls.deleteUser(selectedUser)
      .then(data => {
        const newUsers = users.filter(user => user.uid !== selectedUser)
        setUsers(newUsers)
        setError('')
        setDeleteDialogOpen(false)
      })
      .catch(e => {
        setError(e.message)
      })
      .finally(() => {
        setDeleteLoading(false)
      })
  }

  const renderUserRow = user => {
    const lastSignInTime = _.get(user, 'metadata.lastSignInTime', null);
    const displayTime = lastSignInTime ? moment(lastSignInTime).format('DD-MM-YYYY HH:mm') : '';
    return (
      <TableRow
        hover
        className={classes.tableRow}
        key={user.uid}
        onClick={() => handleRowClick(user.uid)}
      >
        <TableCell component="th" scope="row">{user.displayName}</TableCell>
        <TableCell component="th" scope="row">{user.email}</TableCell>
        <TableCell align="right">{displayTime}</TableCell>
        <TableCell align="right">
          <IconButton onClick={event => onDeleteClick(user.uid, event)} aria-label="delete" color="primary">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  const renderContent = () => {
    return (
      <React.Fragment>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t['name']}</TableCell>
                <TableCell>{t['email']}</TableCell>
                <TableCell align="right">{t['last_login']}</TableCell>
                <TableCell align="right">{t['delete']}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => renderUserRow(user))}
            </TableBody>
          </Table>
        </TableContainer>
        {renderButtons()}
        {renderDeleteDialog()}
        {renderEditUserDialog()}
        {renderCreateUserDialog()}
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

  const renderDeleteDialog = () => {
    return (<Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t['users.are_you_sure']}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t['users.delete_warning_message']}
          </DialogContentText>
          {renderError()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} >
            {t['cancel']}
          </Button>
          <Button onClick={handleDelete} style={{ color: 'orangered' }} autoFocus>
            {deleteLoading
              ? <CircularProgress color="secondary" size={24} />
              : t['delete']
            }
          </Button>
        </DialogActions>
      </Dialog>)
  }

  const renderEditUserDialog = () => {
    const selectedUserData = _.find(users, user => user.uid === selectedUser) || {}
    return (<Dialog
        open={editUserOpen}
        onClose={handleEditUserClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{selectedUserData.displayName || selectedUserData.email || ""}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t['name']}
            type="name"
            onChange={e => setDisplayName(e.target.value)}
            value={displayName}
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label={t['email']}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
          />
          <div style={{marginTop: 34}} />
          {
            moreDataLoading && moreData
            ? renderSpinner()
            : renderMoreData()
          }
          {renderError()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUserClose} >
            {t['cancel']}
          </Button>
          <Button onClick={handleEditSave} color='secondary' autoFocus>
            {editLoading
              ? <CircularProgress color="secondary" size={24} />
              : t['save']
            }
          </Button>
        </DialogActions>
      </Dialog>)
  }

  const renderCreateUserDialog = () => {
    return (<Dialog
        open={createUserOpen}
        onClose={handleCreateUserClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t['users.create_new_user']}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            label={t['name']}
            type="name"
            onChange={e => setDisplayName(e.target.value)}
            value={displayName}
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label={t['email']}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label={t['password']}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
          />
          {renderError()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateUserClose} >
            {t['cancel']}
          </Button>
          <Button onClick={handleCreate} color='secondary' autoFocus>
            {createLoading
              ? <CircularProgress color="secondary" size={24} />
              : t['create']
            }
          </Button>
        </DialogActions>
      </Dialog>)
  }

  const renderError = () => {
    return (
      <DialogContentText id="alert-dialog-description" style={{ color: 'orangered'}}>
        {error}
      </DialogContentText>
    )
  }

  const renderButtons = () => {
    return (
      <React.Fragment>
          <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={event => onCreateClick(event)}
                className={classes.button}
              >
                {t['create_new']}
              </Button>
          </div>
      </React.Fragment>
    );
  }

  const handleCheckbox = (value, category) => {
    let canChangePrice = { ...moreData.canChangePrice }
    canChangePrice[category] = !value

    setMoreData({
     ...moreData,
     canChangePrice,
    })
  }

  const renderCategoryRow = (label, category, value) => {
    return (
      <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell align="right">
          <Checkbox
            value={value}
            onChange={event => handleCheckbox(event.target.value === 'true', category)}
            checked={value}
          />
        </TableCell>
      </TableRow>
    )
  }

  const renderMoreData = () => {
    const accessories = _.get(moreData, 'canChangePrice.accessories', false)
    const architraves = _.get(moreData, 'canChangePrice.architraves', false)
    const color = _.get(moreData, 'canChangePrice.color', false)
    const dimensions = _.get(moreData, 'canChangePrice.dimensions', false)
    const doorModel = _.get(moreData, 'canChangePrice.doorModel', false)
    const doorType = _.get(moreData, 'canChangePrice.doorType', false)
    const extraLocks = _.get(moreData, 'canChangePrice.extraLocks', false)
    const finishing = _.get(moreData, 'canChangePrice.finishing', false)
    const glass = _.get(moreData, 'canChangePrice.glass', false)
    const handles = _.get(moreData, 'canChangePrice.handles', false)
    const hinges = _.get(moreData, 'canChangePrice.hinges', false)
    const locks = _.get(moreData, 'canChangePrice.locks', false)
    const thresholds = _.get(moreData, 'canChangePrice.thresholds', false)
    
    return (
      <React.Fragment>
        <DialogTitle style={{ padding: 0 }} id="alert-dialog-title">{t['users.can_change_price']}</DialogTitle>
        <TableContainer>
          <Table aria-label="more data">
            <TableHead>
              <TableRow>
                <TableCell>{t['category']}</TableCell>
                <TableCell align="right">{t['enabled']}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {renderCategoryRow(t['accessories'], 'accessories', accessories)}
              {renderCategoryRow(t['architraves'], 'architraves', architraves)}
              {renderCategoryRow(t['color'], 'color', color)}
              {renderCategoryRow(t['dimensions'], 'dimensions', dimensions)}
              {renderCategoryRow(t['model'], 'doorModel', doorModel)}
              {renderCategoryRow(t['type'], 'doorType', doorType)}
              {renderCategoryRow(t['extra_locks'], 'extraLocks', extraLocks)}
              {renderCategoryRow(t['finishing'], 'finishing', finishing)}
              {renderCategoryRow(t['glass'], 'glass', glass)}
              {renderCategoryRow(t['handles'], 'handles', handles)}
              {renderCategoryRow(t['hinges'], 'hinges', hinges)}
              {renderCategoryRow(t['locks'], 'locks', locks)}
              {renderCategoryRow(t['thresholds'], 'thresholds', thresholds)}
              
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
        <main className={classes.layout}>
            <Typography variant="h4" align="left" gutterBottom style={{marginBottom: 24, color: '#e31e24', marginTop: 24}}>
              {t['users']}
            </Typography>

            {usersLoading ? renderSpinner() : renderContent()}

        </main>
    </React.Fragment>
  );
}
