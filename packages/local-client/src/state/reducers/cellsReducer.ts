import produce from 'immer'
import { ActionType } from '../action-types'
import { Action } from '../actions'
import { Cell } from '../cell'

interface CellsState {
  loading: boolean
  error: string | null
  order: string[]
  data: {
    [key: string]: Cell
  }
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {}
}

const reducer = (state: CellsState = initialState, action: Action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ActionType.SAVE_CELLS_ERROR:
        draft.error = action.payload
        break
      case ActionType.FETCH_CELLS:
        draft.loading = true
        draft.error = null
        break
      case ActionType.FETCH_CELLS_COMPLETE:
        draft.order = action.payload.map((cell) => cell.id)
        draft.data = action.payload.reduce((acc, cell) => {
          acc[cell.id] = cell
          return acc
        }, {} as CellsState['data'])
        break
      case ActionType.FETCH_CELLS_ERROR:
        draft.loading = false
        draft.error = action.payload
        break

      case ActionType.UPDATE_CELL:
        const { id, content } = action.payload

        draft.data[id].content = content
        break
      case ActionType.DELETE_CELL:
        delete draft.data[action.payload]
        const idx = draft.order.findIndex((id) => id === action.payload)
        if (idx !== -1) draft.order.splice(idx, 1)
        break

      case ActionType.MOVE_CELL:
        const { direction } = action.payload
        const index = draft.order.findIndex((id) => id === action.payload.id)
        const targetIndex = direction === 'up' ? index - 1 : index + 1

        if (targetIndex < 0 || targetIndex > draft.order.length - 1) {
          break
        }

        draft.order[index] = draft.order[targetIndex]
        draft.order[targetIndex] = action.payload.id

        break
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId()
        }

        draft.data[cell.id] = cell
        const foundIndex = draft.order.findIndex(
          (id) => id === action.payload.id
        )
        if (foundIndex < 0) {
          draft.order.unshift(cell.id)
        } else {
          draft.order.splice(foundIndex + 1, 0, cell.id)
        }
        break
    }
  })
}

const randomId = () => {
  return Math.random().toString(36).substr(2, 5)
}

export default reducer
