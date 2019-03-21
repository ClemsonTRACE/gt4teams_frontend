import React, { Component } from 'react';
import M from 'materialize-css';

class PD extends Component {

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
				</div>
				<div className="row">
					<div className="col l4"></div>
					<div className="col l2">
						<button className='btn'>Cooperate</button>
					</div>
					<div className="col l2">
						<button className='btn'>Defect</button>
					</div>
					<div className="col l4"></div>
				</div>
			</div>
		)
	}
}

export default PD