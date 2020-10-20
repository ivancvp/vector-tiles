const axios = require('axios');


//const destino = "https://nowsoft.app/visor-multiproposito/";

const destino = "http://localhost:9000/";


function servidorPost(uri,datos){

    return axios({
        method: 'post',
        url: destino+uri,
        data: datos,
        withCredentials: false
        })

}

function servidorGet(uri) {
        return axios.get(uri).then(resp => {
        return(resp.data);
    });
}

function redireccionar(error){
    if(error.response.status==403){
        window.location.href = './login.html';
    }
}

function getData(uri) {
    
    return axios.get(destino+uri,
        
        {
            responseType: 'arraybuffer'
        }
    ).then(resp => {

        return (resp);
        
    });
    
}


exports.getUrl=()=> { return destino };
exports.servidorPost=servidorPost;
exports.servidorGet = servidorGet;
exports.getData = getData;
exports.redireccionar=redireccionar;
