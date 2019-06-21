import log from "electron-log";
import fs from "fs";
import { join } from "path";
import { createActions } from "redux-actions";
import { handleException, saveProject } from "./helpers";
import debounce from "lodash.debounce";
import { InvalidArgumentError } from "error";
import { validate } from "bycontract";
import * as I from "interface";
import errorActions from "./error";
import {
  getProjectFiles,
  readProject,
  copyProject,
  isGitInitialized  } from "../service/io";
import { ipcRenderer } from "electron";
import { E_FILE_NAVIGATOR_UPDATED, E_WATCH_FILE_NAVIGATOR, SNIPPETS_FILENAME,
  E_PROJECT_LOADED, E_SUITE_LIST_UPDATED } from "constant";
import settingsActions from "./settings";
import appActions from "./app";
import gitActions from "./git";
import suiteActions from "./suite";

/*eslint no-empty: 0*/

const actions = createActions({
  SET_PROJECT: ( project ) => validate( project, I.PROJECT_OPTIONS ),
  ADD_ENV: ( env ) => env,
  REMOVE_ENV: ( env ) => env,
  UPDATE_PROJECT_PANES: ( panel, panes ) => ({ panel, panes })
});

// PROJECT

actions.loadProject = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  let project;
  if ( !projectDirectory ) {
    throw new InvalidArgumentError( "Empty project directory" );
  }
  try {
    dispatch( appActions.setApp({ loading: true }) );
    project = await readProject( projectDirectory );
    ipcRenderer.send( E_PROJECT_LOADED, projectDirectory );

    directory && dispatch( settingsActions.saveSettings({ projectDirectory }) );
    dispatch( actions.setProject( project ) );
    dispatch( gitActions.loadGit( projectDirectory ) );
    await dispatch( actions.loadProjectFiles( projectDirectory ) );
    await dispatch( actions.watchProjectFiles( projectDirectory ) );

    // keep track of recent projects
    dispatch( settingsActions.addSettingsProject({
      dir: projectDirectory,
      name: project.name
    }) );
    dispatch( settingsActions.saveSettings() );

    dispatch( gitActions.setGit({ initialized: isGitInitialized( projectDirectory ) }) );

  } catch ( err ) {
    log.warn( `Renderer process: actions.loadProject(${projectDirectory }): ${ err }` );
  } finally {
    dispatch( appActions.setApp({ loading: false }) );
  }

  if ( project.lastOpenSuite && fs.existsSync( join( projectDirectory, project.lastOpenSuite ) )) {
    await dispatch( suiteActions.openSuiteFile( project.lastOpenSuite, { silent: true  }) );
  } else {
    const files = getState().app.project.files;
    log.warn( `Last open suite is unreachable, so lt's try loading the first available` );
    if ( !files.length ) {
      return project;
    }
    await dispatch( suiteActions.openSuiteFile( files[ 0 ], { silent: true  }) );
  }

  return project;
};

actions.watchProjectFiles = ( directory = null ) => async ( dispatch, getState ) => {
  const projectDirectory = directory || getState().settings.projectDirectory;
  // We have to subscribe every time, because it's bound to EVENt sent with ipcRenderer.send
  ipcRenderer.removeAllListeners( "E_FILE_NAVIGATOR_UPDATED" );
  ipcRenderer.on( E_FILE_NAVIGATOR_UPDATED, debounce( () => {
    dispatch( actions.loadProjectFiles( projectDirectory ) );
  }, 300 ) );
  ipcRenderer.send( E_WATCH_FILE_NAVIGATOR, projectDirectory );
};

actions.loadProjectFiles = ( directory = null ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          projectDirectory = directory || store.settings.projectDirectory,
          files = ( await getProjectFiles( projectDirectory ) )
            .filter( file => file !== SNIPPETS_FILENAME );

    ipcRenderer.send( E_SUITE_LIST_UPDATED, projectDirectory, store.suite.filename, files );
    dispatch( appActions.setApp({ project: { files }}) );
  } catch ( ex ) {
    handleException( ex, dispatch, "Cannot load project files" );
  }

};

actions.saveProject = () => async ( dispatch, getState ) => {
  try {
    const store = getState();
    await saveProject( store );
  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Cannot save project",
      description: e.message
    }) );
  }
};


actions.updateProject = ({ projectDirectory, name } = {}) => async ( dispatch ) => {
  try {
    if ( !name ) {
      throw new InvalidArgumentError( "Empty project name" );
    }
    if ( !projectDirectory ) {
      throw new InvalidArgumentError( "Empty project directory" );
    }

    await dispatch( actions.setProject({ projectDirectory, name }) );
    // keep track of recent projects
    dispatch( settingsActions.addSettingsProject({
      dir: projectDirectory,
      name: name
    }) );
    dispatch( settingsActions.saveSettings({ projectDirectory }) );
    await dispatch( actions.saveProject() );
    await dispatch( actions.loadProjectFiles( projectDirectory ) );
    await dispatch( actions.watchProjectFiles( projectDirectory ) );
    // why?!
    // await dispatch( appActions.removeAppTab( "suite" ) );

  } catch ( e ) {
    dispatch( errorActions.setError({
      visible: true,
      message: "Cannot update project",
      description: e.message
    }) );
  }
};


actions.copyProjectTo = ( targetDirectory ) => async ( dispatch, getState ) => {
  try {
    const store = getState(),
          sourceDirectory = store.settings.projectDirectory;
    if ( !sourceDirectory ) {
      return;
    }
    copyProject( sourceDirectory, targetDirectory );
    await dispatch( settingsActions.saveSettings({ projectDirectory: targetDirectory }) );
    await dispatch( actions.loadProject() );
  } catch ( ex ) {
    handleException( ex, dispatch, `Cannot copy to ${ targetDirectory }` );
  }

};


export default actions;