import React from 'react';
import {Snackbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {snackbarActions} from '../../redux/snackbar';
import Icons from '../Icons';

export default function Roster(props) {
  const dispatch = useDispatch();
  const {text, open} = useSelector(state => state.snackbar);

  return (
    <Snackbar
      visible={open}
      onDismiss={() => dispatch(snackbarActions.closeSnackbar())}
      action={{
        label: <Icons color="#fff" name="close" />,
        onPress: () => {
          dispatch(snackbarActions.closeSnackbar());
        },
      }}>
      {text}
    </Snackbar>
  );
}
