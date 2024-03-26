//Aquí creamos la funcionaldiad de la aplicación

$(function (){

    //Creamos la constante socket con conexión al servidor
    const socket = io();
  
    //Elementos interfaz app
    const $chat = $(".conversacion");
    const $envio_msj =$(".boton");
    const $mensaje = $(".esc");
  
    //Elementos interfaz login
    const $envio_log = $(".login");
    const $usuario =$("#username");
    const $error = $(".err");
    
    //Usuarios que saldrán en el chat de app 
    const $usuarios = $(".chaters");

    //Variable de usuario para manejar la información
    let username = "";

    $('.login-container').show(); //Primero mostramos solo el login
    $('.contenedor-app').hide();
  
    //Si se registra un usuario y se le pasan datos
    $envio_log.submit(e=>{
      e.preventDefault(); //para evitar que refresque al enviar el nombre
      socket.emit('new user', $usuario.val(), data=>{ //emitimos datos del usuario
          if (data){
            username = $usuario.val();
            $('.login-container').hide(); //escondemos la interaz login
            $('.contenedor-app').show(); //mostramos la app
            $usuarios.scrollTop($usuarios.prop('scrollHeight'));  
          }else{ //Si el usuario no puede registrarse
            $error.html(`Prueba otro nombre`); //Mensaje de error
            $error.show();
          }
          $usuario.val(''); //Limpiar el imput del usuario después de enviarlo
      }) 
    })
  
    // Eventos de mensaje (click boton)
    $envio_msj.on('click', element => {
      element.preventDefault(); //para que no se refresque al enviar datos
      const mensaje = $mensaje.val().trim(); //Obtener el mensaje del input
      if (mensaje !== '') { //Verificar que el mensaje no esté vacío
          const hora = new Date().toLocaleTimeString(); //Vemos a que hora es
          var mensaje_e = `<div class='box'><div class='us'>${username}</div> <div class="manejo-msj"> <p class='msj'>${mensaje}</p> <p class='h'>${hora} </p></div></div> </br>`; //Creamos mensaje en el html
          socket.emit('send message', mensaje_e); //Enviar el mensaje al servidor
      }
      $mensaje.val(''); //Limpiar el input del mensaje después de enviarlo
    })
  
    //Tratamos el evento de mensaje mensaje
    socket.on('new message', function(data){
      $chat.append(data);
      $chat.scrollTop($chat.prop('scrollHeight'));  
    });
  
    //Recibimos los datos de usuario
    socket.on('usernames', data=>{
      let html = '';
      for (let i=0; i<data.length; i++){ //cuando recibamos los datos creamos una variable que lleve las etiquetas p
        html += `<p>${data[i]}</p>` //Lo añadimos en el html
      }
      $usuarios.html(html);
    })
  
  // Evento para cerrar sesión
    $(".bcs").on('click', function(){
      console.log('cerrar sesión'); //mensaje de comprobacion
      socket.disconnect();
      $('.contenedor-app').hide(); //escondemos interfaz de app
      $('.login-container').show(); //activamos interfaz login
      socket.connect(); 
      $error.hide(); //Escondemos mensaje de error
  })
})