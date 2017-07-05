import { Action } from '@ngrx/store';
export const PlacesActionTypes = {
  ADD_PLACE: 'ADD PLACE',
};

export class addPlaceAction implements Action {
  type = PlacesActionTypes.ADD_PLACE;
  constructor(public payload?: Object) { }
}

export type LabelAction =
  addPlaceAction;
