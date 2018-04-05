var socket = io();

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

function clearScreen() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShip(ship) {
    var x = ship.x, y = ship.y, theta = ship.rotation;

    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(
        x + 10 * Math.cos(theta),
        y + 10 * Math.sin(theta)
    );
    context.lineTo(
        x + 10 * Math.cos(theta + 2.3*Math.PI/3),
        y + 10 * Math.sin(theta + 2.3*Math.PI/3)
    );
    context.lineTo(
        x + 10 * Math.cos(theta + 3.7*Math.PI/3),
        y + 10 * Math.sin(theta + 3.7*Math.PI/3)
    );
    context.lineTo(
        x + 10 * Math.cos(theta),
        y + 10 * Math.sin(theta)
    );
    context.stroke();
}

var keys = {};
document.onkeydown = function(key) { keys[key.keyCode] = true; }
document.onkeyup   = function(key) { delete keys[key.keyCode]; }

socket.on('gameState', function(gameState) {
    clearScreen();

    socket.emit('inputState', keys);

    for (var k in gameState.ships) {
        drawShip(gameState.ships[k]);
    }
});
