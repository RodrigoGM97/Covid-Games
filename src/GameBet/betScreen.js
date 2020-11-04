import React from 'react';

class BetScreen extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        
        };
    }
    

    render() {
        console.log(localStorage.getItem('currentPlayID'))
        return(
            <h1>juego</h1>
        );
    }

}

export default BetScreen;