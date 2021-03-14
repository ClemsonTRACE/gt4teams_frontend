import React, { Component } from 'react';
import M from 'materialize-css';
import axios from "axios";
import DecisionTree from "./DecisionTree";
import Waiver from "./Waiver";


const config = {
	"gameName": "3 Player Prisoners Dilemma",
	"moves": ["Cooperate", "Defect"],
	"explanation": "You and the other players committed a crime, and have been arrested by the police. The police does not have enough evidence to convict all of you, so they are hoping to get a confession out of all of you. If you and the other players Cooperate, then you each get a small sentence. If one of you Defects while the others Cooperate, then the defector walks away free and the cooperators gets a harsh sentence. If all of you Defect, then all of you get a harsh sentence."	
}

let pd3_data = {
  "name": "you",
  "children": [
    {
      "name": "you cooperate",
      "children": [
        {
          "name": "Player 1 cooperates",
          "children": [
            {
              "name": "Player 2 cooperates",
              "children": [
                {
                  "name": "You: +7"
                },
                {
                  "name": "Player 1: +7"
                },
                {
                  "name": "Player 2: +7"
                }
              ]
            },
            {
              "name": "Player 2 defects",
              "children": [
                {
                  "name": "You: +3"
                },
                {
                  "name": "Player 1: +3"
                },
                {
                  "name": "Player 2: +9"
                }
              ]
            } 
          ]
        },
        {
          "name": "Player 1 defects",
          "children": [
            {
              "name": "Player 2 cooperates",
              "children": [
                {
                  "name": "You: +3"
                },
                {
                  "name": "Player 1: +9"
                },
                {
                  "name": "Player 2: +3"
                }
              ]
            },
            {
              "name": "Player 2 defects",
              "children": [
                {
                  "name": "You: +0"
                },
                {
                  "name": "Player 1: +5"
                },
                {
                  "name": "Player 2: +5"
                }
              ]
            } 
          ]
        }
      ]
    },
    {
      "name": "you defect",
      "children": [
        {
          "name": "Player 1 cooperates",
          "children": [
            {
              "name": "Player 2 cooperates",
              "children": [
                {
                  "name": "You: +9"
                },
                {
                  "name": "Player 1: +3"
                },
                {
                  "name": "Player 2: +3"
                }
              ]
            },
            {
              "name": "Player 2 defects",
              "children": [
                {
                  "name": "You: +5"
                },
                {
                  "name": "Player 1: +0"
                },
                {
                  "name": "Player 2: +5"
                }
              ]
            } 
          ]
        },
        {
          "name": "Player 1 defects",
          "children": [
            {
              "name": "Player 2 cooperates",
              "children": [
                {
                  "name": "You: +5"
                },
                {
                  "name": "Player 1: +5"
                },
                {
                  "name": "Player 2: +0"
                }
              ]
            },
            {
              "name": "Player 2 defects",
              "children": [
                {
                  "name": "You: +1"
                },
                {
                  "name": "Player 1: +1"
                },
                {
                  "name": "Player 2: +1"
                }
              ]
            } 
          ]
        }
      ]
    }
  ]
}

class Three_PD extends Component {

	constructor(props) {
		super(props);
		this.state = {
			"game": "3pd",
			"opponent": this.props.opponent,
			"model": this.props.model,
			"status": false, 
			"numEpochs": 2,
			"numTurns": 9,
			"gameState": {},
			"payoffs": {},
			"epoch": -2,
			"turn": 0,
			"surveyID": Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
		}

		//generating the state dynamically
		for (let x = 0; x <= this.state.numEpochs; x++) { 
			this.state["gameState"][x] = {}
			this.state["payoffs"][x] = {}
			for (let y = 0; y <= this.state.numTurns; y++) { 
				this.state["gameState"][x][y] = [0, 0, 0]
				this.state["payoffs"][x][y] = [0, 0, 0]
			}	
		}

	}

	componentDidMount() {
		M.AutoInit();
	}

	sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	nice(move) {
		let ob = this.state
		ob["move"] = move
		let newOb = JSON.stringify(ob)

		let self = this
		// let url = "https://gametheoryteams.herokuapp.com/games/twoByTwo/" + this.props.game + "/" + this.props.model 
		// let url = "http://localhost:8000/games/twoByTwo/" + this.props.game + "/" + this.props.model 
		let url = "https://lorenzo.pagekite.me/games/twoByTwo/" + this.props.game + "/" + this.props.model 

		alert("wait to be notified")

		// self.sleep(10000).then(() => {
		axios.post(url, ob)
		.then(function (response) {
			console.log(response["data"])
			alert("success")
			self.setState(response["data"])
		})
		.catch(function (error) {
			console.log(error);
			alert("error: try again in 5 minutes or refresh")
		});	
		// })

	}

