import React, { Component } from 'react';
import M from 'materialize-css';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import TwoByTwo from "./TwoByTwo";
import Ultimatum from "./Ultimatum";
import Centipede from "./Centipede";


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    return (
      <Router>
        <div className="row" style={{ display: "flex" }}>
          <div className="col s11 m10 l11" style={{ flex: 1 }}>
            <Route path="/bos/" component={ () => <TwoByTwo game="bos" opponent="Riley" /> } />
            <Route path="/pd/" component={ () => <TwoByTwo game="pd" opponent="Riley" /> } />
            <Route path="/hawkdove/" component={ () => <TwoByTwo game="hawkdove" opponent="Riley" /> } />
            <Route path="/ultimatum/" component={ () => <div className="row"><h2 className="center-align">Ultimatum</h2><Ultimatum /></div> } />
            <Route path="/centipede/" component={ () => <div className="row"><h2 className="center-align">Centipede</h2>< Centipede /></div> } />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
