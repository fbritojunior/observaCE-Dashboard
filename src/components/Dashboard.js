import React, { Component, createRef } from 'react';
import * as d3 from "d3";
import * as topojson from "topojson";
//import type { MenuProps } from 'antd';
//import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Layout } from 'antd';
import "../css/main.css";
import { ReactComponent as Logo } from '../images/logo.svg';
import Select from 'react-select'

const { Header, Content, Footer, Sider } = Layout;

class Dashboard extends Component {

	constructor(props) {
		super(props);

		this.svgRef = createRef();
		this.svgRef2 = createRef();

		this.state = {
			researchVarArea: null,
			researchYearArea: null,
			dataCountiesArea: null,
			researchVarDensity: null,
			researchYearDensity: null,
			dataCountiesDensity: null,
			maxArea: null,
			minArea: null, 
			maxDensity: null,
			minDensity: null,
			maxH: null,
			minH: null,
			selectedOption: 0
		};

		//this.handleChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {

		const urlApi = 'https://servicodados.ibge.gov.br/api/v3/agregados/1301/periodos/2010/variaveis/615|616?localidades=N3[23]|N6[N3[23]]'
		fetch(urlApi)
			.then((response) => response.json())
			.then((json) => {
				var dataValuesIbgeArea = json[0].resultados[0].series;
				const researchYearArea = Object.keys(dataValuesIbgeArea[0].serie);
				let dataValuesArea = [], dataNameArea = [], groupDataArea = [];

				for (let i = 1; i < dataValuesIbgeArea.length; i++) {
					dataNameArea = (dataValuesIbgeArea[i].localidade.nome.split('-')[0].trim());
					dataValuesArea = (parseFloat(dataValuesIbgeArea[i].serie[researchYearArea]));
					groupDataArea.push({ name: dataNameArea, value: dataValuesArea });
				}
				//this.setState({ dataCountiesArea: groupDataArea, researchVarArea: json[0].variavel }, () => this.drawDash())
//debugger;
				var dataValuesIbgeDensity = json[1].resultados[0].series;
				const researchYearDensity = Object.keys(dataValuesIbgeDensity[1].serie);
				let dataValuesDensity = [], dataNameDensity = [], groupDataDensity = [];

				for (let i = 1; i < dataValuesIbgeDensity.length; i++) {
					dataNameDensity = (dataValuesIbgeDensity[i].localidade.nome.split('-')[0].trim());
					dataValuesDensity = (parseFloat(dataValuesIbgeDensity[i].serie[researchYearDensity]));
					groupDataDensity.push({ name: dataNameDensity, value: dataValuesDensity });
				}

				let objArrArea = Object.values(groupDataArea).map(e => e.value);
				let objArrDensity = Object.values(groupDataDensity).map(e => e.value);
				let objH = (objArrArea, objArrDensity).map((x, i) => objArrArea[i] * objArrDensity[i]);

		const maxArea = Math.max(...objArrArea),
			minArea = Math.min(...objArrArea);
		const maxDensity = Math.max(...objArrDensity),
			minDensity = Math.min(...objArrDensity);
		const maxH = Math.max(...objH),
			minH = Math.min(...objH);

				this.setState({ 
					dataCountiesArea: groupDataArea, 
					researchVarArea: json[0].variavel, 
					dataCountiesDensity: groupDataDensity, 
					researchVarDensity: json[1].variavel,
					maxArea: maxArea,
					minArea: minArea, 
					maxDensity: maxDensity,
					minDensity: minDensity,
					maxH: maxH,
					minH: minH
				}, () => this.drawDash())
			}
				//this.setState({ dataCounties: json[0].resultados[0].series, researchVar: json[0].variavel }, () => this.drawDash())
			);
	}

