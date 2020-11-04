import React from 'react';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import axios from 'axios';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box'; 

class BetScreen extends React.Component {
    constructor(props) {
        super(props);
        this.isbetting=true;
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
    ChooseOption(qty)
    {
        localStorage.setItem('betQty', qty);
        let score_ = this.state.score;
        this.isbetting = false;
        this.setState({score:score_,});
        console.log("my state is now: ", this.state);

    }
    FinishQuestion(answer)
    {
        //query para saber si es correcta
        let correct = 1; //query
        let result = (correct === answer);
        if (result)
        {
            //sumar puntos en base
            
            // fetchear nuevo score
            let new_score = 100;
            //actualizar state con score. 
            this.isbetting=true;
            
            this.setState({score:new_score})
        }
        else
        {
            //sumar puntos en base
            
            // fetchear nuevo score
            let new_score = 40;
            //actualizar state con score. 
            this.isbetting=true;
            
            this.setState({score:new_score})
        }
        
    }

    async componentDidMount(){
        let userinfo = await this.getUserScore();
        this.setState({score: await userinfo[0].SCORE});
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
            //'backgroundColor':'red', 
            
        };
        const titlestyle={
            textAlign:'center',
            justifyContent:'center',
            display:'block',
            alignItems:'center'
        };
        const buttonstyle={
            width:'100%',
            height:'100%'
        }

        const answerstyle={
            height: '70vh',
            marginRight: '5%',
            marginLeft: '5%'
        }
        return (this.isbetting)?(
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
                                <Button onClick={() => this.ChooseOption(0)} variant="outlined" color="primary">
                                    0 pts
                                </Button>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button onClick={() => this.ChooseOption(1)}  variant="outlined" color="primary" disabled = {this.state.score<1}>
                                    1 pts
                                </Button>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button onClick={() => this.ChooseOption(2)} variant="outlined" color="primary" disabled = {this.state.score<2}>
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
           
        ):(
            <div style= {answerstyle}>
                <div style = {titlestyle}>
                    <h1>Game Time</h1>
                </div>
                <TableContainer style = {{height: '100%'}}>
                    <Table aria-label="a dense table" style={{height:'100%'}}>
                    <TableBody>
                        <TableRow key='Buttons'>
                            <TableCell align = "center" style= {rowstyle}> 
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                                    <Button style= {buttonstyle} onClick={() => this.FinishQuestion(1)} variant="outlined" color="primary">
                                        0 pts
                                    </Button>
                                </Box>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(2)}  variant="outlined" color="primary">
                                    1 pts
                                </Button>
                            </TableCell>
                            
                        </TableRow>
                        <TableRow key='Buttons' >
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(3)} variant="outlined" color="primary">
                                    0 pts
                                </Button>
                            </TableCell>
                            <TableCell style = {rowstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(4)}  variant="outlined" color="primary">
                                    1 pts
                                </Button>
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