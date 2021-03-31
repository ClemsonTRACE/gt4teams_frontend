import React, { Component } from 'react';
import M from 'materialize-css';
import axios from "axios";
import firebase from './firebase.js';
import DecisionTree from "./DecisionTree";
import Waiver from "./Waiver";
import Loader from "./Loader";

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

let intervalID = ""

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
			"epoch": -1,
			"turn": 0,
			"surveyID": Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8),
			"players_ready": false,
			"player_id": "",
			"ref": firebase.database().ref("/gt4t/"),
			"sessionID": "",
			"intervalLength": 0
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
		console.log("opponent", this.props. opponent)
		console.log("model", this.props.model)
		console.log("game", this.props.game)
	}

	sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	arrayToObject(arr) {
		let res = {};
		for (let i = 0; i < arr.length; i++) {
			res[i] = {}
			for (let j = 0; j < arr[i].length; j++) {
				res[i][j] = arr[i][j]
				// Object.assign(res[i][j], arr[i][j])
			}
		};
		return res;
	};

	checkSession(ob) {
		console.log("listener fired")

		let numOfHumans = (3 - this.props.numOfAIs)
		let game_path = "game_" + this.state.epoch + "/turn_" + this.state.turn

		let self = this

		let newOb = this.state

		// let url = "https://tracelab.pagekite.me/games/" + this.props.game + "/" + this.props.model
		// let url = "https://24.213.115.249:8000/games/" + this.props.game + "/" + this.props.model 
		let url = "http://localhost:8000/games/" + this.props.game + "/" + this.props.model 

		this.state.ref
			.child(numOfHumans)
			.child(this.state.sessionID)
			.child("games/" + game_path)
			.child("moves")
			.get().then((snapshot) => {
				newOb["moves"] = snapshot.val()
				newOb["numHumans"] = numOfHumans
				let allMovesSubmitted = Object.values(snapshot.val()).indexOf(false)
				if (allMovesSubmitted > -1) {
					if (snapshot.val()[this.state.player_id] === false) {
						console.log("the other player has submitted a move")
					} else {
						self.setState({
							"players_ready": false,
							"intervalLength": this.state.intervalLength + 3
						})
					}
				} else {
					console.log("all moves submitted")
					this.state.ref
						.child(numOfHumans)
						.child(this.state.sessionID)
						.child("games/" + game_path)
						.child("outcome")
						.get().then((snapshot) => {
							let outcomeStatus = snapshot.val()
							if (outcomeStatus === false) {
								if (self.state.player_id === "A") {
									// const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' }
									// {"headers": headers}
									axios.post(url, newOb)
										.then((response) => {
											alert("response logged \n press ok")
										})
										.catch((error) => {
											console.log(error);
											alert("error: try again in 5 minutes or refresh")
										});	
								}	
							} else {
								let newStateToPropagate = snapshot.val()
								//for some reason when I get the json from firebase it converts gameState and payoffs into arrays of arrays so I'm coverting them back into objects
								newStateToPropagate["gameState"] = self.arrayToObject(newStateToPropagate["gameState"])
								newStateToPropagate["payoffs"] = self.arrayToObject(newStateToPropagate["payoffs"])
								//player A sends the state so we don't want to accidentally convert all players to player A
								delete newStateToPropagate.player_id
								//not converting the firebase ref to a string which messes up the listeners
								delete newStateToPropagate.ref
								newStateToPropagate["intervalLength"] = 0
								newStateToPropagate["player_id"] = this.state.player_id
								self.setState(newStateToPropagate)
							}
						})
					
				}
			})	
	}

	nice(move) {
		let numOfHumans = (3 - this.props.numOfAIs)
		let game_path = "game_" + this.state.epoch + "/turn_" + this.state.turn + "/moves"
		let update = {}
		update[this.state.player_id] = move
		this.state.ref
			.child(numOfHumans)
			.child(this.state.sessionID)
			.child("games/" + game_path)
			.update(update)
	}

	currentScore() {
		let scores = Object.values(this.state.payoffs[this.state.epoch])
		// console.log(scores)
		// let AI_score = 0
		let human_score = 0
		let p1_score = 0
		let p2_score = 0

		scores.map((scorePair) => {
			// console.log(scorePair)
			// AI_score += scorePair[1]
			human_score += scorePair[0]
			p1_score += scorePair[1]
			p2_score += scorePair[2]
		})

		// console.log("payoffs", human_score, p1_score, p2_score)

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
			if (payoffs.toString() === [7, 7, 7].toString()) {
				message = <h5> All players won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [3, 3, 9].toString()) {
				message = <h5> Player 2 won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [3, 9, 3].toString()) {
				message = <h5> Player 1 won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [0, 5, 5].toString()) {
				message = <h5> You lost Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [9, 3, 3].toString()) {
				message = <h5> You won Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [5, 0, 5].toString()) {
				message = <h5> You and Player 2 successfully betrayed Player 1 in Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [5, 5, 0].toString()) {
				message = <h5> You and Player 1 successfully betrayed Player 2 in Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else if (payoffs.toString() === [1, 1, 1].toString()) {
				message = <h5> All players lost Game #{ Number(epoch) + 1} : { human_score} vs { p1_score } vs { p2_score }</h5>
			} else {
				message = <h5>Next round</h5>
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

	checkPlayersStatus() {
		//running this every 3 seconds to keep checking if the other players are online
		intervalID = window.setInterval(() => {
			let numOfHumans = (3 - this.props.numOfAIs)

			if (this.state.sessionID == "") {
			
				this.state.ref.child(numOfHumans).once('value', (snapshot) => {
					let items = snapshot.val();
					console.log(numOfHumans, snapshot)
					let sessions = Object.values(items)
					let session_keys = Object.keys(items)

					let i = 0
					while (i <= sessions.length - 1) {
						// console.log(sessions[i])
						let players_status = Object.values(sessions[i].player_status)
						// console.log(players_status.indexOf(false))
						if (players_status.indexOf(false) > - 1) {
							let update = {}
							let role = Object.keys(sessions[i].player_status)[players_status.indexOf(false)]
							update[role] = this.state.surveyID
							this.state.ref.child(numOfHumans).child(session_keys[i]).child("player_status").update(update)
							this.setState({
								"sessionID": session_keys[i],
								"player_id": role,
							})
							i = sessions.length
						} else {
							i++
						}
					}
				})
			} else {
				let self = this
				this.state.ref.child(numOfHumans).child(this.state.sessionID).child("player_status").once("value", (snapshot) => {
					// console.log("here", snapshot.val())
					let players_status = Object.values(snapshot.val())
					if (players_status.indexOf(false) < 0) {
						this.setState({
							"players_ready": true,
							"intervalLength": 0
						})

						this.state.ref
							.child(numOfHumans)
							.child(this.state.sessionID)
							.on("child_changed", (snapshot) => {
								self.checkSession(snapshot.val())
							})	
					} else {
						console.log("still waiting", this.state.intervalLength)
						this.setState({
							"intervalLength": this.state.intervalLength + 3
						})
					}
				})
			}

		}, 3000)
	}


	render() {
		let timeElapsed = (this.state.intervalLength / 1800) * 100
		this.winRatio()
		if (this.state.status === false && !(timeElapsed > 100)) {
			if (this.state.epoch === -2) {
				return(
					<div className="container">
						<Waiver />
						<button className="btn" onClick={ this.forward.bind(this) }>Agree & Proceed</button>
					</div>
				)
			} else if (this.state.epoch === -1) {
				if (this.state.players_ready) {
					//clearing the timer so it doesn't keep looping
					window.clearInterval(intervalID)
					this.forward()
					return(
						<div>
							<h3>You are going to play against { this.props.numOfAIs } AIs and { 2 - this.props.numOfAIs } other humans</h3>
						</div>
					)
				} else {

					//checking if the interval has already been set to avoid overloading the browser
					if (intervalID === "") {
						this.checkPlayersStatus()
					}
					return(
						<div>
							<h3>Wait until the other players show up</h3>
							<Loader />
							<h4>If no one other players show up in the next 30m, you will get paid anyway</h4>
							<div className="progress">
								<div className="determinate" style={{width: timeElapsed + "%"}}></div>
							</div>
						</div>
					)
				}
			} else {
				if (this.state.players_ready) {
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
				} else {
					return(
						<div>
							<h3>Waiting for other players to move</h3>
							<Loader />
							<h4>If the other players drop out or fail to move show up in the next 30m, you will get paid anyway</h4>
							<div className="progress">
								<div className="determinate" style={{width: timeElapsed + "%"}}></div>
							</div>
						</div>
					)
				}
			}	
		} else {
			return(
				<div className="row">
					<h2 className="center-align">One more thing!</h2>
					<h4>Write down this code: You will need this for the survey! </h4>
					<h4>{ this.state.surveyID } </h4>
					<a href="https://clemson.ca1.qualtrics.com/jfe/form/SV_bdTag4IaZSMWRHo" target="_blank">Go to the Survey</a>
				</div>
			)
		}

	}
}

export default Three_PD