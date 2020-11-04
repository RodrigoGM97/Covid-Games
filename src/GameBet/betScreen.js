import React from 'react';

class BetScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        
        };
    }
    
    async componentDidMount(){
        console.log(localStorage.getItem('currentPlayID'))
        console.log(localStorage.getItem('user'))
    }

    render() {
        
        return(
            <h1>juego</h1>
        );
    }

}

export default BetScreen;