import Dashboard from './Dashboard'

//const files = ["https://raw.githubusercontent.com/fbritojunior/testrepo/main/ce-municipalities_geo.json"];
//Promise.all(files.map(url => d3.json(url))).then(function (values) {  
//})

function App() {
  let data_ = require('./data/ce-municipalities_topo.json');
  return ( <Dashboard data = {data_} /> );
}

export default App;