	drawBars() {

		var data = this.state.dataCountiesDensity;
		//d3.select('#title-bar').html(this.state.researchVarArea);
		data = data.sort(function (a, b) {
			return d3.descending(a.value, b.value);
		})
		data = data.slice(0, 10);

		var margin = { top: 30, right: 10, bottom: 30, left: 110 },
			width = 400 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

		var y = d3.scaleBand()
			.range([0, height])
			.padding(0.25);

		var x = d3.scaleLinear()
			.range([0, width]);

		var svg = d3.select("#bar-graph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var borderGraph = svg.append("rect")
			.attr("x", -1)
			.attr("y", 0)
			.attr("height", height + 0)
			.attr("width", width + margin.right)
			.attr("class", "foo");

		// format the data
		//data.forEach(function(d) {
		//d.value = +d.value;
		//});

		var color = d3.scaleLinear()
			.domain([1, 10])
			.range(["steelblue", "lightblue"]);

		x.domain([0, d3.max(data, function (d) { return d.value; })])
		y.domain(data.map(function (d) { return d.name; }));

		var Tooltip = d3.select("#tooltipId2")
			.append("div")
			.style("opacity", 0)
			.attr("class", "tooltip")
			.style("background-color", "white")
			.style("border", "solid")
			.style("border-width", "2px")
			.style("border-radius", "5px")
			.style("padding", "5px");

		var mouseover = function (d) {
			Tooltip
				.style("opacity", 1)
			d3.select(this)
				.style("stroke", "black")
				.style("opacity", 1);
		}

		var mousemove = function (event, d) {
			Tooltip
				.html("Densidade: " + d.value + " hab/km<sup>2</sup>.")
				.style("left", (event.pageX + 20) + "px")
				.style("top", (event.pageY - 10) + "px");
		}

		var mouseleave = function (d) {
			Tooltip
				.style("opacity", 0);
			d3.select(this)
				.style("stroke", "none")
				.style("opacity", 0.8)
		}

		svg.selectAll(".bar")
			.data(data)
			.enter().append("rect")
			.attr("class", "bar")
			//.attr("x", function(d) { return x(d.sales); })
			.attr("width", function (d) { return x(d.value); })
			.attr("y", function (d) { return y(d.name); })
			.attr("height", y.bandwidth())
			.attr('fill', function (d, i) { return color(i); })
			.on("mouseover", mouseover)
			.on("mousemove", mousemove)
			.on("mouseleave", mouseleave)

		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).ticks(3).tickFormat(x => `${x.toFixed(0)}`));

		svg.append("g")
			.call(d3.axisLeft(y));

