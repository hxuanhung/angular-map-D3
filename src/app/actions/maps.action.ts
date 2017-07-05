import { Action } from '@ngrx/store';
export const PlacesActionTypes = {
  ADD_PLACE: 'ADD PLACE',
  REMOVE_PLACE: 'REMOVE PLACE',
};

export class addPlaceAction implements Action {
  type = PlacesActionTypes.ADD_PLACE;
  constructor(public payload?: Object) { }
}
export class removePlaceAction implements Action {
  type = PlacesActionTypes.REMOVE_PLACE;
  constructor(public payload?: string) { }
}

export type LabelAction =
  addPlaceAction | removePlaceAction;
