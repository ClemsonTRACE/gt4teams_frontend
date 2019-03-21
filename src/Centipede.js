import React, { Component } from 'react';
import M from 'materialize-css';

class Centipede extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		M.AutoInit();
	}

	render() {
		return(
			<div>
				<div class="row">
					<div class="col l4"></div>
					<div class="col l4">
						<h4>Size of the Pot: 10</h4>
					</div>
					<div class="col l4"></div>
				</div>
				<div class="row">
					<div class="col l4"></div>
					<div class="col l2">
						<h5>If you Take</h5>
						<p>You: 8</p>
						<p>Them: 2</p>
					</div>
					<div class="col l2">
						<h5>If you Push</h5>
						<p>Pot A: 16</p>
						<p>Pot B: 4</p>
					</div>
					<div class="col l4"></div>
				</div>
				<div class="row">
					<div class="col l4"></div>
					<div class="col l2">
						<button class='btn'>Take</button>
					</div>
					<div class="col l2">
						<button class='btn'>Push</button>
					</div>
					<div class="col l4"></div>
				</div>
			</div>
		)
	}
}

export default Centipede