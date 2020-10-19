const http = require('http');
const app = require('./app');
// ajout de normalizePort renvoie un port valide
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
// ajout du port sur lequel l'application vas tourner
const port = normalizePort(process.env.PORT ||  '8081');
app.set('port', port);
// ajout de errorHandler qui recherche les différentes erreurs et les gère de manière appropriée et Elle est ensuite enregistrée dans le serveur 
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
//ajout de l'application dans notre logique server
const server = http.createServer(app);
// ajout de l'écoute du port
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Connexion au ' + bind);
});

server.listen(port);