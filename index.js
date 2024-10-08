const { PORT } = require('./config');
const [express, http, WebSocket, path] = [require('express'), require('http'), require('ws'), require('path')];

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', message => {
        wss.clients.forEach(client => {
            if (WebSocket.OPEN === client.readyState) client.send(message.toString());
        });
    });
});

server.listen(+PORT);
