import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from './common/theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { App } from './common/components/App';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>    
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  , document.getElementById('root') as HTMLElement
);
registerServiceWorker();
