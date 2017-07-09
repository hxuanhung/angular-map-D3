import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import { compose } from '@ngrx/core/compose';

import { storeFreeze } from 'ngrx-store-freeze';

import { combineReducers } from '@ngrx/store';

import * as fromMapsReducer from '../reducers';

const reducers = {
  places: fromMapsReducer.reducer,
};

export const store = {
  places: fromMapsReducer,
};

const developmentReducer = compose(storeFreeze, combineReducers)(reducers);
const productionReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (ENV === 'production') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
