import produce from 'immer'
import { ActionType } from '../action-types'
import { Action } from '../actions'

interface BundlesState {
  [key: string]:
    | {
        loading: boolean
        code: string
        err: string
      }
    | undefined
}

const initialState: BundlesState = {}

const reducer = (
  state: BundlesState = initialState,
  action: Action
): BundlesState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        draft[action.payload.cellId] = {
          loading: true,
          code: '',
          err: ''
        }
        break
      case ActionType.BUNDLE_COMPLETE:
        draft[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err
        }
        break
    }
  })
}

export default reducer
