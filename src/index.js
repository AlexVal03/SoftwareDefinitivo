//Aquí importamos todo lo que queremos 

const http = require('http'); //esto nos permite crear un server http (6)
const path = require('path'); // Importar el módulo 'path' para decirle la ruta de la carpeta
const express = require('express'); //ayuda a escribir el codigo del servidor y a crearlo (reutiliza codigo) (1) npm install express 
const socketio = require('socket.io'); //sirve para establecer conexion en tiempo real y funciona encima de un servidor, es decir debe haber ya un servidor creado (5)

const app = express(); //nos devuelve un objeto de js con funciones y metodos... (2)
const server = http.createServer(app); // le da el protocolo al servidor y le pasa los datos de app (8)
const io = socketio(server); //crea conexion en tiempo real con el servidor a traves de socketio, escuchando al server con protocolo http (9)

//Ajustes servidor
app.set('port', process.env.PORT||3000); //esto sirve para ejecutar el servidor en un puerto concreto, en este caso el 3000 de nuestro ordenador (11)

// importamos y ejecutamos un módulo que está en sockets para mejor escalabilidad y le paso como parámetro io (10)
require('./public/js/sockets')(io); 

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public'))); //esto sirve para enviarlo a los navegadores y que se conecten al servidor (4) (hay que indicarle la ruta) //con el path.join te ovlidas si esats en linux o windows

//Inicio del servidor
server.listen(app.get('port'), ()=> {
    console.log('Server on port', app.get('port')) //Comprobamos si ha iniciado bien
});
//se encaraga de ejecutar un servidor que se queda escuchando en algún puerto de nuestro ordenador (3) (empieza el servidor)