import { Observable } from 'rxjs/Observable';
import { PlacesActionTypes as types, LabelAction } from '../actions/maps.action';

const initialState = {
  data: {
    ROOM_1: {}
  },
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
  let roomId;
  let placeName;
  let roomplaces = roomId in state.data ? { ...state.data[roomId] } : {};
  let roomsWithplaces = { ...state.data };
  switch (action.type) {
    case types.ADD_PLACE:
      roomId = `ROOM_1`;
      placeName = payload.name;
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
    case types.REMOVE_PLACE:
      roomId = `ROOM_1`;
      placeName = payload;

      delete roomplaces[placeName];
      roomsWithplaces[roomId] = { ...roomplaces };
      return {
        ...state,
        data: {
          ...roomsWithplaces
        }
      };
    default:
      return state;
  }
}

export function getPlaces(state$) {
  return state$.select(s => s.places.data);
};


