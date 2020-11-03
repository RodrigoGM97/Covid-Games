import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { render } from '@testing-library/react';


class UserData extends React.Component {
  constructor(props) {
    //console.log("Printing my props : ", props);
    super(props);

    this.state = {
      username: ''
    };
  }
  async getUserInfo()
    { 
      //console.log("Setting user info");
      let var1
      return new Promise((resolve,reject)=>
      {
        var1 = Auth.currentAuthenticatedUser();
        //console.log("en la promesa, ", var1)
        resolve(var1);
      }).then(userinfo=>{
        return userinfo.username;
      })
      //return await user.username;

  }
  async  printUserData()
  {
    //console.log(await test_obj.getUserInfo());
    return await this.getUserInfo().then((username)=>{
      //console.log("The username is " + username);
      return username;
    })
  }
  async fetchdata()
  {
    var obj_data = 
    {
      "triggerSource": "testTrigger",
      "userPoolId": "testPool",
      "userName": await this.printUserData().then((data)=>{return data}),
      "callerContext": {
        "clientId": "12345"
      },
      "response": {}
    }

    //console.log(await obj_data);
    return await axios.post('https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Tables/getMySeasonTable', await obj_data ).then(resp => {
            //console.log("My msg answer was ", resp.data);
            
            return resp.data;

            }).catch(error =>{console.log(error)});   
  }

  async  createRowArray(){
    let data = await this.fetchdata().then(info=>{
      return info;
    })
    //console.log("my data was: ", JSON.parse(data));
    let row_data =  await JSON.parse(data);
    return await this.createRows(await row_data);
  }
   createRows(data){
    var row_info =[];
    for (const row of data)
    {
      row_info.push(createData(row.TOPIC, row.SCORE, row.DAYS_REMAINING, row.PERIOD_ID))
      //console.log("My row: ", row);
    }
    //console.log("My ending row data: ", row_info);

    return row_info;
  }
}

class TableData extends React.Component {
  constructor(props) {
    //console.log("Printing my props : ", props);
    super(props);
    this.state = {
      rowInfo : []
    }
    
  }
  async componentDidMount()
  {
      console.log("Estoy en el componentDidMount");
      let bringInfo  = await this.fetchData().then(data=>{return data});
      console.log("Bring info tiene: ", bringInfo);
      this.setState({'rowInfo': await bringInfo});
      
      console.log("my state: ", this.state);
  }
  async fetchData()
  {
    let fetch_obj = new UserData();
    let info = await fetch_obj.createRowArray().then(data=>{
      return data;
    });
    return await info;
  }
}

function createData(topic, points, daysRemaining, seasonID) {
  return { topic, points, daysRemaining, seasonID };
}

function susribeToSeason(row) {
  console.log(row)
}

const rows = [];

async function dataToRow() {
  
  let data = new TableData();
  let promiseData = data.fetchData()
  promiseData.then((value) => {
    console.log(value);
    for (const row of value)
    {
      rows.push(row)
    }

    //rows.push(value)
    console.log("Hola",rows)  
  })
  
  return await true;
}
dataToRow()



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'topic', numeric: true, disablePadding: false, label: 'Topic' },
  { id: 'points', numeric: true, disablePadding: false, label: 'Points' },
  { id: 'daysRemaining', numeric: true, disablePadding: false, label: 'Days remaining' },
  { id: 'play', numeric: true, disablePadding: false, label: '' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          My Seasons
        </Typography>
      )}

    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'auto',
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(5)
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  menuItem: {
    width:"50%",
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));



//export default TableData;


 function EnhancedTable() {
  
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Points');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [test, setTest] = React.useState(0);
  
    useEffect(() => {
      setTest();
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length}  />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                
                  return (
                    <TableRow
                      hover
                      key={row.topic}
                    >
                      <TableCell component="th" id={labelId} scope="row" align="center">
                        {row.topic}
                      </TableCell>
                      <TableCell align="center">{row.points}</TableCell>
                      <TableCell align="center">{row.daysRemaining}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => susribeToSeason(row)}>Play</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

export default EnhancedTable;