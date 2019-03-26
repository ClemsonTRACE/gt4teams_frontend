import React, { Component } from 'react';
import M from 'materialize-css';
import axios from "axios";

class BoS extends Component {

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
		axios.post("http://localhost:8000/games/twoByTwo/bos/ppo", ob)
		.then(function (response) {
			console.log(response["data"])
			self.setState(response["data"])
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	render() {
		if (this.state.status == false) {
			return(
				<div>
					<div className="row">
						<table>
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
					</div>
					<div className="row">
						<div className="col l4"></div>
						<div className="col l2">
							<button className='btn' type="submit" name="move" value="opera">Opera</button>
						</div>
						<div className="col l2">
							<button className='btn' type="submit" name="move" value="game" onClick={ this.nice.bind(this, 0) } >Game</button>
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

export default BoS