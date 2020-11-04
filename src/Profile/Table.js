import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { Auth } from 'aws-amplify';

export default class DenseTable extends React.Component {
  constructor(props) {
    //console.log("Printing my props : ", props);
    super(props);
    
    this.state = {
      username: '',
      rowinfo: []
    };
  }
  async componentDidMount(){
    let data = await this.createRowArray().then(info=>{return info});
    await data;
    this.setState({'rowinfo': await data});
   
  }
  async getUserInfo()
    { 
     
      let var1
      return new Promise((resolve,reject)=>
      {
        var1 = Auth.currentAuthenticatedUser();
      
        resolve(var1);
      }).then(userinfo=>{
        localStorage.setItem('user', userinfo.username);
        return userinfo.username;
      })
   

  }
  async  printUserData()
  {

    return await this.getUserInfo().then((username)=>{
    
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
    return await axios.post('https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Tables/getProfileTable', await obj_data ).then(resp => { 
            return resp.data;

            }).catch(error =>{console.log(error)});   
  }

  async  createRowArray(){
    let data = await this.fetchdata().then(info=>{
      return info;
    })
    let row_data =  await JSON.parse(data);
    return await this.createRows(await row_data);
  }
   createRows(data){
    var row_info =[];
    var name = ["Total Games", "HighScore", "Best Category", "Worst Category", "Highest Ranking"];
    var content = [];
    
    content = Object.values(data[0]);
    content.push("No highest ranking yet");
    name.map((value, index)=>{
      row_info.push(this.createData(value, content[index]));
      return row_info;
    })

    return row_info;
  }
  createData(name, content) {
    return { name, content };
  }

  render(){
    const mystyle = {
      width:'auto',
      marginLeft: "20%",
      marginRight: "20%",
      marginTop: "5%",
    };
    return(
      <div style = {mystyle}>
      <TableContainer component={Paper}>
        <Table  size="small" aria-label="a dense table">
          <TableBody>
            {this.state.rowinfo.map((row) => (
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
}

