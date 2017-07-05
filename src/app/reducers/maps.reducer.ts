import { Observable } from 'rxjs/Observable';
import { PlacesActionTypes as types, LabelAction } from '../actions/maps.action';

const initialState = {
  data: [],
  lastAction: null,
}

export function reducer(state = initialState, action) {
  let payload = action.payload;
  switch (action.type) {
    case types.ADD_PLACE:
      console.log(`[Place]Add place`, state, action);
      let newData = state.data.map(place => ({ ...place }));
      newData.push(payload);
      return Object.assign({}, state, {
        data: {
          ...newData
        }
      });
    default:
      return state;
  }
}

export function getPlaces(state$) {
  return state$.select(s => s.places);
};


