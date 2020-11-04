import React from 'react';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import axios from 'axios';
import TableRow from '@material-ui/core/TableRow';

class BetScreen extends React.Component {
    constructor(props) {
        super(props);
 
        this.state = {
            score: 1,

        };
    }
    async getUserScore()
    { 
        const obj_data = {
            "seasonID": localStorage.getItem('currentPlayID'),
            "userName": localStorage.getItem('user'),
            "response": {}
          }
        // https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Play/getPlayerPointsforSeason
        return await axios.post('https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Play/getPlayerPointsforSeason', obj_data ).then(resp => {
            
            return JSON.parse(resp.data);

            }).catch(error =>{console.log(error)});    
    }
    async componentDidMount(){
        let userinfo = await this.getUserScore();
        
        this.setState({score: await userinfo[0].SCORE});
    }

    ChooseOption(qty)
    {

    }

    render() {
        const mystyle = {
            width:'auto',
            marginLeft: "30%",
            marginRight: "30%",
            marginTop: "5%",
            
          };
        const rowstyle = {
            'borderBottom':'none',
            textAlign:'center',
            
        };
        const titlestyle={
            textAlign:'center',
            justifyContent:'center',
            display:'block',
            alignItems:'center'
        };

        return (
            <div style = {mystyle}>
                <div style = {titlestyle}>
                    <h1>Choose an amount to bet:</h1>
                    <h2>Current score: {this.state.score}</h2>
                </div>
                <TableContainer>
                    <Table  size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow key='Buttons' >
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button variant="outlined" color="primary">
                                    0 pts
                                </Button>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button variant="outlined" color="primary" disabled = {this.state.score<1}>
                                    1 pts
                                </Button>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button variant="outlined" color="primary" disabled = {this.state.score<2}>
                                    2 pts
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow key ='Info' style = {rowstyle}>
                            <TableCell style = {rowstyle} align = "center"> 
                                <p>Earn 2 pts!</p>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <p>Earn 4 pts!</p>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <p>Earn 6 pts!</p>
                            </TableCell>
                            
                        </TableRow>
                    </TableBody>
                    </Table>
                </TableContainer>
            </div>
           
        );
    }

}

export default BetScreen;