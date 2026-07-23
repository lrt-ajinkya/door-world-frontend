import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import getTotalPrice from '../common/totalPriceUtil';

import TranslationsContext from '../providers/translation';
import PriceContext from '../providers/price';

const useStyles = makeStyles(theme => ({
    totalPrice: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(2),
    },
}));

export default function NewSpecButtons(props) {
  const classes = useStyles();
  const newSpec = useSelector(state => state.newSpec)

  const t = useContext(TranslationsContext)
  const p = useContext(PriceContext)
  
  return (
    <React.Fragment>
        <div className={classes.totalPrice}>
          {t['total_price']} &nbsp;
          <b>{`${getTotalPrice(props.spec ? props.spec : newSpec, p)} EUR`}</b>
        </div>
    </React.Fragment>
  );
}
