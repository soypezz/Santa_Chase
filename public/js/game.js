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

function preload() {
  //Carga de vehiculos
  this.load.image("carro", "assets/cars/trineo.png");
  this.load.image("policia", "assets/cars/Police.png");
  // this.load.image('startBoton','assets/mapa/start.png');

  //Carga del mapa
  this.load.image("fondo", "assets/mapa/fondoHielo.png");
  this.load.tilemapTiledJSON("mapa", "assets/mapa/mapa.json");
  this.load.image("tiles", "assets/mapa/terrain_atlas.png");
  this.load.image("fn", "assets/mapa/fondoHielo.png");
}

function create() {
  //Creacion del mapa
  this.add.image(655, 341, "fondo");
  mapa = this.make.tilemap({ key: "mapa" });
  var tilesets = mapa.addTilesetImage("terrain_atlas", "tiles");
  var solidos = mapa.createDynamicLayer("solidos", tilesets, 0, 0);
  solidos.setCollisionByProperty({ solido: true });

  //var botonHenry = this.add.sprite(655, 341, "startBoton").setInteractive();

  //botonHenry.on('pointerup', function (pointer) {
  //  this.setTint(0x00ff1a);
  //  this.empezar = true;
  //});

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
          sizeX = 30;
          sizeY = 45;
          addPlayer(self, players[id], "carro", sizeX, sizeY);
        } else {
          sizeX = 58;
          sizeY = 45;
          addPlayer(self, players[id], "policia", sizeX, sizeY);
        }
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });

  this.socket.on("collisionBetweenPlayers", () => {
    collisionPlayers(self);
  });

  this.socket.on("conectados", (valor) => {
    if (valor >= 2) {
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

  //Pregunta si el Jugador desconectado es el Ladron
  this.socket.on("¿SoyLadron?", function (playerInfo) {
    if (playerInfo.isLadron) {
      this.socket.emit("Si", true);
    }
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
        console.log("MOVEMENT DATA IN PLAYER MOVED", playerInfo);
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        otherPlayer.setDisplaySize(playerInfo.SizeX, playerInfo.SizeY);
        console.log("el wid: ", playerInfo.SizeX);
        console.log("el jai: ", playerInfo.SizeY);
      }
    });

    // collisionPlayers(self);
  });
  this.cursors = this.input.keyboard.createCursorKeys();

  //Colisiones entre jugador y mapa
  this.socket.on("checkpoint_location", function (checkpoint_location) {
    if (self.checkpoint) self.checkpoint.destroy();
    self.checkpoint = self.physics;
  });

  //Colisiones entre policias
}

function destruyete(carro, jugadorChocado) {
  jugadorChocado.setDisplaySize(1, 1);
  carro.setDisplaySize(1, 1);

  //console.log('jugadorChocadoID: ', jugadorChocado.playerId);
}

//Colision de jugadores
function collisionPlayers(self) {
  self.physics.add.overlap(
    self.carro,
    self.otherPlayers,
    destruyete,
    null,
    this
  );
}
//Creacion de vehiculo y jugador
function addPlayer(self, playerInfo, tipoCarro, sizeX, sizeY) {
  self.carro = self.physics.add
    .image(playerInfo.x, playerInfo.y, tipoCarro)
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
      .setDisplaySize(30, 45);
  } else {
    otherPlayer = self.add
      .sprite(playerInfo.x, playerInfo.y, "policia")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(58, 45);
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
        console.log({
          carro: this.carro,
          x: this.carro.displayHeight,
          y: this.carro.displayWidth,
        });
        this.socket.emit("playerMovement", {
          x: this.carro.x,
          y: this.carro.y,
          rotation: this.carro.rotation,
          SizeX: this.carro.displayHeight,
          SizeY: this.carro.displayWidth,
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
    alert("Se necesitan 2 jugadores para iniciar");
  }
}
