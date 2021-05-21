
import { memo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.custom.palette.lightBlue
  },
  pairs: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  locked: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    width: 140
  },
}));

const TableContainer = ({
  className,
  children
}) => {
  const classes = useStyles()
  return (
    <Table aria-label='table' className={className}>
      <TableHead className={classes.header}>
        <TableRow>
          <TableCell className={classes.pairs}>
            Pairs
          </TableCell>
          <TableCell
            align='right'
            className={classes.locked}
          >
            Locked
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  )
}

export default memo(TableContainer)