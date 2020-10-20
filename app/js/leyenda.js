import React,{Component} from 'react';


import variables from './variables'

const Leyenda=()=> {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = React.useState(0);
  
    return (
      <div>
        <p id="titulo">Leyenda</p>
            <p className="descripcion">{variables.col4.titulo}  </p>
            <div>
                {variables.col4.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col4.colores[e]}}></span><p>{i}</p></div>)}
            </div>
            <p className="descripcion">
                {variables.col5.titulo}  
            </p>
            <div>
            {variables.col5.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col5.colores[e]}}></span><p>{i}</p></div>)}
            </div>
            <p className="descripcion">
                {variables.col6.titulo}  
            </p>
            <div>
            {variables.col6.labels.map((i, e) => <div className="item" ><span style={{backgroundColor:variables.col6.colores[e]}}></span><p>{i}</p></div>)}
            </div>
      </div>
    );
  }

export default Leyenda;
