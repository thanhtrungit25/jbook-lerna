import { Dispatch } from 'redux'
import { saveCells } from '../action-creators'
import { ActionType } from '../action-types'
import { Action } from '../actions'
import { RootState } from '../reducers'

let timer: any
export const persistMiddleware = ({
  dispatch,
  getState
}: {
  dispatch: Dispatch<Action>
  getState: () => RootState
}) => {
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action)

      if (
        [
          ActionType.INSERT_CELL_AFTER,
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.DELETE_CELL
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState)
        }, 250)
      }
    }
  }
}
