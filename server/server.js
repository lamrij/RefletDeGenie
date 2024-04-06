// hello i'm comming from the IDE !!!
const http = require('http');
const express = require('express'); // Importer Express.js
const socketIo = require('socket.io');
const path = require('path');
// Création de l'application Express
const app = express();

// Création du serveur HTTP avec Express
const server = http.createServer(app);

const publicDir= path.join(__dirname,'../public');
// Middleware pour gérer les requêtes JSON
app.use(express.static(publicDir));

app.get('/',(req,res) => {
    res.sendFile(path.join(publicDir,'html','index.html')); // réponse pour la méthode get
});


// Endpoint pour obtenir l'heure actuelle au format JSON
app.get('/get_time', (req, res) => {
    const options = { timeZone: 'Europe/Paris' }; // fuseau horaire
    const currentTime = new Date().toLocaleTimeString('fr-FR',options);
    res.json({ time: currentTime });
});

// Endpoint pour valider une requête du client
app.post('/validate_request',(req,res) => {
    console.log('Request has been validated from client');
    res.status(200).send('Request has been validated');
});

// End point pour annuler une requête du client
app.post('/cancel_request',(req,res) => {
    console.log('Request has been cancelled from client');
    res.status(200).send('Request has been canceled');
});


// Écoute du port 9468
const PORT = process.env.PORT || 9468;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Création de l'instance Socket.IO attachée au serveur HTTP
const io = socketIo(server);

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log('A client connected');

    // Envoi de l'heure au client dès qu'il se connecte
    const currentTime = new Date().toLocaleTimeString();
    socket.emit('time_update', { time: currentTime });

    // Ecoute d'évènements pour la sélection de couleurs
    socket.on('color_selected',(color) => {
        // Envoyer la couleur sélectionnée à l'app kivy
        io.emit('change_color',color);
    });

});

let frameColor = [1,1,0.9,1]; // couleur par défaut de la frame

// Route pour recevoir la couleur selectionnée
app.post('/set_frame_color', (req, res) => {
    const color = req.body.color;
    if(isValidColor(color)){
        frameColor=color;
        res.status(200).send('Couleur MAJ avec succès');
    } else {
        res.status(400).send('Couleur Invalide');
    }
});


// Fonction pour vérifier si la couleur est valide
function isValidColor(color) {
    // vérifier si la couleur est au bon formart
    return Array.isArray(color) && color.length === 4;
}

//Route pour obtenir la couleur actuelle de la frame
app.get('/get_frame_color',(req,res) => {
    res.status(200).json({color: frameColor});
});