		svg.append("text")
			.attr("x", (width / 2))
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			//.style("text-decoration", "underline")  
			.text(this.state.researchVarDensity);
	}

	drawMap() {

		var svg = d3.select(this.svgRef.current);//.append("svg")

		svg.attr("viewBox", "0 0 500 700")//.attr("id", "svg")
			.attr("preserveAspectRatio", "xMidYMid meet")
			.style("cursor", "auto");
		svg.attr("width", 400).attr("height", 600);

		var mapa = svg.append("g");//.attr("class", "mapa").attr("id", "mapaid");

		var projection = d3.geoMercator().scale(5800).rotate([0, 0]).center([-37.3, -4.50]);

		var path = d3.geoPath().projection(projection);

		var values = this.props.data;

		var features = topojson.feature(values, values.objects.municipalities).features;

		/*let objArrArea = Object.values(this.state.dataCountiesArea).map(e => e.value);
		let objArrDensity = Object.values(this.state.dataCountiesDensity).map(e => e.value);
		let objH = (objArrArea, objArrDensity).map((x, i) => objArrArea[i] * objArrDensity[i]);

		const maxArea = Math.max(...objArrArea),
			minArea = Math.min(...objArrArea);
		const maxDensity = Math.max(...objArrDensity),
			minDensity = Math.min(...objArrDensity);
		const maxH = Math.max(...objH),
			minH = Math.min(...objH);*/

		//var color = d3.scaleLinear()
		//	.domain([0, 200])
		//	.range(["lightblue", "steelblue"]);

		const minDensity = this.state.minDensity,
			maxDensity = this.state.maxDensity;

		var color = d3.scaleLog()
			.domain([minDensity, maxDensity])
			.range(["lightblue", "steelblue"]);

		//var color = d3.scaleLinear()
		//.domain([minArea, maxArea])
		//.range(["lightblue", "steelblue"]);

		//var color = d3.scaleSequential()
		//	.interpolator(d3.interpolateCool)
		//	.domain([minDensity, maxDensity]);

		const coloring = (d, i) => {
			const propName = d.properties.name.toLowerCase();
			const obj = Object.values(this.state.dataCountiesDensity).filter(e => e.name.toLowerCase() === propName)[0].value;
			return color(obj);
		}

		const drawChart = (_, d) => {

			let features = ["Área", "Densidade", "Hab"];

			const propName = d.properties.name.toLowerCase();
			//var objArrArea = Object.values(this.state.dataCountiesArea).map(e => e.value);
			//var objArrDensity = Object.values(this.state.dataCountiesArea).map(e => e.value);
			const objArea = Object.values(this.state.dataCountiesArea).filter(e => e.name.toLowerCase() === propName)[0].value;
			const objDensity = Object.values(this.state.dataCountiesDensity).filter(e => e.name.toLowerCase() === propName)[0].value;
			const objH = objArea * objDensity;

			const minDensity = this.state.minDensity,
				maxDensity = this.state.maxDensity;
			const minArea = this.state.minArea,
				maxArea = this.state.maxArea;
			const minH = this.state.minH,
				maxH = this.state.maxH;

			const normArea = (objArea - minArea) / (maxArea - minArea) * 100;
			const normDensity = (objDensity - minDensity) / (maxDensity - minDensity) * 100;
			const normH = (objH - minH) / (maxH - minH) * 100;

			let data = [{ 'Área': normArea, 'Densidade': normDensity, 'Hab': normH }]
			
			//generate the data
			//let data = [];
			//for (var i = 0; i < 1; i++){
			//var point = {}
			//each feature will be a random number from 1-9
			//features.forEach(f => point[f] = 1 + Math.random() * 8);
			//data.push(point);
			//}

			let width = 200, height = 200;

			d3.selectAll("#svg2 > *").remove();
			let svg = d3.select("#svg2").append("svg")
				.attr("width", width)
				.attr("height", height);

			//let radialScale = d3.scaleLinear()
			//.domain([0, 10])
			//.range([0, 100]);

			let radialScale = d3.scaleLinear()
				.domain([0, 100])
				.range([0, 100]);

			//let ticks = [2, 4, 6, 8, 10];
			let ticks = [33, 66, 100];

			svg.selectAll("circle")
				.data(ticks)
				.join(
					enter => enter.append("circle")
						.attr("cx", width / 2)
						.attr("cy", height / 2)
						.attr("fill", "none")
						.attr("stroke", "lightgray")
						.attr("r", d => radialScale(d))
				);

			svg.selectAll(".ticklabel")
				.data(ticks)
				.join(
					enter => enter.append("text")
						.attr("class", "ticklabel")
						.attr("x", width / 2 + 5)
						.attr("y", d => height / 2 - radialScale(d))
						.text(d => d.toString())
				);

			function angleToCoordinate(angle, value) {
				let x = Math.cos(angle) * radialScale(value);
				let y = Math.sin(angle) * radialScale(value);
				return { "x": width / 2 + x, "y": height / 2 - y };
			}

			let featureData = features.map((f, i) => {
				let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
				return {
					"name": f,
					"angle": angle,
					"line_coord": angleToCoordinate(angle, 100),
					"label_coord": angleToCoordinate(angle, 120)
				};
			});

			// draw axis line
			svg.selectAll("line")
				.data(featureData)
				.join(
					enter => enter.append("line")
						.attr("x1", width / 2)
						.attr("y1", height / 2)
						.attr("x2", d => d.line_coord.x)
						.attr("y2", d => d.line_coord.y)
						.attr("stroke", "gray")
				);

			// draw axis label
			svg.selectAll(".axislabel")
				.data(featureData)
				.join(
					enter => enter.append("text")
						.attr("x", d => d.label_coord.x)
						.attr("y", d => d.label_coord.y)
						.text(d => d.name)
				);

			let line = d3.line()
				.x(d => d.x)
				.y(d => d.y);

			let colors = ["darkorange", "gray", "navy"];

			function getPathCoordinates(data_point) {
				let coordinates = [];
				for (var i = 0; i < features.length; i++) {
					let ft_name = features[i];
					let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
					coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
				}
				return coordinates;
			}

			svg.selectAll("path")
				.data(data)
				.join(
					enter => enter.append("path")
						.datum(d => getPathCoordinates(d))
						.attr("d", line)
						.attr("stroke-width", '1px')
						.attr("stroke", (_, i) => colors[i])
						.attr("fill", (_, i) => colors[i])
						.attr("stroke-opacity", 1)
						.attr("opacity", 0.5)
				);
		};

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
			const filteredItem = this.state.dataCountiesArea.filter(e => e.name.toLocaleLowerCase() === propName);
			//cons t values = Object.values(filteredItem[0])
			

			//const text = d3.select('.tooltip-area__text');
			//text.text(`${d.properties.name.toString().toLowerCase()} ${ba[0].val} `);	
			//const [x, y] = d3.pointer(event);
			//tooltip.attr('transform', `translate(${x}, ${y})`);

			Tooltip
				.html(`${propName.split(' ').map(str => str.replace(/^./, s => s.toUpperCase())).join(' ').replace(/\sD[aeiou]\s/g, ss => ss.toLocaleLowerCase())} `)
				.style("left", (event.pageX + 20) + "px")
				.style("top", (event.pageY) + "px");
		};

		mapa.append("g").selectAll("path").data(features).enter().append("path")
			.attr("name", function (d) {
				return d.properties.name;
			})
			.attr("id", function (d) {
				return d.id;
			})
			.attr("d", path)
			//.attr('fill', '#e7d8ad')
			//.attr('fill', function (d, i) { return color(i); })
			.attr('fill', coloring)
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
			.on("click", drawChart);
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
	
	handleChange (selectedOption) {
		console.log(selectedOption);
		this.setState({ selectedOption: selectedOption.value});
		//setSelectedOption(selectedOption.value);
		//this.drawMap().drawChart(selectedOption);
		//debugger;
	}

	render() {
		//return (
		//<svg ref={this.svgRef} >
		//	<g className="tooltip-area">
		//		<text className="tooltip-area__text"></text>
		//	</g>
		//</svg>
		//)
		//const {dataCountiesArea} = this.state;
		
		//debugger;

		const options = 
			Object.values(this.props.data.objects.municipalities.geometries.map((item) => ({
					value: item.properties.name,
					label: item.properties.name.toLowerCase().replace(/^.|\s[a-z]/gi, s => s.toUpperCase()).replace(/\sD[a-z]\s/gi, s => s.toLowerCase())
				})));
		//Object.values(this.props.data.objects.municipalities.geometries.map(e => e.properties));
		/*[
			{ value: 'chocolate', label: 'Chocolate' },
			{ value: 'strawberry', label: 'Strawberry' },
			{ value: 'vanilla', label: 'Vanilla' }
		  ]*/
		return (
			<Layout style={{ height: 'auto' }}>
				<Header className="dash-header" > Painel para Visualização de Dados no Ceará</Header>
				<Layout>
					<Sider className="dash-sider" >
						<Logo className='logo' />
						<div className='siderTitle'>React + D3.Js</div>
						<Select options={options} onChange={this.handleChange} style={{}} />
					</Sider>
					<Content className="dash-content" >
						<div className='container-left'>
							<svg ref={this.svgRef} />
							<div id="tooltipId" />
						</div>
						<div className='container-center'>
							<svg ref={this.svgRef2} className='' id='svg2' />
						</div>
						<div className='container-right'>
							{/*<span id='title-bar'>untitled</span>*/}
							<svg id='bar-graph' />
							<div id="tooltipId2" />
						</div>
					</Content>
				</Layout>
				<Footer>
					<div style={{ marginTop: 0 }}>
						<span style={{ marginBottom: 0 }}>Desenvolvido por <a href='https://github.com/fbritojunior'>@fbritojunior</a>. </span>
						<span>Código fonte disponível em <a href='https://github.com/fbritojunior/observaCE-Dashboard'>https://github.com/</a></span>
					</div>
				</Footer>
			</Layout>
		)
	}
}

export default Dashboard;