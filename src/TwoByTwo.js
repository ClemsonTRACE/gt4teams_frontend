import React, { Component } from 'react';
import M from 'materialize-css';
import axios from "axios";

const config = {
	"bos": {
		"gameName": "Battle of the Sexes",
		"moves": ["Opera", "Game"],
		"table": [<table>
							<tbody>
								<tr>
									<td></td>
									<td>They go to the Opera</td>
									<td>They go to the Game</td>
								</tr>
								<tr>
									<td>You go to the Opera</td>
									<td>3, 2</td>
									<td>1, 1</td>
								</tr>
								<tr>
									<td>You go to the Game</td>
									<td>0, 0</td>
									<td>2, 3</td>
								</tr>
							</tbody>
						</table>
						]	
	},
	"pd": {
		"gameName": "Prisoners Dilemma",
		"moves": ["Cooperate", "Defect"],
		"table": [<table>
						<tbody>
							<tr>
								<td></td>
								<td>You Cooperate</td>
								<td>You Defect</td>
							</tr>
							<tr>
								<td>They Cooperate</td>
								<td>-1, -1</td>
								<td>-3, 0</td>
							</tr>
							<tr>
								<td>They Defect</td>
								<td>0, -3</td>
								<td>-2, -2</td>
							</tr>
						</tbody>
					</table>
						]	
	},
	"hawkdove": {
		"gameName": "Hawk Dove",
		"moves": ["Attack", "Peaceful"],
		"table": [<table>
						<tbody>
							<tr>
								<td></td>
								<td>They Attack</td>
								<td>They Stay Peaceful</td>
							</tr>
							<tr>
								<td>You Attack</td>
								<td>-2, -2</td>
								<td>1, -1</td>
							</tr>
							<tr>
								<td>You Stay Peaceful</td>
								<td>-1, 1</td>
								<td>0, 0</td>
							</tr>
						</tbody>
					</table>
						]	
	}
}
class TwoByTwo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			"status": false, 
			"numEpochs": 2,
			"numTurns": 2,
			"gameState": {},
			"payoffs": {},
			"epoch": 0,
			"turn": 0
		}

		//generating the state dynamically
		for (let x = 0; x <= this.state.numEpochs; x++) { 
			this.state["gameState"][x] = {}
			this.state["payoffs"][x] = {}
			for (let y = 0; y <= this.state.numTurns; y++) { 
				console.log(this.state["gameState"])
				this.state["gameState"][x][y] = [0, 0]
				this.state["payoffs"][x][y] = [0, 0]
			}	
		}

	}

	componentDidMount() {
		console.log("mounted")
		M.AutoInit();
	}

	nice(move) {
		let ob = this.state
		ob["move"] = move
		let newOb = JSON.stringify(ob)

		let self = this
		let url = "http://localhost:8000/games/twoByTwo/" + this.props.game + "/" + this.props.model 
		axios.post(url, ob)
		.then(function (response) {
			console.log(response["data"])
			self.setState(response["data"])
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	currentScore() {
		let scores = Object.values(this.state.payoffs[this.state.epoch])
		let AI_score = 0
		let human_score = 0

		scores.map((scorePair) => {
			AI_score += scorePair[0]
			human_score += scorePair[1]
		})

		console.log("payoffs", AI_score, human_score)

		return <div className="col l8">
			<div className="col l3">
				<h4 className='center-align'>{ this.props.opponent } = { AI_score } </h4>
			</div>
			<div className="col l2"></div>
			<div className="col l3">
				<h4 className='center-align'>You = { human_score } </h4>
			</div>
		</div>
	}

	winRatio() {
		let epochs = Object.keys(this.state.payoffs)
		let components = []
		for (let epoch = 0; epoch < this.state.epoch; epoch++) {
			let payoffs = Object.values(this.state.payoffs[epoch])
			let AI_score = 0
			let human_score = 0
			let message = ""
			payoffs.map((payoff) => {
				AI_score += payoff[0]
				human_score += payoff[1]
			})

			if (AI_score > human_score) {
				message = <h5>{ this.props.opponent } won Game #{ Number(epoch) + 1} : { AI_score } vs { human_score }</h5>
			} else if (human_score > AI_score) {
				message = <h5>You won Game #{ Number(epoch) + 1}: { human_score } vs { AI_score }</h5>
			} else {
				message = <h5>Game #{ Number(epoch) + 1} ended in a Tie: { human_score } vs { AI_score }</h5>
			}

			components.push(message)
		}

		return components
	}

	render() {
		this.winRatio()
		if (this.state.status == false) {
			return(
				<div className='container'>
					<div className="row">
						<h2 className="center-align">{ config[this.props.game]["gameName"] }</h2>
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
						{ config[this.props.game]["table"] }
					</div>
					<div className="row">
						<div className="col l4"></div>
						<div className="col l2">
							<button className='btn' type="submit" onClick={ this.nice.bind(this, 1) }> { config[this.props.game]["moves"][0] }</button>
						</div>
						<div className="col l2">
							<button className='btn' type="submit" onClick={ this.nice.bind(this, 0) } >{ config[this.props.game]["moves"][1] }</button>
						</div>
						<div className="col l4"></div>
					</div>
				</div>
			)		
		} else {
			return(
				<h1>Done</h1>
			)
		}

	}
}

export default TwoByTwo