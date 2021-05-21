import { SET_USER, SET_PUBLICATIONS } from './actions';

function reducers(state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case SET_PUBLICATIONS:
      return {
        ...state,
        publications: action.publications,
      };
    default:
      return state;
  }
}

export default reducers;
