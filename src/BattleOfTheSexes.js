import React, { Component } from 'react';
import M from 'materialize-css';

class BoS extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		M.AutoInit();
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
						<button className='btn' type="submit" name="move" value="game">Game</button>
					</div>
					<div className="col l4"></div>
				</div>
			</div>
		)
	}
}

export default BoS