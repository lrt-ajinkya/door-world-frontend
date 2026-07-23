import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import userService from './services/userService';

import PriceTable from './components/PriceTable';
import TotalPrice from './components/TotalPrice';

import NewSpecButtons from './components/NewSpecButtons';

export default function Price(props) {
  const state = useSelector(state => state.newSpec)
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setUserDataLoading(true);
        const data = await userService.getUser(props.user.uid);
        setUserData(data);
        if (data?.selected_logo) {
          setSelectedLogo(data.selected_logo);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setUserDataLoading(false);
      }
    };

    if (props.user?.uid) {
      loadUserData();
    }
  }, [props.user?.uid])

  const isDisabled = () => {
    return false
  }

  return (
    <React.Fragment>
      <PriceTable state={state} canEditNote={true} selectedLogo={selectedLogo}/>

      <TotalPrice />
      <NewSpecButtons users={props.users} isAdmin={props.isAdmin} disabled={isDisabled()}/>
    </React.Fragment>
  );
}
