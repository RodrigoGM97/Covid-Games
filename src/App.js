import React from 'react';

import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";

import './App.css';

import Home from './Home/Home'


Amplify.configure(awsExports);

function App() {
  return (
    <Home></Home>    
  );
}

export default withAuthenticator(App)
