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
            question: null,
            op1: null,
            op2: null,
            op3: null,
            op4: null,
            correct_answer: null,

        };
    }

    async getQuestion()
    { 
        const obj_data = {
            "periodID": localStorage.getItem('currentPlayID'),
            "userName": localStorage.getItem('user'),
            "topic": localStorage.getItem('topic'),
            "response": {}
          }
        // https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Play/getPlayerPointsforSeason
        return await axios.post('https://bzhti9x5ia.execute-api.us-east-1.amazonaws.com/covid-games/Play/getQuestion', obj_data ).then(resp => {
            return JSON.parse(resp.data);

            }).catch(error =>{console.log(error)});    
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
    async ChooseOption(qty)
    {
        localStorage.setItem('betQty', qty);
        //let score_ = this.state.score;
        let userinfo = await this.getUserScore();
        this.isbetting = false;
        let question = await this.getQuestion();
        this.setState({
            score: await userinfo[0].SCORE, 
            question: await question.QUESTION, 
            op1: await question.OPTION1, 
            op2: await question.OPTION2, 
            op3: await question.OPTION3,
            op4: await question.OPTION4,
            correct_answer: await question.ANSWER,
        });
    
        //console.log("my state is now: ", this.state);

    }
    
    FinishQuestion(answer)
    {
        //query para saber si es correcta
        let correct = this.state.correct_answer; //query
        console.log("answer should be: ", this.state.correct_answer);
        let result = (correct === answer);
        if (result)
        {
            //sumar puntos en base
            console.log("Correct answer entered");
            // fetchear nuevo score
            let new_score = 100;
            //actualizar state con score. 
            this.isbetting=true;
            
            this.setState({score:new_score})
        }
        else
        {
            console.log("Incorrect answer entered");
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
        let question = await this.getQuestion();
        console.log("Llamando al Component did mount");
        this.setState({
            score: await userinfo[0].SCORE, 
            question: await question.QUESTION, 
            op1: await question.OPTION1, 
            op2: await question.OPTION2, 
            op3: await question.OPTION3,
            op4: await question.OPTION4,
            correct_answer: await question.ANSWER,
        });
        //console.log(await question);
        //this.setState({question: await question[0].QUESTION_ID});
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

        const rowanswerstyle={
            width: '50%',
            'borderBottom':'none',
            textAlign:'center',
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
                    <h1>{this.state.question}</h1>
                </div>
                <TableContainer style = {{height: '100%'}}>
                    <Table aria-label="a dense table" style={{height:'100%'}}>
                    <TableBody>
                        <TableRow key='Buttons'>
                            <TableCell align = "center" style= {rowanswerstyle}> 
                                <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                                    <Button style= {buttonstyle} onClick={() => this.FinishQuestion(1)} variant="outlined" color="primary">
                                        {this.state.op1}
                                    </Button>
                                </Box>
                            </TableCell>
                            <TableCell style = {rowanswerstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(2)}  variant="outlined" color="primary">
                                    {this.state.op2}
                                </Button>
                            </TableCell>
                            
                        </TableRow>
                        <TableRow key='Buttons' >
                            <TableCell style = {rowanswerstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(3)} variant="outlined" color="primary">
                                    {this.state.op3}
                                </Button>
                            </TableCell>
                            <TableCell style = {rowanswerstyle} align = "center"> 
                                <Button style= {buttonstyle} onClick={() => this.FinishQuestion(4)}  variant="outlined" color="primary">
                                    {this.state.op4}
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