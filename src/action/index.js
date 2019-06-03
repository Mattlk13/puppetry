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

import snippetTestActions from "./stest";
import snippetCommandActions from "./scommand";

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
  ...snippetTestActions,
  ...snippetCommandActions
};

export default actions;