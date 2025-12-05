import appGlobalReducer from '../slices/appGlobal.slide';
import sessionReducer from '../slices/session.slice';
import listenReducer from '../slices/listen.slice';
import audioSrcReducer from '../slices/audioSrc.slice';
import representReducer from '../slices/represent.slice';
const rootReducer = {
  appGlobal: appGlobalReducer,
  session: sessionReducer,
  listen: listenReducer,
  audioSrc: audioSrcReducer,
  represent: representReducer,
};

export default rootReducer;
