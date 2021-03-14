import React, { Component } from 'react';
import M from 'materialize-css';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import TwoByTwo from "./TwoByTwo";
import Ultimatum from "./Ultimatum";
import Centipede from "./Centipede";
import Three_PD from "./3PD";
import DecisionTree from "./DecisionTree";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    let simpleGames = ["bos", "pd", "hawkdove"]
    let options = ["ai", "human"]
    let models = ["ppo", "vpg", "dqn"]
    let paths = []
    simpleGames.map((game) => {
      options.map((option) => {
        models.map((model) => {
          let url = "/" + game + "/" + option + "/" + model
          let opponent = (option == "human") ? "Riley" : "AI"
          let component = <Route path={ url } component={ () => <TwoByTwo game={ game } opponent={ opponent } model={ model } /> } />
          paths.push(component)
        })
      })
    })

    let numOfAIs = ["0", "1", "2"]
    numOfAIs.map((option) => {
      models.map((model) => {
        let url = "/3pd/" + option + "/" + model
        let component = <Route path={ url } component={ () => <Three_PD model={ model } /> } />
        paths.push(component)
      })
    })
    return (
      <Router>
        <div className="row" style={{ display: "flex" }}>
          <div className="col s11 m10 l11" style={{ flex: 1 }}>
            { paths }
            <Route path="/ultimatum/" component={ () => <div className="row"><h2 className="center-align">Ultimatum</h2><Ultimatum /></div> } />
            <Route path="/centipede/" component={ () => <div className="row"><h2 className="center-align">Centipede</h2>< Centipede /></div> } />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
