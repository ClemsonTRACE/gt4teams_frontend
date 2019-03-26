import React, { Component } from 'react';
import M from 'materialize-css';
import axios from "axios";

class BoS extends Component {

	constructor(props) {
		super(props);
		this.state = {
			"history": {
				0: [0, 0],
				1: [0, 0],
				2: [0, 0]
			}
		}
	}

	componentDidMount() {
		M.AutoInit();
	}

	nice() {
		alert("hello")
		let ob = {
			"gameState": {
				"0": [2, 1], "1": [2, 1], "2": [2, 1]
			},
			"move": 1
		}
		let newOb = JSON.stringify(ob)
		// console.log(newOb, typeof(newOb))
		axios.post("http://localhost:8000/games/twoByTwo/pd/ppo", ob)
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	render() {
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
						<button className='btn' type="submit" name="move" value="game" onClick={ this.nice.bind(this) } >Game</button>
					</div>
					<div className="col l4"></div>
				</div>
			</div>
		)
	}
}

export default BoS