	currentScore() {
		let scores = Object.values(this.state.payoffs[this.state.epoch])
		console.log(scores)
		// let AI_score = 0
		let human_score = 0
		let p1_score = 0
		let p2_score = 0

		scores.map((scorePair) => {
			console.log(scorePair)
			// AI_score += scorePair[1]
			human_score += scorePair[0]
			p1_score += scorePair[1]
			p2_score += scorePair[2]
		})

		console.log("payoffs", human_score, p1_score, p2_score)

		return <div className="col l8">
			<div className="col l3">
				<h4 className='center-align blue-text'>You = { human_score } </h4>
			</div>
			<div className="col l2"></div>
			<div className="col l3">
				<h4 className='center-align teal-text'>Player 1 = { p1_score } </h4>
			</div>
			<div className="col l3">
				<h4 className='center-align brown-text'>Player 2 = { p2_score } </h4>
			</div>
		</div>
	}

	winRatio() {
		let epochs = Object.keys(this.state.payoffs)
		let components = []
		for (let epoch = 0; epoch < this.state.epoch; epoch++) {
			let payoffs = Object.values(this.state.payoffs[epoch])
			let human_score = 0
			let p1_score = 0
			let p2_score = 0
			let message = ""

			payoffs.map((payoff) => {
				human_score += payoff[0]
				p1_score += payoff[1]
				p2_score += payoff[2]
			})

			//I'm literally gonna check the values of the payoffs as opposed to making a complex conditioanl
			if (payoffs.toString() == [7, 7, 7].toString()) {
				message = <h5> All players won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [3, 3, 9].toString()) {
				message = <h5> Player 2 won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [3, 9, 3].toString()) {
				message = <h5> Player 1 won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [0, 5, 5].toString()) {
				message = <h5> You lost Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [9, 3, 3].toString()) {
				message = <h5> You won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [5, 0, 5].toString()) {
				message = <h5> You and Player 2 successfully betrayed Player 1 in Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [5, 5, 0].toString()) {
				message = <h5> You and Player 1 successfully betrayed Player 2 in Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() == [1, 1, 1].toString()) {
				message = <h5> All players lost Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else {
				message = <h5>Error</h5>
			}

			components.push(message)
		}

		return components
	}

	forward() {
		let currentNum = this.state.epoch
		let newNum = currentNum + 1
		this.setState({
			"epoch": newNum
		})
	}

	render() {
		this.winRatio()
		if (this.state.status == false) {
			if (this.state.epoch == -2) {
				return(
					<div className="container">
						<Waiver />
						<button className="btn" onClick={ this.forward.bind(this) }>Agree & Proceed</button>
					</div>
				)
			} else if (this.state.epoch == -1) {
				return(
					<div>
						<h3>You are going to play against { this.state.opponent } </h3>
						<button className="btn" onClick={ this.forward.bind(this) }>Start</button>
					</div>
				)
			} else {
				return(
					<div className='container'>
						<div className="row">
							<h2 className="center-align">{ config["gameName"] }</h2>
							<p> { config["explanation"] } </p>
						</div>
						<div className="row">
							{ this.winRatio() }
						</div>
						<div className="row">
							<div className="col l2"></div>
							<div className="col l3 ">
								<h4 className='center-align'>Game { this.state.epoch + 1 } / { this.state.numEpochs + 1 } </h4>
							</div>
							<div className="col l2"></div>
							<div className="col l3">
								<h4>Turn { this.state.turn  + 1 } / { this.state.numTurns + 1} </h4>
							</div>
							<div className="col l2"></div>
						</div>
						<div className="row">
							<div className="col l2"></div>
							{ 
								this.currentScore()
							}
							<div className="col l2"></div>
						</div>
						<div className="row">
							<DecisionTree data={ pd3_data } width={ 954 } />
						</div>
						<div className="row">
							<div className="col l4"></div>
							<div className="col l2">
								<button className='btn' type="submit" onClick={ this.nice.bind(this, 0) }> { config["moves"][0] }</button>
							</div>
							<div className="col l2">
								<button className='btn' type="submit" onClick={ this.nice.bind(this, 1) } >{ config["moves"][1] }</button>
							</div>
							<div className="col l4"></div>
						</div>
					</div>
				)	
			}	
		} else {
			return(
				<div className="row">
					<h2 className="center-align">One more thing!</h2>
					<h4>Write down this code: You will need this for the survey! </h4>
					<h4>{ this.state.surveyID } </h4>
					<a href="https://clemson.ca1.qualtrics.com/jfe/form/SV_aeEAlqgU5iyW2a1">Go to the Survey</a>
				</div>
			)
		}

	}
}

export default Three_PD