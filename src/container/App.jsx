import React from "react";
import log from "electron-log";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AppLayout } from "../component/AppLayout";
import actions from "../action";
import * as selectors from "../selector/selectors";
import { E_GIT_SYNC_RESPONSE } from "constant";
import { ipcRenderer } from "electron";

const GREETINGS = [ "Greetings",
        "Hi there",
        "How's everything?",
        "How are things?",
        "Good to see you",
        "Great to see you",
        "Nice to see you",
        "How have you been?",
        "Nice to see you again.",
        "Greetings and salutations!",
        "How are you doing today?",
        "What have you been up to?",
        "How are you feeling today?"
      ],

      // Mapping state to the props
      mapStateToProps = ( state ) => ({
        store: state,
        selector: {
          getTargetDataTable: () => selectors.getTargetDataTable( state.suite.targets ),
          getGroupDataTable: () => selectors.getStructureDataTable( state.suite.groups, "group" ),
          getTestDataTable: ( group ) => selectors.getStructureDataTable( group.tests, "test" ),
          getSelectedTargets: ( selection ) => selectors.getSelectedTargets( selection, state.suite.targets ),
          hasTarget: ( target ) => selectors.hasTarget( target, state.suite.targets ),
          getSnippets: () => selectors.getSnippets( state.snippets )
        }
      }),
      // Mapping actions to the props
      mapDispatchToProps = ( dispatch ) => ({
        action: bindActionCreators( actions, dispatch )
      });

@connect( mapStateToProps, mapDispatchToProps )
export class App extends React.Component {

  static propTypes = {
    action: PropTypes.shape({
      loadProject: PropTypes.func.isRequired,
      loadSettings: PropTypes.func.isRequired,
      loadProjectFiles: PropTypes.func.isRequired,
      checkRuntimeTestDirReady: PropTypes.func.isRequired,
      checkNewVersion: PropTypes.func.isRequired,
      setApp: PropTypes.func.isRequired,
      checkGit: PropTypes.func.isRequired,
      loadGit: PropTypes.func,
      loadSnippets: PropTypes.func.isRequired
    }),
    store: PropTypes.object,
    selector: PropTypes.object
  }

  onSyncResponse = () => {
    this.props.action.loadProject();
    this.props.action.setApp({ loading: false });
  }

  async componentDidMount() {
    const { loadProject,
            checkGit,
            loadSettings,
            checkRuntimeTestDirReady,
            checkNewVersion,
            setApp,
            loadGit
          } = this.props.action,
          settings = loadSettings();


    ipcRenderer.removeAllListeners( E_GIT_SYNC_RESPONSE );
    ipcRenderer.once( E_GIT_SYNC_RESPONSE, this.onSyncResponse );

    setApp({ greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length ) ] });
    checkRuntimeTestDirReady();
    checkNewVersion();

    // from storage
    loadGit();

    if ( !settings.projectDirectory ) {
      return;
    }


    try {
      await loadProject();
    } catch ( e ) {
      log.warn( `Renderer process: App.loadProject: ${ e }` );
      console.warn( e );
    }

    try {
      await checkGit( settings.projectDirectory );
    } catch ( e ) {
      log.warn( `Renderer process: App.checkGit: ${ e }` );
    }

  }

  render() {
    const { action, store, selector } = this.props;
    return (
      <AppLayout action={ action } store={ store } selector={ selector } />
    );
  }
}
