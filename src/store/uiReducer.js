import * as allActions from './actionTypes';

export default function ui(state = { matchTheCards: { frontSideIndex: -1, backSideIndex: -1 } }, action) {
  switch (action.type) {
    case allActions.UPDATE_MTC_FRONT_INDEX:
      return { ...state, matchTheCards: {...state.matchTheCards, frontSideIndex: action.index }};

    case allActions.UPDATE_MTC_BACK_INDEX:
      return { ...state, matchTheCards: {...state.matchTheCards, backSideIndex: action.index } };

    default:
      return state;
  }
}
