const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const helper = require('./helper');

const app = express()
const port = 3000

let game;
let currentGame;
let phase;
let turn;
let colArr = ['A','B','C','D','E','F','G','H','I','J'];
let rowArr = ['0','1','2','3','4','5','6','7','8','9'];
let players = {
    player1: "",
    player2: ""
};
let player1Ships = [
    {
        type: "carrier",
        length: 5
    },
    {
        type: "battleship",
        length: 4
    },
    {
        type: "cruiser",
        length: 3
    },
    {
        type: "submarine",
        length: 3
    },
    {
        type: "destroyer",
        length: 2
    }
]
let player2Ships = [
    {
        type: "carrier",
        length: 5
    },
    {
        type: "battleship",
        length: 4
    },
    {
        type: "cruiser",
        length: 3
    },
    {
        type: "submarine",
        length: 3
    },
    {
        type: "destroyer",
        length: 2
    }
]
let player1Grid = [
    {"tile":"A0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J9","marked":false,"hit":null,"direction":null,"ship":null},
]
let player2Grid = [
    {"tile":"A0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"A9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"B9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"C9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"D9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"E9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"F9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"G9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"H9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"I9","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J0","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J1","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J2","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J3","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J4","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J5","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J6","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J7","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J8","marked":false,"hit":null,"direction":null,"ship":null},
    {"tile":"J9","marked":false,"hit":null,"direction":null,"ship":null},
]


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// TESTED IN POSTMAN
app.post('/games/new', (req, res) => {
    players.player1 = req.body.player1;
    players.player2 = req.body.player2;
    currentGame = {"phase":"setup","players":players};
    phase = "setup";
    turn = "player_one";  
    game = currentGame; 
    game.session_id = (Math.floor(Math.random() * 100000)).toString(); 
    console.log("Player 1: "+players.player1)
    console.log("Player 2: "+players.player2)
    console.log("Session ID: "+game.session_id)
    res.send({"session_id":game.session_id,"phase":currentGame.phase,"player":currentGame.players.player1});
});

// TESTED IN POSTMAN
app.get('/games/:session_id', (req, res) => {
    res.json(currentGame);
});

app.post('/games/:session_id/setup', (req, res) => {
    // set local function fields to utilize throughout setup
    const sessionId = req.params.session_id;
    const setup = req.body;
    const coordinate = setup.coordinate;
    const direction = setup.direction;
    const player = setup.player;
    const ship = setup.ship;
    const column = coordinate.charAt(0).toUpperCase().match(/[A-J]/g);
    let colCondition = false;
    const row = coordinate.charAt(1).match(/[0-9]/g);
    let rowCondition = false;
    for(let i = 0; i<colArr.length;i++){
        if(colArr[i]===column[0]){
            colCondition = true;
            break;
        } else {colCondition = false}
    }    
    for(let i = 0; i<rowArr.length;i++){
        if(rowArr[i]===row[0]){
            rowCondition = true;
            break;
        } else {rowCondition = false}
    }
    let length;
    if(ship === "carrier") length = 5;
    if(ship === "battleship") length = 4;
    if(ship === "cruiser") length = 3;
    if(ship === "submarine") length = 3;
    if(ship === "destroyer") length = 2;
    // check that coordinate given is within the grid
    // and that we have the correct session_id for the game
    console.log(`checking if ${colCondition} && ${rowCondition} && ${sessionId} === ${game.session_id}`)
    if(colCondition && rowCondition && (sessionId === game.session_id)) {
        // check that ship would fit with direction
        if(direction === "right") {
            // convert alpha to numeric on the columns for comparison
            let col = helper.convertAlphaToNumeric(coordinate.charAt(0), 0);
            if(col + length > 10) { // column location plus length of ship is wider than grid
                console.log(`Player ${player}...
                             chose coordinate ${coordinate}...
                             with ship ${ship} facing ${direction}
                             This does not fit here it is the next player's turn...`)
                if(player === players.player1) {
                    turn = "player_two"
                    res.send({"placed": false, "next_player": players.player2, "phase": "setup"});
                } else {
                    turn = "player_one";
                    res.send({"placed": false, "next_player": players.player1, "phase": "setup"}); //unable to place try again
                }
            } else { // it will fit facing right so perform logic to add ship to board and remove from pile
                console.log(`Player ${player}...
                        chose coordinate ${coordinate}...
                        with ship ${ship} facing ${direction}`)
                if(player === players.player1) {
                    console.log(`Player 1 has ${player1Ships.length} ships left in their shipyard.`)
                    if(player1Ships.length > 0) {
                        console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                        helper.handleShips(res, column, row, coordinate, ship, player1Grid, player1Ships, players, player)
                    }
                } else {
                    console.log(`Player 2 has ${player2Ships.length} ships left in their shipyard.`)
                    if(player2Ships.length > 0) {
                        console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                        helper.handleShips(res, column, row, coordinate, ship, player2Grid, player2Ships, players, player)
                    }
                }
            }
        } else {
            // convert numeric string to number on the rows for comparison
            let numericRow = helper.convertNumericStringToNumber(coordinate.charAt(1), 0);
            if(numericRow + length > 10) { // column location plus length of ship is wider than grid
                console.log(`Player ${player}...
                             chose coordinate ${coordinate}...
                             with ship ${ship} facing ${direction}
                             This does not fit here it is the next player's turn...`)
                if(player === players.player1) {
                    turn = "player_two"
                    res.send({"placed": false, "next_player": players.player2, "phase": "setup"});
                } else {
                    turn = "player_one";
                    res.send({"placed": false, "next_player": players.player1, "phase": "setup"}); //unable to place try again
                }
            } else { // it will fit facing right so perform logic to add ship to board and remove from pile
                console.log(`Player ${player}...
                        chose coordinate ${coordinate}...
                        with ship ${ship} facing ${direction}`)
                if(player === players.player1) {
                    console.log(`Player 1 has ${player1Ships.length} ships left in their shipyard.`)
                    if(player1Ships.length > 0) {
                        console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                        for(let key = 0; key<player1Grid.length; key++) {
                            console.log(`Comparing ${player1Grid[key].tile} against ${column[0]}${row[0]} and ${player1Grid[key].marked}`)
                            if(player1Grid[key].tile === ""+column[0]+row[0]+"" && player1Grid[key].marked == false) {
                                console.log(`Found selected coordinate: ${coordinate} at key tile: ${player1Grid[key].tile} and it is available.`);
                                player1Grid[key].marked = true;
                                // remove from ships array for player
                                player1Ships = player1Ships.filter(s => s.type !== ship);
                                console.log(`Player 1 has ${player1Ships.length} ships left in their shipyard.`)
                                if(player1Ships.length == 0 && player2Ships.length == 0) {
                                    phase = "play";
                                    turn = "player_one";
                                    res.send({"phase":"play", "player": players.player1})
                                    break;
                                } else {
                                    turn = "player_two";
                                    res.send({"placed": true, "next_player": players.player2, "phase": "setup"})
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    console.log(`Player 2 has ${player2Ships.length} ships left in their shipyard.`)
                    if(player2Ships.length > 0) {
                        console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                        for(let key = 0; key<player2Grid.length; key++) {
                            console.log(`Comparing ${player2Grid[key].tile} against ${column[0]}${row[0]} and ${player2Grid[key].marked}`)
                            if(player2Grid[key].tile === ""+column[0]+row[0]+"" && player2Grid[key].marked == false) {
                                console.log(`Found selected coordinate: ${coordinate} at key tile: ${player2Grid[key].tile} and it is available.`);
                                player2Grid[key].marked = true;
                                // remove from ships array for player
                                player2Ships = player2Ships.filter(s => s.type !== ship);
                                console.log(`Player 2 has ${player2Ships.length} ships left in their shipyard.`)
                                if(player1Ships.length == 0 && player2Ships.length == 0) {
                                    phase = "play";
                                    turn = "player_one";
                                    res.send({"phase":"play", "player": players.player1})
                                    break;
                                } else {
                                    turn = "player_one";
                                    res.send({"placed": true, "next_player": players.player1, "phase": "setup"})
                                    break;
                                }
                            }
                        }
                    }
                }
            }            
        }
    } else {
        console.log("Unable to place ship in selected space.")
        if(player === players.player1) {
            turn = "player_two";
            res.send({"placed": false, "next_player": players.player2, "phase": "setup"})
        } else {
            turn = "player_one";
            res.send({"placed": false, "next_player": players.player1, "phase": "setup"})
        }

    }
});

// app.get('/games/:session_id/setup', (req, res) => {
//     // reading isbn from the URL
//     const isbn = req.params.isbn;

//     // searching books for the isbn
//     for (let book of books) {
//         if (book.isbn === isbn) {
//             res.json(book);
//             return;
//         }
//     }

//     // sending 404 when not found something is a good practice
//     res.status(404).send('Book not found');
// });

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));