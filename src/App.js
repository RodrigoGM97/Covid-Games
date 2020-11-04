import React from 'react';

import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";

import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import Profile from './Profile/Profile';
import suscribeSeason from './suscribeSeason/suscribeSeason';
import MySeasons from './MySeasons/MySeasons';
import Summary from './SeasonSummary/Summary';
import GameBet from './GameBet/GameBet';



Amplify.configure(awsExports);

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path='/' component={Profile} />
        <Route exact path='/My Profile' component={Profile} />
        <Route exact path='/Suscribe to Seasons' component={suscribeSeason} />
        <Route exact path='/My Seasons' component={MySeasons} />
        <Route exact path='/My Season Summary' component={Summary} />
        <Route exact path='/Game Bet' component={GameBet} />
      </div>
    </BrowserRouter>
       
  );
}

export default withAuthenticator(App)
