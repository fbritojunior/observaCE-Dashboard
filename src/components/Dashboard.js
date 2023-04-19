import React, { Component, createRef } from 'react';
import * as d3 from "d3";
import * as topojson from "topojson";
import "../css/main.css";
//import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

class Dashboard extends Component {

	constructor(props) {
		super(props);
		//this.textInput = React.createRef();
		this.svgRef = createRef();
	}

	componentDidMount() {
		this.drawChart();
	}

	drawChart() {

		var svg = d3.select(this.svgRef.current);//.append("svg")

		svg.attr("viewBox", "0 0 700 700")//.attr("id", "svg")
			.attr("preserveAspectRatio", "xMidYMid meet")
			.style("cursor", "auto");
		svg.attr("width", 700).attr("height", 700);

		var mapa = svg.append("g");//.attr("class", "mapa").attr("id", "mapaid");

		var projection = d3.geoMercator().scale(5800).rotate([0, 0]).center([-38, -4.50]);

		var path = d3.geoPath().projection(projection);

		var values = this.props.data

		var features = topojson.feature(values, values.objects.municipalities).features;

		var tooltip = d3.select('.tooltip-area')
			.style('opacity', 0);

		function mouseOver(event, d) {

			const currentPath = d3.select(this);
			var currentColor = currentPath.style('fill');

			currentPath//.transition()
				.style("stroke", "gray").style("stroke-width", 1).style("opacity", 0.5)
				.style('fill', 'black')
				.style("cursor", "pointer");

			tooltip.style("opacity", 1);
		};

		const mouseMove = (event, d) => {
			const text = d3.select('.tooltip-area__text');
			text.text(`${d.properties.name.toString().toLowerCase()} `);
			const [x, y] = d3.pointer(event);

			tooltip
				.attr('transform', `translate(${x}, ${y})`);
		};

		mapa.append("g").selectAll("path").data(features).enter().append("path").attr("name", function (d) {
			return d.properties.name;
		})
			.attr("id", function (d) {
				return d.id;
			})
			.attr("d", path)
			.on("mousemove", mouseMove)
			.on('mouseover', mouseOver //function (d) {
				//d3.select(this)
				//.style("stroke", "gray").style("stroke-width", 1).style("opacity", 0.5)
				//.style("cursor", "pointer"); 

				//d3.select(".county")
				//.text(d.properties.name.split(" ").map((w) => { return w[0].toUpperCase() + w.slice(1).toLowerCase() }).join(" ") );

				//d3.select('.details').style('visibility', "visible");
				//}
			)
			.on('mouseout', function (d) {

				d3.select(this)
					.style("stroke", null).style("fill", null).style("stroke-width", 0.5).style('opacity', 1);
				//d3.select('.details').style('visibility', "hidden");
				tooltip.style('opacity', 0);
			})
			.on("click", function (d) { });

	}

	render() {

		//return (
			//<svg ref={this.svgRef} >
			//	<g className="tooltip-area">
			//		<text className="tooltip-area__text"></text>
			//	</g>
			//</svg>
		//)
		return (
			<Layout style={{ height: 870 }}>
				<Header>header</Header>
				<Layout>
					<Sider>left sidebar</Sider>    
					<Content>
						<svg ref={this.svgRef} >	
							<g className="tooltip-area">
								<text className="tooltip-area__text"></text>
							</g>
						</svg>
					</Content>
					 
				</Layout>
				<Footer>
					<div style={{marginTop: 10}}>
                        Source Code <a href='https://github.com/'>https://github.com/</a>;
                        Author <a href='https://sdq.ai'>fbrito</a>;
                    </div>
				</Footer>
			</Layout>
		)
	}

}

export default Dashboard;