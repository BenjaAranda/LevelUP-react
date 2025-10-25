// En: test-server.js
const http = require('http'); // Módulo HTTP nativo de Node.js

const hostname = '127.0.0.1'; // localhost
const port = 5173; // El puerto que Vite suele usar

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hola desde Node!\n'); // Mensaje simple
});

server.listen(port, hostname, () => {
  console.log(`Servidor Node simple corriendo en http://${hostname}:${port}/`);
  console.log('Intenta abrir esta URL en tu navegador.');
  console.log('Si ves "Hola desde Node!", el problema está en Vite/React.');
  console.log('Si NO puedes conectar, el problema es tu red local o Node.');
});