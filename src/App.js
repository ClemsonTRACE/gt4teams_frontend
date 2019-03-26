import React, { Component } from 'react';
import M from 'materialize-css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PD from "./PrisonerDilemma";
import BoS from "./BattleOfTheSexes";
import Ultimatum from "./Ultimatum";
import Centipede from "./Centipede";
import HawkDove from "./HawkDove"


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
      <Router basename={process.env.PUBLIC_URL}>
        <Link to="/bos/" className="center-align">Battle of the Sexes</Link>
        <div className="row" style={{ display: "flex" }}>
          <div className="col s11 m10 l11" style={{ flex: 1 }}>
            <Route path="/pd" exact component={ () => <div className="row"><h2 className="center-align">Iterative Prisoners Dilemma</h2><PD /></div> } />
            <Route path="/bos/" component={ () => <div className="row"><h2 className="center-align">Battle of the Sexes</h2><BoS /></div> } />
            <Route path="/hawkdove/" component={ () => <div className="row"><h2 className="center-align">Hawk Dove</h2><HawkDove /></div> } />
            <Route path="/ultimatum/" component={ () => <div className="row"><h2 className="center-align">Ultimatum</h2><Ultimatum /></div> } />
            <Route path="/centipede/" component={ () => <div className="row"><h2 className="center-align">Centipede</h2>< Centipede /></div> } />
            <Route path="/survey/" component={ () => <div className="row"><h2 className="center-align">Survey</h2></div> } />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
