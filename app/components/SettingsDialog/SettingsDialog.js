import React, { Component } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import Slide from 'material-ui/transitions/Slide';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import FolderOpen from 'material-ui-icons/FolderOpen';
import IconButton from 'material-ui/IconButton';
import electronConfig from 'electron-config';
import fs from 'fs';
import electronApp from 'electron';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actions';
import { withStyles } from 'material-ui/styles';
import styles from './SettingDialogStyles';



function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class SettingsDialog extends Component {

  config = new electronConfig();

  state = {
    downloadPath: this.config.get('downloadPath'),
    error: null,
    errorText: null
  };

  saveDialogSettings = () => {

    try {
      if (fs.lstatSync(this.state.downloadPath).isDirectory()) {
        this.config.set('downloadPath', this.state.downloadPath);
        this.props.handleClose();
      }
    } catch (e) {
      this.setState({ error: true });
      console.error(`Invalid diretory : ${this.state.downloadPath}`);
    }


  };

  handleChange = (e) => {
    this.setState({ error: null });
    this.setState({ downloadPath: e.target.value });
  };

  openFolderSelectDialog = () => {
    electronApp.remote.dialog.showOpenDialog({ properties: ['openDirectory'] },
      (path) => {
        if (path == null) return;
        this.config.set('downloadPath', path[0]);
        this.setState({ downloadPath: path[0] });
      });
  }

  clearDownloadHistory = () => {
    this.props.clearHistoryCreator();
    //remove from state
  }

  render() {

    return (
      <Dialog
        open={this.props.show}
        transition={Transition}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        autoscrollbodycontent="true"
        maxWidth='md'
        contentstyle={{ width: 400 }}
      >
        <DialogTitle >
          Settings
        </DialogTitle>
        <DialogContent style={{ width: 400 }}>
          <Grid container spacing={8}>
            <Grid xs={12} item>
              <TextField
                id="name"
                label="Save my videos here"
                value={this.state.downloadPath}
                onChange={this.handleChange}
                margin="normal"
                style={{ width: 300 }}
                error={this.state.error}
              />

              <IconButton onClick={this.openFolderSelectDialog}>
                <FolderOpen />
              </IconButton>


            </Grid>
            <Grid xs={12} item>

              <Typography style={{ paddingBottom: 5 }} variant="caption" align="left">
                History
              </Typography>

              <Button size="small" onClick={() => this.clearDownloadHistory()} fullWidth variant="raised" color="secondary">
                Clear local download history
              </Button>

            </Grid>
            {/* <Grid xs={12} item>
            <Typography>
              <a onClick={() => openLinkExternal()} href="https://github.com/vanzylv/youtube-downloader-electron">Help out on GitHub</a>
            </Typography>

          </Grid> */}
          </Grid>


        </DialogContent>
        <DialogActions>
          <Button onClick={this.saveDialogSettings} color="primary">
            save
          </Button>
          <Button onClick={this.props.handleClose} color="primary">
            cancel
          </Button>
        </DialogActions>
      </Dialog >
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    clearHistoryCreator: () => dispatch(actionCreators.clearHistoryCreator()),
  };
};

export default connect(null, mapDispatchToProps)(withStyles(styles)(SettingsDialog));


