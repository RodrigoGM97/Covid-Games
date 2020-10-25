import React from 'react';

import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";

import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import Home from './Home/Home'
import Profile from './Profile/Profile'


Amplify.configure(awsExports);

function App() {
  return (
    <BrowserRouter>
      <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/Profile' component={Profile} />
      </div>
    </BrowserRouter>
       
  );
}

export default withAuthenticator(App)
