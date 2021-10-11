import React from 'react';
import './App.css'
import {BrowserRouter as Router,Route, Switch, NavLink} from 'react-router-dom'

function Nav(){
  return(
    <div></div>
  )
}
function App() {
  return (
    <Router>
      <div>
      <Nav/>
      <Route path="/" component=""/>
      <Route path="/"/>
      </div>
    </Router>
  );
}

export default App;
