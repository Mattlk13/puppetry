import settingsActions from "./settings";
import errorActions from "./error";
import appActions from "./app";
import gitActions from "./git";
import projectActions from "./project";
import suiteActions from "./suite";
import targetActions from "./target";
import groupActions from "./group";
import testActions from "./test";
import commandActions from "./command";
import snippetsActions from "./snippets";
import variableActions from "./variable";

const actions = {
  ...errorActions,
  ...settingsActions,
  ...appActions,
  ...gitActions,
  ...projectActions,
  ...suiteActions,
  ...targetActions,
  ...groupActions,
  ...testActions,
  ...commandActions,
  ...snippetsActions,
  ...variableActions
};

export default actions;