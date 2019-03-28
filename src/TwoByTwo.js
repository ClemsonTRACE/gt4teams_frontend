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
									<td>
										<span className="blue-text">3</span>
										,
										<span className="teal-text">2</span>
									</td>
									<td>
										<span className="blue-text">1</span>
										, 
										<span className="teal-text">1</span>
									</td>
								</tr>
								<tr>
									<td>You go to the Game</td>
									<td>
										<span className="blue-text">0</span>
										,
										<span className="teal-text">0</span>
									</td>
									<td>
										<span className="blue-text">2</span>
										, 
										<span className="teal-text">3</span>
									</td>
								</tr>
							</tbody>
						</table>
			],	
		"explanation": "You and and the other player are trying to meet up at either the Opera or the Game, but can't communicate beforehand. You have to decide where you are going to go given where you expect the other player to go. You'd rather go to the Opera, and the other player prefers going to the Game, but you both would rather go to the same place than being alone at your preferred location"
	},
	"pd": {
		"gameName": "Prisoners Dilemma",
		"moves": ["Cooperate", "Defect"],
		"table": [<table>
						<tbody>
							<tr>
								<td></td>
								<td>They Cooperate</td>
								<td>They Defect</td>
							</tr>
							<tr>
								<td>You Cooperate</td>
								<td>
									<span className="blue-text">-1</span>
									,
									<span className="teal-text">-1</span>
								</td>
								<td>
									<span className="blue-text">-3</span>
									, 
									<span className="teal-text">0</span>
								</td>
							</tr>
							<tr>
								<td>You Defect</td>
								<td>
									<span className="blue-text">0</span>
									, 
									<span className="teal-text">-3</span>
								</td>
								<td>
									<span className="blue-text">-2</span>
									, 
									<span className="teal-text">-2</span>
								</td>
							</tr>
						</tbody>
					</table>
			],
		"explanation": "You and the other player committed a crime, and have been arrested by the police. The police does not have enough evidence to convict you both, so they are hoping to get a confession out of the both of you. If you and the other player Cooperate, then you each get a small sentence. If one of you Defects while the other Cooperates, then the defector walks away free and the cooperator gets a harsh sentence. If you both Defect, then you both get a harsh sentence."	
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
								<td>
									<span className="blue-text">-2</span>
									,
									<span className="teal-text">-2</span>
								</td>
								<td>
									<span className="blue-text">1</span>
									, 
									<span className="teal-text">-1</span>
								</td>
							</tr>
							<tr>
								<td>You Stay Peaceful</td>
								<td>
									<span className="blue-text">-1</span>
									,
									<span className="teal-text">1</span>
								</td>
								<td>
									<span className="blue-text">0</span>
									, 
									<span className="teal-text">0</span>
								</td>
							</tr>
						</tbody>
					</table>
			],
		"explanation": "You and the other player find yourself sharing the same environment. You each have a choice of attacking the other or remaning peaceful. Sucessful attacks gain the attacker new resources at the expense of the other. You both attacking results in mutual harm. Mutual peace keeps you at a steady state"	
	}
}
class TwoByTwo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			"game": this.props.game,
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
				this.state["gameState"][x][y] = [0, 0]
				this.state["payoffs"][x][y] = [0, 0]
			}	
		}

	}

	componentDidMount() {
		M.AutoInit();
	}

	nice(move) {
		let ob = this.state
		ob["move"] = move
		let newOb = JSON.stringify(ob)

		let self = this
		// let url = "https://gametheoryteams.herokuapp.com/games/twoByTwo/" + this.props.game + "/" + this.props.model 
		// let url = "http://localhost:8000/games/twoByTwo/" + this.props.game + "/" + this.props.model 
		let url = "https://5732d996.ngrok.io/games/twoByTwo/" + this.props.game + "/" + this.props.model 

		axios.post(url, ob)
		.then(function (response) {
			console.log(response["data"])
			alert("success")
			self.setState(response["data"])
		})
		.catch(function (error) {
			console.log(error);
			alert("error: try again or refresh")
		});
	}

	currentScore() {
		let scores = Object.values(this.state.payoffs[this.state.epoch])
		console.log(scores)
		let AI_score = 0
		let human_score = 0

		scores.map((scorePair) => {
			console.log(scorePair)
			AI_score += scorePair[1]
			human_score += scorePair[0]
		})

		console.log("payoffs", human_score, AI_score)

		return <div className="col l8">
			<div className="col l3">
				<h4 className='center-align blue-text'>You = { human_score } </h4>
			</div>
			<div className="col l2"></div>
			<div className="col l3">
				<h4 className='center-align teal-text'>{ this.props.opponent } = { AI_score } </h4>
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
				AI_score += payoff[1]
				human_score += payoff[0]
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
						<h2>KEY INFORMATION ABOUT THE RESEARCH STUDY</h2>	
						<p>
							Voluntary Consent: Dr. Nathan McNeese, and Lorenzo Barberis Canonico are inviting you to take part in a research study. Dr. McNeese is a professor at Clemson University. Lorenzo is a graduate student at Clemson University, running this study with the help of Dr. McNeese. 
							You may choose not to take part and you may choose to stop taking part at any time. You will not be punished in any way if you decide not to be in the study or to stop taking part in the study. If you choose to stop taking part in this study, the information you have already provided will be used in a confidential manner.
						</p>
						<p>
							Alternative to Participation: Participation is voluntary and the only alternative is to not participate.
						</p>
						<p>
							Study Purpose: The purpose of this research is to evaluate Human-Artificial Intelligence (AI) teamwork.
						</p>
						<p>
							Activities and Procedures: Your part in the study will be to play a series of games with both human and AI players, and will take a survey at the end. 
						</p>	
						<p>
							Participation Time: It will take you around 20 minutes, at most 30, to be in this study.
						</p>
						<p>	
							Risks and Discomforts: We do not know of any risks or discomforts to you in this research study.
						</p>
						<p>
							Possible Benefits: The study will enable you to interact with a variety of different types of AIs over a series of game theory scenarios. You will get to see and observe how different AIs play the game differently, and which kind you collaborate most well with. It will be a fun way to learn about and contribute to cutting-edge research about the role of AI and cognitive technology to improve human-AI teamwork teamwork. The results will give us insight into the Human-AI relationship when it comes to cooperation, teamwork, and decision-making.
						</p>
						<p>
							INCENTIVES
							Upon completion of the experiment, you will be awarded $1 through Amazon’s Mechanical Turk. Partial payment will not be offered. 
						</p>
						<p>
							PROTECTION OF PRIVACY AND CONFIDENTIALITY
							No identifiable data will be recorded, and every data collected will be anonymized. The information collected during the study will not be used or distributed for future research studies.
							The results of this study may be published in scientific journals, professional publications, or educational presentations. 
						</p>
						<p>
							Contact Information
							If you have any questions or concerns about your rights in this research study, please contact the Clemson University Office of Research Compliance (ORC) at irb@clemson.edu. The Clemson IRB will not be able to answer some study-specific questions. However, you may contact the Clemson IRB if the research staff cannot be reached or if you wish to speak with someone other than the research staff.
							If you have any study related questions or if any problems arise, please contact Lorenzo at Clemson University at lorenzb@g.clemson.edu.
						</p>
						<h5>
							Consent
							By participating in the study, you indicate that you have read the information written above, are at least 18 years of age, been allowed to ask any questions, and are voluntarily choosing to take part in this research. You do not give up any legal rights by taking part in this research study.
						</h5>
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
							<h2 className="center-align">{ config[this.props.game]["gameName"] }</h2>
							<p> { config[this.props.game]["explanation"] } </p>
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
								<button className='btn' type="submit" onClick={ this.nice.bind(this, 0) }> { config[this.props.game]["moves"][0] }</button>
							</div>
							<div className="col l2">
								<button className='btn' type="submit" onClick={ this.nice.bind(this, 1) } >{ config[this.props.game]["moves"][1] }</button>
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

export default TwoByTwo