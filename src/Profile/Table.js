import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    
  },
  DivTable: {
    width:'auto',
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "5%",
  }
});

function createData(name, content) {
  return { name, content };
}

const rows = [
    createData('Total Games', 159),
    createData('Best Score', 237),
    createData('Best Category', 'History'),
    createData('Worst Category', 'Geography'),
    createData('Best Ranking', 35),
];

export default function DenseTable() {
  const classes = useStyles();

  return (
    <div className={classes.DivTable}>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}