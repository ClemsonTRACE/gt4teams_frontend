import React, { Component } from 'react';
import M from 'materialize-css';

class Ultimatum extends Component {

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
					<div className="col l4">
						<h4 className="center-align">Their Turn</h4>
						<h4 className="center-align">Size of the Pot: 10</h4>
					</div>
					<div className="col l4"></div>
				</div>
				<div className="row">
					<div className="col l4"></div>
					<div className="col l4">
						<h4 className="center-align">Their Offer: 5</h4>
						<div className="row">
							<div className="col l3"></div>
							<div className="col l2">
								<button className='btn'>Accept</button>
							</div>
							<div className="col l2"></div>
							<div className="col l2">
								<button className='btn'>Reject</button>
							</div>
							<div className="col l3"></div>
						</div>
					</div>
					<div className="col l4"></div>
				</div>
			</div>
		)
	}
}

export default Ultimatum