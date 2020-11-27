var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1335,
  height: 682,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var mapa;
var conectados = 0;
var ready = false;
var player1;
var player2;
var empezar = false;
var finalizado = false;
var identidad;
var identidadOtro;

function preload() {
  //Carga de vehiculos
  this.load.image("carro", "assets/cars/trineo.png");
  this.load.image("policia", "assets/cars/Police.png");
  this.load.image("placa", "assets/cars/policePlaca.png" );
  // this.load.image('startBoton','assets/mapa/start.png');

  //Carga del mapa
  this.load.image("fondo", "assets/mapa/fondoHielo.png");
  this.load.tilemapTiledJSON("mapa", "assets/mapa/mapa.json");
  this.load.image("tiles", "assets/mapa/terrain_atlas.png");
  this.load.image("fn", "assets/mapa/fondoHielo.png");
  this.load.image("explotion", "assets/mapa/explotion.png");
}

function create() {
  //Creacion del mapa
  this.add.image(655, 341, "fondo");
  mapa = this.make.tilemap({ key: "mapa" });

  //Declaracion de socket y otros jugadores
  var self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
  var sizeX;
  var sizeY;

  //Actualizar objeto Jugadores
  this.socket.on("currentPlayers", function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        if (players[id].isLadron) {
          sizeX = 35;
          sizeY = 50;
          identidad = true;
          addPlayer(self, players[id], "carro", sizeX, sizeY);
        } else {
          sizeX = 35;
          sizeY = 48;
          identidad = false;
          addPlayer(self, players[id], "policia", sizeX, sizeY);
        }
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });


//Verificacion de collision
  this.socket.on("collisionBetweenPlayers", () => {
    collisionPlayers(self);
  });

  this.socket.on("conectados", (valor) => {
    if (valor >= 3) {
      this.ready = true;
      this.socket.emit("listos");
    }
  });

  this.socket.on("bro", () => {
    this.ready = true;
  });

  //Jugador añadido
  this.socket.on("newPlayer", function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });



  //Jugador desconectado
  this.socket.on("disconnect", function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });

  //Actualizar informacion de los jugadores
  this.socket.on("playerMoved", function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
      //  console.log("MOVEMENT DATA IN PLAYER MOVED", playerInfo);
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        otherPlayer.setDisplaySize(playerInfo.SizeX, playerInfo.SizeY);
        
      }
    });
  });

  this.cursors = this.input.keyboard.createCursorKeys();

  //Colisiones entre jugador y mapa
  this.socket.on("checkpoint_location", function (checkpoint_location) {
    if (self.checkpoint) self.checkpoint.destroy();
    self.checkpoint = self.physics;
  });

  //Colisiones entre policias
}


//Colision de jugadores
function collisionPlayers(self) {
  self.physics.add.overlap(self.carro, self.otherPlayers, function (carro, jugadorChocado) {
   jugadorChocado.setDisplaySize(0,0);
   carro.setDisplaySize(0,0);

    self.add.image(jugadorChocado.x, jugadorChocado.y, "explotion");
    self.add.image(carro.x, carro.y, "explotion");

    if (identidad) {
      console.log('choque como el ladron');
      finalizado = true;
    } else {
      console.log('choque como un policia');
    }

    if (identidadOtro) {
      finalizado = true;
      console.log('choco el ladron');
      
    } else {
      console.log('choco un policia');
    }

    if(finalizado){
      self.add.image(655, 341, "placa");
     // this.socket.on("ganadores");
    }
  }
  );
}
//Creacion de vehiculo y jugador
function addPlayer(self, playerInfo, tipoCarro, sizeX, sizeY) {
  self.carro = self.physics.add
    .image(playerInfo.x, playerInfo.y, tipoCarro)
    .setBounce(1)
    .setOrigin(0.5, 0.5)
    .setDisplaySize(sizeX, sizeY)
    .setOffset(8, 12)
    .setOffset(8, 12);
  self.carro.setDrag(250);
  self.carro.setAngularDrag(250);
  self.carro.setMaxVelocity(200);
  self.carro.setCollideWorldBounds(true);
}

//Creacion de los autos de los demas jugadores en el servidor
function addOtherPlayers(self, playerInfo) {
  var otherPlayer;
  if (playerInfo.isLadron) {
    otherPlayer = self.add
      .sprite(playerInfo.x, playerInfo.y, "carro")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(35, 50);
      identidadOtro = true;
  } else {
    otherPlayer = self.add
      .sprite(playerInfo.x, playerInfo.y, "policia")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(35, 48);
      identidadOtro = false;
  }
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}

function update() {
  if (this.ready) {
    //Movimiento del carro
    if (this.carro) {
      if (this.cursors.left.isDown) {
        this.carro.setAngularVelocity(-150);
      } else if (this.cursors.right.isDown) {
        this.carro.setAngularVelocity(150);
      } else {
        this.carro.setAngularVelocity(0);
      }
      if (this.cursors.up.isDown) {
        this.physics.velocityFromRotation(
          this.carro.rotation + 1.5,
          50,
          this.carro.body.acceleration
        );
      } else {
        this.carro.setAcceleration(0);
      }
      // emite el movimiento del jugador
      var x = this.carro.x;
      var y = this.carro.y;
      var r = this.carro.rotation;
      if (
        this.carro.oldPosition &&
        (x !== this.carro.oldPosition.x ||
          y !== this.carro.oldPosition.y ||
          r !== this.carro.oldPosition.rotation)
      ) {
       
        this.socket.emit("playerMovement", {
          x: this.carro.x,
          y: this.carro.y,
          rotation: this.carro.rotation,
          SizeX: this.carro.displayWidth,
          SizeY: this.carro.displayHeight,
        });
      }
      // guarda la ultima posicion del jugador
      this.carro.oldPosition = {
        x: this.carro.x,
        y: this.carro.y,
        rotation: this.carro.rotation,
      };
    }
  } else {
    alert("Para jugar deben entrar 3 jugadores");
  }
}
