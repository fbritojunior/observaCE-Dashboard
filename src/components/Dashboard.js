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

		this.state = {
			researchVar : null,
			researchYear: null,
			dataCounties: null 
		};
	}

	componentDidMount() {
		const urlApi = 'https://servicodados.ibge.gov.br/api/v3/agregados/1301/periodos/2010/variaveis/615|616?localidades=N3[23]|N6[N3[23]]'
    	fetch(urlApi)
		.then((response) => response.json())
		.then((json) =>  
			this.setState({ dataCounties: json[0].resultados[0].series, researchVar:json[0].variavel }, () => this.drawChart())
    	);

		//this.drawChart();
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

		var values = this.props.data;
		var dataValuesIbge = this.state.dataCounties;
		const researchYear = Object.keys(dataValuesIbge[0].serie);
		let dataValues = [], dataName = [], groupData = [];

		for (let i=1; i<dataValuesIbge.length; i++){
			dataName = (dataValuesIbge[i].localidade.nome.split('-')[0].trim());
			dataValues = (parseFloat(dataValuesIbge[i].serie[researchYear]));
			groupData.push({name: dataName,value: dataValues});
		}

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
			const filteredItem = groupData.filter(e => e.name.toLocaleLowerCase() === propName);
			//const values = Object.values(filteredItem[0])

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
    .domain([1,100])

		mapa.append("g").selectAll("path").data(features).enter().append("path")
		.attr("name", function (d) {
			return d.properties.name;
		})
			.attr("id", function (d) {
				return d.id;
			})
			.attr("d", path)
			//.attr('fill', '#e7d8ad')
			.attr('fill', function(d,i) {  return color(i); })
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
				<Header className="dash-header" > Dashboard para Visualização de Dados com React + D3.Js</Header>
				<Layout>
					<Sider>sidebar</Sider>    
					<Content className="dash-content" >
						<div id="tooltipId" />
						<svg ref={this.svgRef} >
						</svg>
					</Content>
				</Layout>
				<Footer>
					<div style={{marginTop: 0}}>
                        <p style={{marginBottom: 0}}>Desenvolvido por <a href='https://github.com/fbrito'>fbritojunior</a>.</p>
						<p>Código fonte em <a href='https://github.com/fbrito'>https://github.com/</a></p>
                    </div>
				</Footer>
			</Layout>
		)
	}

}

export default Dashboard;