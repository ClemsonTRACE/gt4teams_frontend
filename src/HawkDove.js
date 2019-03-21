import React, { Component } from 'react';
import M from 'materialize-css';

class HawkDove extends Component {

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
					<div className="col l4"></div>
					<div className="col l2">
						<p>Their Score: 12</p>
					</div>
					<div className="col l2">
						<p>Your Score: 8</p>
					</div>
					<div className="col l4"></div>
				</div>
				<div className="row">
					<table>
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
				</div>
				<div className="row">
					<div className="col l4"></div>
					<div className="col l2">
						<button className='btn'>Attack</button>
					</div>
					<div className="col l2">
						<button className='btn'>Peaceful</button>
					</div>
					<div className="col l4"></div>
				</div>
			</div>
		)
	}
}

export default HawkDove