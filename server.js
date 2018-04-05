const path = require('path');
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

const KEY_LEFT  = 37;
const KEY_UP    = 38;
const KEY_RIGHT = 39;
const KEY_DOWN  = 40;

app.use('/', express.static(path.join(__dirname, 'client')));

http.listen(3000, function() {
    console.log('Good to go on *:3000');
});

let userSockets = [];

let gameState = {
    ships: {}
};

function newShip() {
    return {
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: 4 * Math.random() - 2,
        vy: 4 * Math.random() - 2,
        rotation: 2 * Math.PI * Math.random(),
        inputs: {}
    };
}

function updateShip(ship) {
    if (ship.inputs[KEY_UP]) {
        ship.vx += Math.cos(ship.rotation);
        ship.vy += Math.sin(ship.rotation);
    }

    if (ship.inputs[KEY_LEFT]) {
        ship.rotation -= 0.1;
    }

    if (ship.inputs[KEY_RIGHT]) {
        ship.rotation += 0.1;
    }

    ship.x += ship.vx;
    ship.y += ship.vy;
}

function update() {
    for (let k in gameState.ships) {
        updateShip(gameState.ships[k]);
    }

    userSockets.forEach(x => {
        x.emit('gameState', gameState);
    });
}

io.on('connection', function(socket) {
    userSockets.push(socket);
    gameState.ships[socket.id] = newShip();
    console.log('user connected: ' + socket.id);

    socket.on('disconnect', function() {
        userSockets.splice(userSockets.indexOf(socket), 1);
        delete gameState.ships[socket.id];
        console.log('user disconnected: ' + socket.id);
    });

    socket.on('inputState', function(keys) {
        gameState.ships[socket.id].inputs = keys;
    });
});

setInterval(update, 50);
