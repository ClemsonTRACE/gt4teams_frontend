import React, { Component } from 'react';
import * as d3 from "d3";

//all inspired by this example https://observablehq.com/@d3/tidy-tree
//following this tutorial https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

class DecisionTree extends Component {

	componentDidMount() {
		this.drawChart();
	}

	componentWillUnmount() {
		d3.select("body svg").remove()
	}

	tree(data) {
		let root = d3.hierarchy(data);
		root.dx = 10;
		root.dy = this.props.width / (root.height + 1);
		return d3.tree().nodeSize([root.dx, root.dy])(root);
	}

	drawChart() {
		let root = this.tree(this.props.data);

		let x0 = Infinity;
		let x1 = -x0;
		root.each(d => {
			if (d.x > x1) x1 = d.x;
			if (d.x < x0) x0 = d.x;
		});

		let svg = d3.select("body")
			.append("svg")
			.attr("viewBox", [0, 0, this.props.width, x1 - x0 + root.dx * 2]);

		let g = svg.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

		let link = g.append("g")
			.attr("fill", "none")
			.attr("stroke", "#555")
			.attr("stroke-opacity", 0.4)
			.attr("stroke-width", 1.5)
			.selectAll("path")
			.data(root.links())
			.join("path")
			.attr("d", d3.linkHorizontal()
			.x(d => d.y)
			.y(d => d.x));

		let node = g.append("g")
			.attr("stroke-linejoin", "round")
			.attr("stroke-width", 3)
			.selectAll("g")
			.data(root.descendants())
			.join("g")
			.attr("transform", d => `translate(${d.y},${d.x})`);

		node.append("circle")
			.attr("fill", d => d.children ? "#555" : "#999")
			.attr("r", 2.5);

		node.append("text")
			.attr("dy", "0.31em")
			.attr("x", d => d.children ? -6 : 6)
			.attr("text-anchor", d => d.children ? "end" : "start")
			.text(d => d.data.name)
			.clone(true).lower()
			.attr("stroke", "white");

		return svg.node();
	}

	render() {

		return(
			<div>
			</div>
		)
	}
}

export default DecisionTree