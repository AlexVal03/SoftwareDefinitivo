//Definimos io en index.js, pero pasamos aqui todo lo que tenga que ver con sockets para la escalabilidad de la aplicacion

module.exports = function(io){

    //Array con usuarios
    let arrUsuarios = [];

    //Conectamos el cliente con el servidor (9) (esto nos permite tener código js disponible para nuestro servidor, gracias a io, por lo que en el código html podremos utilizar esto)
    io.on('connection', socket=>{
        console.log('Welcome!'); //Vemos si nos conectamos al servidor
    
        socket.on('new user', (data, callback) =>{
            if (arrUsuarios.indexOf(data)!=-1){ //Comprobamos si no es valido el nombre porque ya existe
                console.log('Nombre existente')
                callback(false);
            }else{ //Si es válido
                console.log('Nuevo usuario registrado')
                socket.usuarios = data;
                arrUsuarios.push(socket.usuarios); //agrego el nuevo usuario en memoria
                io.sockets.emit('usernames', arrUsuarios);
                callback(true) 
            }
    });

    //Para el envío de mensajes
    socket.on('send message', function (data){ // cuando el servidor reciba este mensaje, debe estar atento a recibir datos
        console.log(data); //aquì recibo el dato
        // debo retransmitirlo a todos los usuarios con io pq está conectado a todos los sockets
        io.sockets.emit('new message', data) //cuando recibo a trvés de send message, envío datos con otro evento
    });

    //Para desconectar al usuario
    socket.on('disconnect', data=>{
        console.log('Me estoy desconectando') //Comprobación desconexión
        if(!socket.usuarios) return; // si socket no tiene propiedad llamada usuarios
        arrUsuarios.splice(arrUsuarios.indexOf(socket.usuarios), 1); //método que permite quitar un solo elemento indicando el índice
        io.sockets.emit('usernames', arrUsuarios);//emite usuarios

    });
    });
}