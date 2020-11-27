// @ts-nocheck

/**
 * Student Name
 * @type {String}
 */
const studentName = 'Marcela Hernandez';


/**
 * Student Name
 * @type {array}
 * @param {number} socket.id - id del jugador dado por el socket
 * 
 **/
const players = {
    x: 'coorX',
    y: 'coorY',
    rotation: '0',
    playerId: 'socket.id',
    isLadron: 'la'

}


 /**
 * Carga de imagenes para el diseño del juego
 */
const Preload = {

}

/**
 * Añade los recursos cargados en preload() y todo lo que quiera verse en pantalla
 */
const Create = {
    
}

/**
 * Se genera el movimiento de los jugadores y las acciones de la ventana
 */
const Update = {
    
}

/**
 * Este metodo se llama cada vez que se mueven los jugadores.
 * @param {game} self - this
 */
const collisionPlayers = (self) =>{

}

/**
 * Cuando se genera una colisión entre los jugadores, además los desaparece y genera una explosion encima de ellos.
 * @param {carro} carro - El carro del jugador local
 * @param {group} otherPlayers - El grupo de jugadores que se encuentran con el jugador local
 *
 */
const overlap = (carro, otherPlayers) => {
   
}

/**
 * Añadir jugador local, sea policia o Santa.
 * @param {game} self - this
 * @param {array} playerInfo - informacion del jugador local
 * @param {image} tipoCarro - imagen sea trineo o policia
 * @param {number} sizeX - ancho de imagen
 * @param {number} sizeY - largo de imagen
 */
const addPlayer = (self, playerInfo, tipoCarro, sizeX, sizeY) => {

}

/**
 * Añadir jugador local, sea policia o Santa.
 * @param {game} self - this
 * @param {array} playerInfo - informacion del jugador local
 */
const addOtherPlayers = (self, playerInfo) => {

}

/**
 * Recibe la actualizacion el objeto Jugadores
 * @param {array} players - array de jugadores 
 */
const currentPlayers = (players) => {

}

/**
 * Recibe un movimiento de jugadores para verificar una colision
 */
const collisionBetweenPlayers = {

}

/**
 * Recibe los jugadores conectados en el servidor, y verifica si puede inciar el juego
 * @param {number} valor - numero de conectados
 */
const conectados = (valor) => {

}

/**
 * Recibe un nuevo jugador y avisa que esta listo para jugar
 */
 const bro = {

 }

 /**
 * Añade un nuevo jugador con el metodo addOTherPlayers()
 * @param {number} playerId - id del jugador que ya entrado
 */
const newPlayer = (playerId) => {

}
 
 /**
 * Recibe un jugador desconectado y lo destruye
 * @param {number} playerId - id del jugador que ya entrado
 */
const emmitDisconnect = (playerId) => {

}

 /**
 * Recibe un jugador que se ha movido y actualiza su posicion
 * @param {number} playerId - id del jugador que ya entrado
 */
const playerMoved = (playerId) => {

}

/**
 * Recibe una conexion dada por el socket y la emite al cliente. Ademas verifica si el juego ya puede empezar.
 * @param {socket} socket - conexion de entrada
 */
 const connection = (socket) => {

 }

 /**
 * Recibe una desconexion dada por el socket y la emite al cliente. Ademas verifica si ya no quedan mas jugadores.
 */
const onDisconnect = {

}

/**
 * Recibe un jugador que se ha movido y actualiza sus posiciones al resto de juagdores
*@param {movementData} movementData - jugador que se ha movido
*/
const playerMovement = (movementData) => {

}



