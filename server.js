//Importamos los módulos necesarios
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

//Creamos una aplicación de Express
const app = express();

//Servimos archivos éstaticos, como el HTML y el cliente del juego
app.use(express.static("public"));

//Creamos un servidor HTTP con Express
const server = http.createServer(app);

//Creamos el servidor de WebSocket sobre el mismo servidor HTTP
const wss = new WebSocket.Server({
  server,
  noServer: false,
});

//Aquí creamos las salas y sus jugadores
let rooms = {};

//Función para asignar un jugador a una sala
function assignToRoom(ws) {
  let room = null;

  //Buscamos una sala disponible con menos de 2 jugadores
  for (let roomId in rooms) {
    if (rooms[roomId].players.length < 2) {
      room = rooms[roomId];
      break;
    }
  }

  //Si no encontramos una sala, creamos una nueva
  if (!room) {
    const roomId = `room-${Date.now()}`; //Creamos un ID único para la sala
    room = {
      id: roomId,
      players: [],
    };
    rooms[roomId] = room;
  }

  //Añadimos al jugador a la sala
  room.players.push(ws);

  //Si la sala tiene 2 jugadores, notificamos que el juego puede comenzar
  if (room.players.length === 2) {
    room.players.forEach((player) => {
      player.send(
        "Ambos jugadores están conectados. ¡El juego comienza ahora!",
      );
    });
  }

  //Guardamos la sala en el WebSocket del jugador para poder acceder después
  ws.room = room;
}

//Manejamos las conexiones de WebSocket
wss.on("connection", (ws) => {
  console.log("Un jugador se ha conectado");

  //Asignamos al jugador una sala
  assignToRoom(ws);

  //Manejamos mensajes del cliente
  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);

    //Enviar el mensaje a todos los jugadores excepto al que lo envió
    ws.room.players.forEach((player) => {
      if (player !== ws) {
        player.send(message);
      }
    });
  });

  //Manejamos la desconexión de un jugador
  ws.on("close", () => {
    console.log("Un jugador se ha desconectado");

    //Eliminamos al jugador de la sala
    if (ws.room) {
      ws.room.players = ws.room.players.filter((player) => player !== ws);

      //Si ya no quedan jugadores en la sala, la eliminamos
      if (ws.room.players.length === 0) {
        delete rooms[ws.room.id];
      }
    }
  });
});

//El servidor escucha en el puerto 3000
const PORT = process.env.PORT | 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

