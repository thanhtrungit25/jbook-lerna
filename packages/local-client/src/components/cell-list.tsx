import './cell-list.css'
import { Fragment, useEffect } from 'react'
import { useTypedSelector } from '../hooks/use-typed-selector'
import AddCell from './add-cell'
import CellListItem from './cell-list-item'
import { useActions } from '../hooks/use-actions'

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { data, order } }) =>
    order.map((id) => data[id])
  )
  const { fetchCells } = useActions()

  useEffect(() => {
    fetchCells()
  }, [])

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <AddCell previousCellId={cell.id} />
      <CellListItem key={cell.id} cell={cell} />
    </Fragment>
  ))

  return (
    <div className='cell-list'>
      {renderedCells}
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
    </div>
  )
}

export default CellList
