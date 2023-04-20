import React, { Component, createRef } from 'react';
import * as d3 from "d3";
import * as topojson from "topojson";
//import type { MenuProps } from 'antd';
//import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Layout } from 'antd';
import "../css/main.css";
import { ReactComponent as Logo } from '../images/logo.svg'


const { Header, Content, Footer, Sider } = Layout;

class Dashboard extends Component {

	constructor(props) {
		super(props);
		//this.textInput = React.createRef();
		this.svgRef = createRef();
		this.svgRef2 = createRef();

		this.state = {
			researchVar: null,
			researchYear: null,
			dataCounties: null
		};
	}

	componentDidMount() {
		const urlApi = 'https://servicodados.ibge.gov.br/api/v3/agregados/1301/periodos/2010/variaveis/615|616?localidades=N3[23]|N6[N3[23]]'
		fetch(urlApi)
			.then((response) => response.json())
			.then((json) => {
				var dataValuesIbge = json[0].resultados[0].series;
				const researchYear = Object.keys(dataValuesIbge[0].serie);
				let dataValues = [], dataName = [], groupData = [];

				for (let i = 1; i < dataValuesIbge.length; i++) {
					dataName = (dataValuesIbge[i].localidade.nome.split('-')[0].trim());
					dataValues = (parseFloat(dataValuesIbge[i].serie[researchYear]));
					groupData.push({ name: dataName, value: dataValues });
				}
				this.setState({ dataCounties: groupData, researchVar: json[0].variavel }, () => this.drawDash())
			}
				//this.setState({ dataCounties: json[0].resultados[0].series, researchVar: json[0].variavel }, () => this.drawDash())
			);
		//this.drawChart();
	}

	drawChart() { }

	drawBars() {
		var data = this.state.dataCounties;
		data = data.sort(function (a, b) {
			return d3.descending(a.value, b.value);
		})
		data = data.slice(0, 10);

		// set the dimensions and margins of the graph
		var margin = { top: 40, right: 40, bottom: 40, left: 40 },
			width = 500 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		var y = d3.scaleBand()
			.range([0, height])
			.padding(0.1);

		var x = d3.scaleLinear()
			.range([0, width]);

		var svg = d3.select("#my_dataviz").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// format the data
		//data.forEach(function(d) {
			//d.value = +d.value;
		//});

		// Scale the range of the data in the domains
		x.domain([0, d3.max(data, function (d) { return d.value; })])
		y.domain(data.map(function (d) { return d.name; }));
		//y.domain([0, d3.max(data, function(d) { return d.sales; })]);

		// append the rectangles for the bar chart
		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			//.attr("x", function(d) { return x(d.sales); })
			.attr("width", function (d) { return x(d.value); })
			.attr("y", function (d) { return y(d.name); })
			.attr("height", y.bandwidth());

		// add the x Axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// add the y Axis
		svg.append("g")
			.call(d3.axisLeft(y));
	}

	drawMap() {
		var svg = d3.select(this.svgRef.current);//.append("svg")

		svg.attr("viewBox", "0 0 700 700")//.attr("id", "svg")
			.attr("preserveAspectRatio", "xMidYMid meet")
			.style("cursor", "auto");
		svg.attr("width", 700).attr("height", 700);

		var mapa = svg.append("g");//.attr("class", "mapa").attr("id", "mapaid");

		var projection = d3.geoMercator().scale(5800).rotate([0, 0]).center([-38, -4.50]);

		var path = d3.geoPath().projection(projection);

		var values = this.props.data;

		var features = topojson.feature(values, values.objects.municipalities).features;

		//var tooltip = d3.select('.tooltip-area').style('opacity', 0);

		var Tooltip = d3.select("#tooltipId")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px")

		function mouseOver(event, d) {

			const currentPath = d3.select(this);
			var currentColor = currentPath.style('fill');

			currentPath//.transition()
				.style("stroke", "white").style("stroke-width", 2).style("opacity", 0.25)
				//.style('fill', 'white')
				.style("cursor", "pointer");

			//tooltip.style("opacity", 1);
			Tooltip.style("opacity", 1);

		};

		const mouseMove = (event, d) => {

			const propName = d.properties.name.toLocaleLowerCase();
			//const filteredItem = groupData.filter(e => e.name.toLocaleLowerCase() === propName);
			const filteredItem = this.state.dataCounties.filter(e => e.name.toLocaleLowerCase() === propName);
			//cons t values = Object.values(filteredItem[0])
			//console.log(filteredItem);

			//const text = d3.select('.tooltip-area__text');
			//text.text(`${d.properties.name.toString().toLowerCase()} ${ba[0].val} `);	
			//const [x, y] = d3.pointer(event);
			//tooltip.attr('transform', `translate(${x}, ${y})`);

			Tooltip
				.html(`${propName.split(' ').map(str => str.replace(/^./, s => s.toUpperCase())).join(' ').replace(/\sD[aeiou]\s/g, ss => ss.toLocaleLowerCase())} `)
				.style("left", (event.pageX + 20) + "px")
				.style("top", (event.pageY) + "px");
		};

		var color = d3.scaleLinear()
			.domain([1, 200])
			.range(["lightblue", "steelblue"]);

		var myColor = d3.scaleSequential()
			.interpolator(d3.interpolateInferno)
			.domain([1, 100])

		mapa.append("g").selectAll("path").data(features).enter().append("path")
			.attr("name", function (d) {
				return d.properties.name;
			})
			.attr("id", function (d) {
				return d.id;
			})
			.attr("d", path)
			//.attr('fill', '#e7d8ad')
			.attr('fill', function (d, i) { return color(i); })
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
				//tooltip.style('opacity', 0);
				Tooltip.style("opacity", 0);
			})
			.on("click", this.drawChart);
	}

	drawDash() {

		/*var dataValuesIbge = this.state.dataCounties;
		const researchYear = Object.keys(dataValuesIbge[0].serie);
		let dataValues =[], dataName =[], groupData =[];

		for(let i = 1; i<dataValuesIbge.length; i++) {
			dataName = (dataValuesIbge[i].localidade.nome.split('-')[0].trim());
			dataValues = (parseFloat(dataValuesIbge[i].serie[researchYear]));
			groupData.push({ name: dataName, value: dataValues });
		}*/

		this.drawMap();
		this.drawBars();
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
			<Layout style={{ height: 700 }}>
				<Header className="dash-header" > Dashboard para Visualização de Dados com React + D3.Js</Header>
				<Layout>
					<Sider>
						<Logo className='logo' />
					</Sider>
					<Content className="dash-content" >
							<div id="tooltipId" />
							<svg ref={this.svgRef} ></svg>
							<svg id='my_dataviz' />
							<svg ref={this.svgRef2} className='' id='svg2'></svg>
					</Content>
				</Layout>
				<Footer>
					<div style={{ marginTop: 0 }}>
						<p style={{ marginBottom: 0 }}>Desenvolvido por <a href='https://github.com/fbrito'>fbritojunior</a>.</p>
						<p>Código fonte em <a href='https://github.com/fbrito'>https://github.com/</a></p>
					</div>
				</Footer>
			</Layout>
		)
	}

}

export default Dashboard;