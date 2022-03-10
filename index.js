const fs = require('fs');

const { Samsung, KEYS, APPS } = require('samsung-tv-control');

const saved_token = fs.readFileSync('token.txt').toString() || '45321935';

const config = {debug: 0, ip: '192.168.1.2', mac: '70-2C-1F-10-FE-5E', token: saved_token};

const control = new Samsung(config);

fs.writeFile('token.txt', 'test', (err)=>{if (err) return console.log(err)});

control.isAvailable().then(() => {
  console.log('tv available');
  control.getToken((token) => {
    console.info('# Response getToken:', token);
    if (token) fs.writeFile('token.txt', token, (err)=>{if (err) return console.log(err)});
  })
});

const express = require('express'),
app = express(),
port = 8080;

app.use(express.static(__dirname + '/public'));
app.listen(port);

const { WebSocket, WebSocketServer } = require('ws');

const wss = new WebSocketServer({
  port: 8082,
});

wss.on('connection', function connection(ws) {
  
  ws.on('message', function (data) {
    const key = 'KEY_'+data.toString().toUpperCase();
    console.log('ws_message', key);
    control.sendKey(key);
  });

});