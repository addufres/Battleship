const e = require("express");

exports.convertAlphaToNumeric = (char, col) => {
    switch(char) {
        case "A": col = 0;break;
        case "B": col = 1;break;
        case "C": col = 2;break;
        case "D": col = 3;break;
        case "E": col = 4;break;
        case "F": col = 5;break;
        case "G": col = 6;break;
        case "H": col = 7;break;
        case "I": col = 8;break;
        case "J": col = 9;break;
    }
    return col;
}

exports.convertNumericStringToNumber = (char, row) => {
    switch(char) {
        case "0": row = 0;break;
        case "1": row = 1;break;
        case "2": row = 2;break;
        case "3": row = 3;break;
        case "4": row = 4;break;
        case "5": row = 5;break;
        case "6": row = 6;break;
        case "7": row = 7;break;
        case "8": row = 8;break;
        case "9": row = 9;break;
    }
    return row;
}

exports.handleShips = (res, column, row, coordinate, ship, playerGrid, playerShips, nextPlayerShips, players, player, direction, shipLength) => {
    a: for(let key = 0; key<100; key++) {
        if(playerGrid[key].tile === ""+column[0]+row[0]+"") {
            console.log(`Found selected coordinate: ${coordinate} at key tile: ${playerGrid[key].tile} and it is available.`);
            // check for any collisions in the path
            if(direction === "right") {
                let localKey = key;
                // get the length of ship
                // then set marked true to each of the tiles up to 1 less then length of ship from where starting tile is
                // so if length of ship is 3 we are at tile A1 we should set the next 2 10 over B1 and C1
                // if any are marked true already send a response back for failure to place
                for(let i = 0; i < shipLength; i++) {
                    // if its already marked and matches ship return res and break
                    if(playerGrid[localKey].marked === true && playerGrid[localKey].ship === ship) {
                        if(player === players.player2) {
                            turn = "player_one";
                            return [res.send({"placed": true, "next_player": players.player1, "phase": "setup"}), playerShips, playerGrid]
                        } else {
                            turn = "player_two";
                            return [res.send({"placed": true, "next_player": players.player2, "phase": "setup"}), playerShips, playerGrid]
                        }
                    } else {
                        console.log("grid was not marked marking now.. at spot"+playerGrid[localKey])
                        playerGrid[localKey].marked = true;
                        playerGrid[localKey].direction = "right";
                        playerGrid[localKey].ship = ship;
                        localKey++;
                    }
                }
            } else {
                let localKey = key;
                for(let i = 0; i < shipLength; i++) {
                    // if its already marked and matches ship return res and break
                    if(playerGrid[localKey].marked === true && playerGrid[localKey].ship === ship) {
                        if(player === players.player2) {
                            turn = "player_one";
                            return [res.send({"placed": true, "next_player": players.player1, "phase": "setup"}), playerShips, playerGrid]
                        } else {
                            turn = "player_two";
                            return [res.send({"placed": true, "next_player": players.player2, "phase": "setup"}), playerShips, playerGrid]
                        }
                    } else {
                        console.log("grid was not marked marking now.. at spot"+playerGrid[localKey])
                        playerGrid[localKey].marked = true;
                        playerGrid[localKey].direction = "down";
                        playerGrid[localKey].ship = ship;
                        localKey+=10;
                    }
                }
            }
            // remove from ships array for player
            playerShips = playerShips.filter(s => s.type !== ship);
            console.log(`${player} has ${playerShips.length} ships left in their shipyard.`)
            if(playerShips.length == 0 && nextPlayerShips.length == 0) {
                phase = "play";
                turn = "player_one";
                return [res.send({"phase":"play", "player": players.player1}), playerShips, playerGrid]
            } else {
                if(player === players.player2) {
                    turn = "player_one";
                    return [res.send({"placed": true, "next_player": players.player1, "phase": "setup"}), playerShips, playerGrid]
                } else {
                    turn = "player_two";
                    return [res.send({"placed": true, "next_player": players.player2, "phase": "setup"}), playerShips, playerGrid]
                }
            }
        }
    }
}

exports.outOfBounds = (player, players, coordinate, ship, direction, turn, res) => {
    console.log(`Player ${player}...chose coordinate ${coordinate}...with ship ${ship} facing ${direction}
                This does not fit here it is the next player's turn...`)
    if(player === players.player1) {
        turn = "player_two"
        res.send({"placed": false, "next_player": players.player2, "phase": "setup"});
    } else {
        turn = "player_one";
        res.send({"placed": false, "next_player": players.player1, "phase": "setup"}); //unable to place try again
    }
}

exports.determineResult = (playerGrid, req, result) => {
    markedTiles = playerGrid.filter(tile => tile.marked === true);
    console.log('Currently Marked Tiles: ', markedTiles)
    if(playerGrid.findIndex((element) => element.tile === req.body.coordinate) > -1) {
        console.log("found element")
        let idx = playerGrid.findIndex((element) => element.tile === req.body.coordinate)
        if(playerGrid[idx].marked === true) { // we hit something let's look closer
            // grab the ship at the coordinate
            let ship = playerGrid[idx].ship;
            // filter all tiles in grid that match the ship we aimed at. Only one of each so this should work fine.
            let shipTiles = playerGrid.filter(tile => tile.ship === ship)
            // get the remaining ships on the board
            let remainingShipTiles = playerGrid.filter(tile => tile.ship !== "" && tile.ship !== ship);
            // out of those what ones are left to sink. Filter all tiles that haven't been hit.
            let remainingShipsToSink;
            if(remainingShipTiles.length > 0) remainingShipsToSink = remainingShipTiles.filter(tile => tile.hit === 0 || tile.hit === -1)
            else remainingShipsToSink = [];
            // Do the same for the ship we aimed at. Filter all tiles that haven't been hit.
            let notHitOnShip;
            if(shipTiles.length > 0) notHitOnShip = shipTiles.filter(tile => tile.hit === 0 || tile.hit === -1) // 0 = miss -1 === no attempt
            else notHitOnShip = [];
            // determine if game is over. should be one left on ship aimed at and none on any other ship.
            if(notHitOnShip.length === 1 && remainingShipsToSink.length === 0) {
                result = "hit_good_game";
                // determine the coordinate we hit and mark it as such
                playerGrid[idx].hit = 1;
                return [result, playerGrid]
            } else if(notHitOnShip.length > 1 && remainingShipsToSink.length >= 0) { // we didn't end the game let's check for other conditions
                result = "hit";
                // mark the hit
                playerGrid[idx].hit = 1;
                return [result, playerGrid]
            } else if(notHitOnShip.length === 1 && remainingShipsToSink.length > 0) { // we sunk this ship and have more to go elsewhere on the board
                result = "hit_sunk";
                // mark the hit
                playerGrid[idx].hit = 1;
                return [result, playerGrid]
            }
        } else { // miss...mark as such
            result = "miss"
            return [result, playerGrid]
        }
    } else {
        result = "miss"
        return [result, playerGrid]
    }
}

exports.resetMockDb = () => {
    return [player1Grid, player1Ships, player2Grid, player2Ships]
}

// THIS IS NOT OPTIMAL OR BEST PRACTICE I WOULD NOT DO THIS IN A PRODUCTION ENVIRONMENT
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