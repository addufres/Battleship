const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

let currentGame;
let phase;
let turn;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World, from express');
});

app.post('/games/new', (req, res) => {
    currentGame = {"session_id": (Math.floor(Math.random() * 100000)).toString(), "phase":"setup","player":request.body.player_one};
    phase = "setup";
    turn = "player_one";
    console.log("Game: "+currentGame);
    response.status(201).send(currentGame.toString());
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));




// // GET route for getting game info
// // passes in a session_id
// // expects back game phase... setup | play | game_over
// // players array... names of players
// app.route('/games/:session_id').get((request, response) => {
//     response.send({

//     })
// })
