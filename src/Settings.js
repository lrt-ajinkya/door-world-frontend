import React, { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';


import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Grid from '@material-ui/core/Grid';
import ListboxComponent from './components/ListBox';

import TranslationsContext from './providers/translation';
import apiService from './services/apiService';
import logoService from './services/logoService';
import { getImageUrl } from './utils/imageUtils';

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
    marginLeft: 4
},
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

const DEFAULT_LOGOS = [
  { id: 'none', filename: 'None', path: '' },
  { id: 'doorworld', filename: 'Door World', path: '/logos/doorworld.png'}
]

export default function Settings(props) {
  const classes = useStyles()
  
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [userData, setUserData] = useState({ selected_logo: null, logos: [] });
  const [userDataLoading, setUserDataLoading] = useState(true);
  const t = useContext(TranslationsContext)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = apiService.getCurrentUser();
        if (currentUser) {
          // Load user details and uploaded logos in parallel
          const [userDetails, uploadedLogos] = await Promise.all([
            apiService.users.getDetails(currentUser.id),
            logoService.getLogos()
          ]);
          
          setUserData(userDetails);
          
          // Combine default logos with uploaded logos
          const allLogos = [...DEFAULT_LOGOS, ...uploadedLogos.data];
          const selectedLogoId = userDetails.selected_logo || DEFAULT_LOGOS[0].id;
          const foundLogo = allLogos.find(logo => logo.id === selectedLogoId) || DEFAULT_LOGOS[0];
          
          setSelectedLogo(foundLogo);
          setLogos(allLogos);
        } else {
          setSelectedLogo(DEFAULT_LOGOS[0]);
          setLogos(DEFAULT_LOGOS);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        setSelectedLogo(DEFAULT_LOGOS[0]);
        setLogos(DEFAULT_LOGOS);
      } finally {
        setUserDataLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateSelectedLogo = async () => {
    setLoading(true);
    try {
      const currentUser = apiService.getCurrentUser();
      if (currentUser) {
        const updatedData = {
          ...userData,
          selected_logo: selectedLogo.id
        };
        await apiService.users.update(currentUser.id, currentUser.displayName, currentUser.email, updatedData);
        setUserData(updatedData);
      }
    } catch (error) {
      console.error('Failed to update selected logo:', error);
    } finally {
      setLoading(false);
    }
  }

  const onSaveClick = () => {
    updateSelectedLogo()
  }

  const deleteLogo = async (logoId) => {
    try {
      setLoading(true);
      await logoService.deleteLogo(logoId);
      
      // Refresh logos list
      const uploadedLogos = await logoService.getLogos();
      const allLogos = [...DEFAULT_LOGOS, ...uploadedLogos.data];
      setLogos(allLogos);
      
      // If deleted logo was selected, switch to default
      if (selectedLogo.id === logoId) {
        setSelectedLogo(DEFAULT_LOGOS[0]);
        const currentUser = apiService.getCurrentUser();
        if (currentUser) {
          const updatedData = {
            ...userData,
            selected_logo: DEFAULT_LOGOS[0].id
          };
          await apiService.users.update(currentUser.id, currentUser.displayName, currentUser.email, updatedData);
          setUserData(updatedData);
        }
      }
    } catch (error) {
      console.error('Failed to delete logo:', error);
      setUploadError('Failed to delete logo');
    } finally {
      setLoading(false);
    }
  };

  const logoOption = (logo) => {
    const isUploadedLogo = !DEFAULT_LOGOS.find(defaultLogo => defaultLogo.id === logo.id);
    
    return (
      <div key={logo.id} style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logo.filename}
          {logo.path ? <img alt="logo" src={getImageUrl(logo.path)} style={{marginLeft: 8}} height="20px" width="auto"/> : null}
        </div>
        {isUploadedLogo && (
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              deleteLogo(logo.id);
            }}
            disabled={loading}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    )
  }

  const renderLogoSelect = () => {
    return (
      <Grid item xs={3} style={{display: 'flex', alignItems: 'center'}}>
        <Autocomplete
          value={selectedLogo}
          style={{ flex: 1 }}
          id="selected-logo"
          disableListWrap
          ListboxComponent={ListboxComponent}
          options={logos}
          getOptionLabel={(logo) => logo.filename}
          onChange={(event, value, reason) => setSelectedLogo(value)}
          renderInput={(params) => <TextField {...params} label={t['logo']} variant="outlined" />}
          renderOption={logoOption}
        />
        {renderSelectedLogo()}
      </Grid>     
    )
  }


  const renderLogoSettingsHeader = () => {
    return (
      <React.Fragment>
        <Typography variant="h5" align="left" gutterBottom style={{color: '#e31e24', marginTop: 24}}>
          {t['logo']}
        </Typography>
        <Typography variant="subtitle1" align="left" gutterBottom style={{marginBottom: 24, color: 'rgba(0, 0, 0, 0.54)' }}>
          {t['logo_settings_subtext']}
        </Typography>
      </React.Fragment>
    )
  }

  const renderUploadError = () => {
    if (uploadError) {
      return (
      <p style={{ color: 'red' }}>{uploadError}</p>
      )
    }
    return null
  }

  const renderLogoSettings = () => {
    return (
      <React.Fragment>
        <Grid item xs={12}>
          {renderLogoSettingsHeader()}
        </Grid>
        <Grid item xs={12}>
          {renderLogoSelect()}
        </Grid>
        <Grid item xs={12}>
          {renderUploadButton()}
          {renderUploadError()}
        </Grid>
      </React.Fragment>
    )
  }

  const renderContent = () => {
    return (
      <Grid container spacing={3}>
        {renderLogoSettings()}
        {renderButtons()}
      </Grid>
    )
  }

  const renderSpinner = () => {
    return (
      <div className={classes.spinner}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const handleFileUpload = () => {
    setLoading(true);
    setUploadError('');
  }

  const handleFileUploadError = (error) => {
    setLoading(false);
    setUploadError("Error uploading file");
    console.error("Error uploading file", error);
  }


  const handleFileUploadSuccess = (uploadResult) => {
    // Auto-select the newly uploaded logo and update user preferences
    const updateLogoSelection = async () => {
      try {
        const currentUser = apiService.getCurrentUser();
        if (currentUser && uploadResult) {
          const updatedData = {
            ...userData,
            selected_logo: uploadResult.id
          };
          
          await apiService.users.update(currentUser.id, currentUser.displayName, currentUser.email, updatedData);
          
          // Refresh the logos list
          const uploadedLogos = await logoService.getLogos();
          const allLogos = [...DEFAULT_LOGOS, ...uploadedLogos.data];
          setLogos(allLogos);
          console.log("ALLES", allLogos)
          const newLogo = uploadedLogos.data.find(logo => logo.id === uploadResult.id);
          if (newLogo) {
            setSelectedLogo(newLogo);
          }
          
          setUserData(updatedData);
        }
      } catch (error) {
        console.error('Failed to update logo selection:', error);
        setUploadError('Logo uploaded but failed to set as selected');
      } finally {
        setLoading(false);
        setUploadedFileName('');
      }
    };
    
    updateLogoSelection();
  }


  const renderUploadButton = () => {
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Please select an image file');
          return;
        }
        
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('File size must be less than 5MB');
          return;
        }
        
        handleFileUpload();
        try {
          const uploadResult = await logoService.uploadLogo(file);
          setUploadedFileName(uploadResult);
          handleFileUploadSuccess(uploadResult);
        } catch (error) {
          handleFileUploadError(error);
        }
      }
    };

    return (
      <Button
        variant="contained"
        color="secondary"
        component="label"
        disabled={loading}
      >
        {loading
          ? <CircularProgress color="secondary" size={24} />
          : t['upload_logo']
        }
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={handleFileChange}
        />
      </Button>
    )
  }

  const renderSelectedLogo = () => {
    console.log(selectedLogo)
    return (
      <div style={{ height: 56, display: 'flex', alignItems: 'center' }}>
        {selectedLogo.path ? <img alt="logo" src={getImageUrl(selectedLogo.path)} style={{marginLeft: 8}} height="20px" width="auto"/> : null}
      </div>
    )
  }

  const renderButtons = () => {
    return (
      <React.Fragment>
          <div className={classes.buttons}>
              {/* <Button
                variant="contained"
                color="primary"
                onClick={event => onResetClick(event)}
                className={classes.button}
              >
                {t['reset']}
              </Button> */}
              <Button
                disabled={loading}
                variant="contained"
                color="primary"
                onClick={event => onSaveClick(event)}
                className={classes.button}
              >
                {loading
                  ? <CircularProgress color="primary" size={24} />
                  : t['save']
                }
              </Button>
          </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
        <main className={classes.layout}>
            <Typography variant="h4" align="left" gutterBottom style={{marginBottom: 24, color: '#e31e24', marginTop: 24}}>
              {t['settings']}
            </Typography>

            {!userDataLoading && selectedLogo ? renderContent() : renderSpinner()}

        </main>
    </React.Fragment>
  );
}
