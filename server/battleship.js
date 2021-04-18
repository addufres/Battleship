/** PRIMARY IMPORT STATEMENTS */
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const helper = require('./helper');
/** EXPRESS AND APP STARTUP */
const app = express()
const port = 3000
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
/** GLOBAL VARIABLES */
let game;
let currentGame;
let phase;
let turn;
let colArr = ['A','B','C','D','E','F','G','H','I','J'];
let rowArr = ['0','1','2','3','4','5','6','7','8','9'];
let players = {player1: "",player2: ""};
let player1Ships = [
    {type: "carrier",length: 5},
    {type: "battleship",length: 4},
    {type: "cruiser",length: 3},
    {type: "submarine",length: 3},
    {type: "destroyer",length: 2}
]
let player2Ships = [
    {type: "carrier",length: 5},
    {type: "battleship",length: 4},
    {type: "cruiser",length: 3},
    {type: "submarine",length: 3},
    {type: "destroyer",length: 2}
]
let player1Grid = [
    {tile:"A0",marked:false,hit:-1,direction:"",ship:""},{tile:"A1",marked:false,hit:-1,direction:"",ship:""},{tile:"A2",marked:false,hit:-1,direction:"",ship:""},{tile:"A3",marked:false,hit:-1,direction:"",ship:""},{tile:"A4",marked:false,hit:-1,direction:"",ship:""},{tile:"A5",marked:false,hit:-1,direction:"",ship:""},{tile:"A6",marked:false,hit:-1,direction:"",ship:""},{tile:"A7",marked:false,hit:-1,direction:"",ship:""},{tile:"A8",marked:false,hit:-1,direction:"",ship:""},{tile:"A9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"B0",marked:false,hit:-1,direction:"",ship:""},{tile:"B1",marked:false,hit:-1,direction:"",ship:""},{tile:"B2",marked:false,hit:-1,direction:"",ship:""},{tile:"B3",marked:false,hit:-1,direction:"",ship:""},{tile:"B4",marked:false,hit:-1,direction:"",ship:""},{tile:"B5",marked:false,hit:-1,direction:"",ship:""},{tile:"B6",marked:false,hit:-1,direction:"",ship:""},{tile:"B7",marked:false,hit:-1,direction:"",ship:""},{tile:"B8",marked:false,hit:-1,direction:"",ship:""},{tile:"B9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"C0",marked:false,hit:-1,direction:"",ship:""},{tile:"C1",marked:false,hit:-1,direction:"",ship:""},{tile:"C2",marked:false,hit:-1,direction:"",ship:""},{tile:"C3",marked:false,hit:-1,direction:"",ship:""},{tile:"C4",marked:false,hit:-1,direction:"",ship:""},{tile:"C5",marked:false,hit:-1,direction:"",ship:""},{tile:"C6",marked:false,hit:-1,direction:"",ship:""},{tile:"C7",marked:false,hit:-1,direction:"",ship:""},{tile:"C8",marked:false,hit:-1,direction:"",ship:""},{tile:"C9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"D0",marked:false,hit:-1,direction:"",ship:""},{tile:"D1",marked:false,hit:-1,direction:"",ship:""},{tile:"D2",marked:false,hit:-1,direction:"",ship:""},{tile:"D3",marked:false,hit:-1,direction:"",ship:""},{tile:"D4",marked:false,hit:-1,direction:"",ship:""},{tile:"D5",marked:false,hit:-1,direction:"",ship:""},{tile:"D6",marked:false,hit:-1,direction:"",ship:""},{tile:"D7",marked:false,hit:-1,direction:"",ship:""},{tile:"D8",marked:false,hit:-1,direction:"",ship:""},{tile:"D9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"E0",marked:false,hit:-1,direction:"",ship:""},{tile:"E1",marked:false,hit:-1,direction:"",ship:""},{tile:"E2",marked:false,hit:-1,direction:"",ship:""},{tile:"E3",marked:false,hit:-1,direction:"",ship:""},{tile:"E4",marked:false,hit:-1,direction:"",ship:""},{tile:"E5",marked:false,hit:-1,direction:"",ship:""},{tile:"E6",marked:false,hit:-1,direction:"",ship:""},{tile:"E7",marked:false,hit:-1,direction:"",ship:""},{tile:"E8",marked:false,hit:-1,direction:"",ship:""},{tile:"E9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"F0",marked:false,hit:-1,direction:"",ship:""},{tile:"F1",marked:false,hit:-1,direction:"",ship:""},{tile:"F2",marked:false,hit:-1,direction:"",ship:""},{tile:"F3",marked:false,hit:-1,direction:"",ship:""},{tile:"F4",marked:false,hit:-1,direction:"",ship:""},{tile:"F5",marked:false,hit:-1,direction:"",ship:""},{tile:"F6",marked:false,hit:-1,direction:"",ship:""},{tile:"F7",marked:false,hit:-1,direction:"",ship:""},{tile:"F8",marked:false,hit:-1,direction:"",ship:""},{tile:"F9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"G0",marked:false,hit:-1,direction:"",ship:""},{tile:"G1",marked:false,hit:-1,direction:"",ship:""},{tile:"G2",marked:false,hit:-1,direction:"",ship:""},{tile:"G3",marked:false,hit:-1,direction:"",ship:""},{tile:"G4",marked:false,hit:-1,direction:"",ship:""},{tile:"G5",marked:false,hit:-1,direction:"",ship:""},{tile:"G6",marked:false,hit:-1,direction:"",ship:""},{tile:"G7",marked:false,hit:-1,direction:"",ship:""},{tile:"G8",marked:false,hit:-1,direction:"",ship:""},{tile:"G9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"H0",marked:false,hit:-1,direction:"",ship:""},{tile:"H1",marked:false,hit:-1,direction:"",ship:""},{tile:"H2",marked:false,hit:-1,direction:"",ship:""},{tile:"H3",marked:false,hit:-1,direction:"",ship:""},{tile:"H4",marked:false,hit:-1,direction:"",ship:""},{tile:"H5",marked:false,hit:-1,direction:"",ship:""},{tile:"H6",marked:false,hit:-1,direction:"",ship:""},{tile:"H7",marked:false,hit:-1,direction:"",ship:""},{tile:"H8",marked:false,hit:-1,direction:"",ship:""},{tile:"H9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"I0",marked:false,hit:-1,direction:"",ship:""},{tile:"I1",marked:false,hit:-1,direction:"",ship:""},{tile:"I2",marked:false,hit:-1,direction:"",ship:""},{tile:"I3",marked:false,hit:-1,direction:"",ship:""},{tile:"I4",marked:false,hit:-1,direction:"",ship:""},{tile:"I5",marked:false,hit:-1,direction:"",ship:""},{tile:"I6",marked:false,hit:-1,direction:"",ship:""},{tile:"I7",marked:false,hit:-1,direction:"",ship:""},{tile:"I8",marked:false,hit:-1,direction:"",ship:""},{tile:"I9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"J0",marked:false,hit:-1,direction:"",ship:""},{tile:"J1",marked:false,hit:-1,direction:"",ship:""},{tile:"J2",marked:false,hit:-1,direction:"",ship:""},{tile:"J3",marked:false,hit:-1,direction:"",ship:""},{tile:"J4",marked:false,hit:-1,direction:"",ship:""},{tile:"J5",marked:false,hit:-1,direction:"",ship:""},{tile:"J6",marked:false,hit:-1,direction:"",ship:""},{tile:"J7",marked:false,hit:-1,direction:"",ship:""},{tile:"J8",marked:false,hit:-1,direction:"",ship:""},{tile:"J9",marked:false,hit:-1,direction:"",ship:""},
]
let player2Grid = [
    {tile:"A0",marked:false,hit:-1,direction:"",ship:""},{tile:"A1",marked:false,hit:-1,direction:"",ship:""},{tile:"A2",marked:false,hit:-1,direction:"",ship:""},{tile:"A3",marked:false,hit:-1,direction:"",ship:""},{tile:"A4",marked:false,hit:-1,direction:"",ship:""},{tile:"A5",marked:false,hit:-1,direction:"",ship:""},{tile:"A6",marked:false,hit:-1,direction:"",ship:""},{tile:"A7",marked:false,hit:-1,direction:"",ship:""},{tile:"A8",marked:false,hit:-1,direction:"",ship:""},{tile:"A9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"B0",marked:false,hit:-1,direction:"",ship:""},{tile:"B1",marked:false,hit:-1,direction:"",ship:""},{tile:"B2",marked:false,hit:-1,direction:"",ship:""},{tile:"B3",marked:false,hit:-1,direction:"",ship:""},{tile:"B4",marked:false,hit:-1,direction:"",ship:""},{tile:"B5",marked:false,hit:-1,direction:"",ship:""},{tile:"B6",marked:false,hit:-1,direction:"",ship:""},{tile:"B7",marked:false,hit:-1,direction:"",ship:""},{tile:"B8",marked:false,hit:-1,direction:"",ship:""},{tile:"B9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"C0",marked:false,hit:-1,direction:"",ship:""},{tile:"C1",marked:false,hit:-1,direction:"",ship:""},{tile:"C2",marked:false,hit:-1,direction:"",ship:""},{tile:"C3",marked:false,hit:-1,direction:"",ship:""},{tile:"C4",marked:false,hit:-1,direction:"",ship:""},{tile:"C5",marked:false,hit:-1,direction:"",ship:""},{tile:"C6",marked:false,hit:-1,direction:"",ship:""},{tile:"C7",marked:false,hit:-1,direction:"",ship:""},{tile:"C8",marked:false,hit:-1,direction:"",ship:""},{tile:"C9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"D0",marked:false,hit:-1,direction:"",ship:""},{tile:"D1",marked:false,hit:-1,direction:"",ship:""},{tile:"D2",marked:false,hit:-1,direction:"",ship:""},{tile:"D3",marked:false,hit:-1,direction:"",ship:""},{tile:"D4",marked:false,hit:-1,direction:"",ship:""},{tile:"D5",marked:false,hit:-1,direction:"",ship:""},{tile:"D6",marked:false,hit:-1,direction:"",ship:""},{tile:"D7",marked:false,hit:-1,direction:"",ship:""},{tile:"D8",marked:false,hit:-1,direction:"",ship:""},{tile:"D9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"E0",marked:false,hit:-1,direction:"",ship:""},{tile:"E1",marked:false,hit:-1,direction:"",ship:""},{tile:"E2",marked:false,hit:-1,direction:"",ship:""},{tile:"E3",marked:false,hit:-1,direction:"",ship:""},{tile:"E4",marked:false,hit:-1,direction:"",ship:""},{tile:"E5",marked:false,hit:-1,direction:"",ship:""},{tile:"E6",marked:false,hit:-1,direction:"",ship:""},{tile:"E7",marked:false,hit:-1,direction:"",ship:""},{tile:"E8",marked:false,hit:-1,direction:"",ship:""},{tile:"E9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"F0",marked:false,hit:-1,direction:"",ship:""},{tile:"F1",marked:false,hit:-1,direction:"",ship:""},{tile:"F2",marked:false,hit:-1,direction:"",ship:""},{tile:"F3",marked:false,hit:-1,direction:"",ship:""},{tile:"F4",marked:false,hit:-1,direction:"",ship:""},{tile:"F5",marked:false,hit:-1,direction:"",ship:""},{tile:"F6",marked:false,hit:-1,direction:"",ship:""},{tile:"F7",marked:false,hit:-1,direction:"",ship:""},{tile:"F8",marked:false,hit:-1,direction:"",ship:""},{tile:"F9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"G0",marked:false,hit:-1,direction:"",ship:""},{tile:"G1",marked:false,hit:-1,direction:"",ship:""},{tile:"G2",marked:false,hit:-1,direction:"",ship:""},{tile:"G3",marked:false,hit:-1,direction:"",ship:""},{tile:"G4",marked:false,hit:-1,direction:"",ship:""},{tile:"G5",marked:false,hit:-1,direction:"",ship:""},{tile:"G6",marked:false,hit:-1,direction:"",ship:""},{tile:"G7",marked:false,hit:-1,direction:"",ship:""},{tile:"G8",marked:false,hit:-1,direction:"",ship:""},{tile:"G9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"H0",marked:false,hit:-1,direction:"",ship:""},{tile:"H1",marked:false,hit:-1,direction:"",ship:""},{tile:"H2",marked:false,hit:-1,direction:"",ship:""},{tile:"H3",marked:false,hit:-1,direction:"",ship:""},{tile:"H4",marked:false,hit:-1,direction:"",ship:""},{tile:"H5",marked:false,hit:-1,direction:"",ship:""},{tile:"H6",marked:false,hit:-1,direction:"",ship:""},{tile:"H7",marked:false,hit:-1,direction:"",ship:""},{tile:"H8",marked:false,hit:-1,direction:"",ship:""},{tile:"H9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"I0",marked:false,hit:-1,direction:"",ship:""},{tile:"I1",marked:false,hit:-1,direction:"",ship:""},{tile:"I2",marked:false,hit:-1,direction:"",ship:""},{tile:"I3",marked:false,hit:-1,direction:"",ship:""},{tile:"I4",marked:false,hit:-1,direction:"",ship:""},{tile:"I5",marked:false,hit:-1,direction:"",ship:""},{tile:"I6",marked:false,hit:-1,direction:"",ship:""},{tile:"I7",marked:false,hit:-1,direction:"",ship:""},{tile:"I8",marked:false,hit:-1,direction:"",ship:""},{tile:"I9",marked:false,hit:-1,direction:"",ship:""},
    {tile:"J0",marked:false,hit:-1,direction:"",ship:""},{tile:"J1",marked:false,hit:-1,direction:"",ship:""},{tile:"J2",marked:false,hit:-1,direction:"",ship:""},{tile:"J3",marked:false,hit:-1,direction:"",ship:""},{tile:"J4",marked:false,hit:-1,direction:"",ship:""},{tile:"J5",marked:false,hit:-1,direction:"",ship:""},{tile:"J6",marked:false,hit:-1,direction:"",ship:""},{tile:"J7",marked:false,hit:-1,direction:"",ship:""},{tile:"J8",marked:false,hit:-1,direction:"",ship:""},{tile:"J9",marked:false,hit:-1,direction:"",ship:""},
]

/** PRIMARY API FUNCTIONS */

/** POST new game creation
 * @returns json object containing information for session_id, phase, and player_one
 * Tested end to end and in Postman
 */
app.post('/games/new', (req, res) => {
    players.player1 = req.body.player1;
    players.player2 = req.body.player2;
    currentGame = {"phase":"setup","players":players};
    phase = "setup";
    turn = "player_one";  
    game = currentGame; 
    game.session_id = (Math.floor(Math.random() * 100000)).toString(); 
    let resultArr = helper.resetMockDb();
    player1Grid = resultArr[0];
    player1Ships = resultArr[1];
    player2Grid = resultArr[2];
    player2Ships = resultArr[3];
    console.log("Player 1: "+players.player1)
    console.log("Player 2: "+players.player2)
    console.log("Session ID: "+game.session_id)
    res.send({"session_id":game.session_id,"phase":currentGame.phase,"player":currentGame.players.player1});
});

/** GET contents of current game
 * @returns json object of currentGame variable i.e phase, player list
 * Tested in Postman
 */
app.get('/games/:session_id', (req, res) => {
    res.json(currentGame);
});

// Test call
app.get('/games/:session_id/grid',(req, res) =>{
    // if(req.params.player === 1)res.send(player1Grid)
    res.send(player1Grid)
});

// Test call
app.get('/games/:session_id/ships',(req, res) =>{
    // if(req.params.player === 1)res.send(player1Grid)
    res.send(player1Ships)
});

/** POST setup board 
 * Alternating post calls from each player to submit request for placement of ship.
 * Will take in a coordinate, direction, player, ship, and session_id.
 * @returns placed, next_player, phase if setup is continuing
 * @returns phase, player if setup is complete
 * IN PROGRESS OF COMPLETION
 */
app.post('/games/:session_id/setup', (req, res) => {
    // set local function fields to utilize throughout setup
    const sessionId = req.params.session_id;
    const coordinate = req.body.coordinate;
    // check for collision value
    console.log(coordinate)
    if(coordinate !== "XX"){
        const direction = req.body.direction;
        const player = req.body.player;
        const ship = req.body.ship;
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
        if(colCondition && rowCondition && (sessionId === game.session_id)) {
            // check that ship would fit with direction
            if(direction === "right") {
                // convert alpha to numeric on the columns for comparison
                let col = helper.convertNumericStringToNumber(coordinate.charAt(1), 0);
                if(col + length > 10) { // column location plus length of ship is wider than grid
                    helper.outOfBounds(player, players, coordinate, ship, direction, turn, res);
                } else { // it will fit facing right so perform logic to add ship to board and remove from pile
                    console.log(`${player}...chose coordinate ${coordinate}...with ship ${ship} facing ${direction}`)
                    if(player === players.player1) {
                        console.log(`${player} has ${player1Ships.length} ships left in their shipyard.`)
                        if(player1Ships.length > 0) {
                            console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                            let results = helper.handleShips(res, column, row, coordinate, ship, player1Grid, player1Ships, player2Ships, players, player, direction, length)
                            res = results[0]
                            player1Ships = results[1]
                            player1Grid = results[2]
                        }
                    } else {
                        console.log(`${player} has ${player2Ships.length} ships left in their shipyard.`)
                        if(player2Ships.length > 0) {
                            console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                            let results = helper.handleShips(res, column, row, coordinate, ship, player2Grid, player2Ships, player1Ships, players, player, direction, length)
                            res = results[0]
                            player2Ships = results[1]
                            player2Grid = results[2]
                        }
                    }
                }
            } else {
                // convert numeric string to number on the rows for comparison
                let numericRow = helper.convertAlphaToNumeric(coordinate.charAt(0), 0);
                if(numericRow + length > 10) { // column location plus length of ship is taller than grid
                    helper.outOfBounds(player, players, coordinate, ship, direction, turn, res);
                } else { // it will fit facing down so perform logic to add ship to board and remove from pile
                    console.log(`${player}...chose coordinate ${coordinate}...with ship ${ship} facing ${direction}`)
                    if(player === players.player1) {
                        console.log(`${player} has ${player1Ships.length} ships left in their shipyard.`)
                        if(player1Ships.length > 0) {
                            console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                            let results = helper.handleShips(res, column, row, coordinate, ship, player1Grid, player1Ships, player2Ships, players, player, direction, length)
                            res = results[0]
                            player1Ships = results[1]
                            player1Grid = results[2]
                        }
                    } else {
                        console.log(`${player} has ${player2Ships.length} ships left in their shipyard.`)
                        if(player2Ships.length > 0) {
                            console.log(`Performing search on ${player}'s grid for the chosen coordinate`);
                            let results = helper.handleShips(res, column, row, coordinate, ship, player2Grid, player1Ships, player1Ships, players, player, direction, length)
                            res = results[0]
                            player2Ships = results[1]
                            player2Grid = results[2]
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
    } else {
        console.log("Unable to place ship in selected space.")
        if(req.body.player === players.player1) {
            turn = "player_two";
            res.send({"placed": false, "next_player": players.player2, "phase": "setup"})
        } else {
            turn = "player_one";
            res.send({"placed": false, "next_player": players.player1, "phase": "setup"})
        }
    } 
});

/**
 * Request:{“coordinate”:“A0”,“player”:“<player_name>”} last to conditions will be used same as hit-gg and miss 
 * Response:{“result”:“hit|miss|hit_sunk|hit_good_game”,“next_player”:“<next_player>”}
 */
app.post('/games/:session_id/play', (req, res) => {
    let result;
    if(players.player1 === req.body.player) {
        let resultArr = helper.determineResult(player2Grid, req, result); 
        result = resultArr[0];
        player2Grid = resultArr[1];
        res.send({"result":result,"next_player":players.player2})
    } else {
        let resultArr = helper.determineResult(player1Grid, req, result); 
        result = resultArr[0];
        player1Grid = resultArr[1];
        res.send({"result":result,"next_player":players.player1})
    }
});