import { Observable } from 'rxjs/Observable';
import { PlacesActionTypes as types, LabelAction } from '../actions/maps.action';

const initialState = {
  data: {},
  lastAction: null,
}
const room = (state, action) => {
  switch (action.type) {
    case types.ADD_PLACE:
      return {
        ...action.payload
      };
    default:
      return state;
  }
};

export function reducer(state = initialState, action) {
  let payload = action.payload;
  switch (action.type) {
    case types.ADD_PLACE:
      const roomId = `ROOM_1`;
      const placeName = payload.name;
      const roomplaces = roomId in state.data ? { ...state.data[roomId] } : {};
      let roomsWithplaces = { ...state.data };
      if (placeName in roomplaces) {
        return state;
      }
      roomplaces[placeName] = room(undefined, action);
      roomsWithplaces[roomId] = { ...roomplaces };
      return {
        ...state,
        data: {
          ...roomsWithplaces
        }
      };
  }
}

export function getPlaces(state$) {
  return state$.select(s => s.places);
};


