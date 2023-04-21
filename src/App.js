import React, { Component } from 'react';
import Dashboard from './components/Dashboard'
import './css/App.css'

//const files = ["https://raw.githubusercontent.com/fbritojunior/testrepo/main/ce-municipalities_geo.json"];
//Promise.all(files.map(url => d3.json(url))).then(function (values) {  
//})

let data_ = require('./data/ce-municipalities_topo.json');

class App extends Component {

  //componentDidUpdate() {

    //this.setState({ totalValue: 0 }, () => {
    //  console.log(this.state.totalValue, 'teste');
    //}); 

    //const urlApi = 'https://servicodados.ibge.gov.br/api/v3/agregados/1301/periodos/2010/variaveis/615|616?localidades=N3[23]|N6[N3[23]]'
    //fetch(urlApi);
    
        //.then(async response => {
        //  const data2 = await response.json();

        //  if (!response.ok) {
        //    const error = (data2 && data2.message) || response.statusText;
        //    return Promise.reject(error);
        //  }

        //  this.setState({ totalValue: data2[1].variavel })
        
       // })
       // .catch(error => {
        //  this.setState({ errorMessage: error.toString() });
        //  console.error('There was an error!', error);
        //});

        //.then((response) => response.json())
        //.then((json) =>  
        //  this.setState({ totalValue: json[1].variavel  })
        //);

        //.then(res => res.json())
        //.then(
         // (result) => {
          //  this.setState({
              //isLoaded: true,
          //    totalValue: result[1].variavel
          //  })
          //},
          //(error) => {
          //  this.setState({
              //isLoaded: true,
          //    error   
          //  });
          //}
       // )


        //.then(datax => this.setState({totalValue: datax}))
  //}

  render() {
    //const { totalValue } = this.state;
    return ( 
      <Dashboard data = {data_} /> 
    );
  }
}

export default App;
