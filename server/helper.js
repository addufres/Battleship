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
    a: for(let key = 0; key<playerGrid.length; key++) {
        console.log(`Comparing ${playerGrid[key].tile} against ${column[0]}${row[0]} and ${playerGrid[key].marked}`)
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
                    console.log("in shiplength for loop marking grid")
                    // if its already marked and matches ship return res and break
                    if(playerGrid[localKey].marked === true && playerGrid[localKey].ship === ship) {
                        if(player === players.player2) {
                            turn = "player_one";
                            res.send({"placed": true, "next_player": players.player1, "phase": "setup"})
                            break a;
                        } else {
                            turn = "player_two";
                            res.send({"placed": true, "next_player": players.player2, "phase": "setup"})
                            break a;
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
                            res.send({"placed": true, "next_player": players.player1, "phase": "setup"})
                            break a;
                        } else {
                            turn = "player_two";
                            res.send({"placed": true, "next_player": players.player2, "phase": "setup"})
                            break a;
                        }
                    } else {
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
                res.send({"phase":"play", "player": players.player1})
                break;
            } else {
                if(player === players.player2) {
                    turn = "player_one";
                    res.send({"placed": true, "next_player": players.player1, "phase": "setup"})
                    break;
                } else {
                    turn = "player_two";
                    res.send({"placed": true, "next_player": players.player2, "phase": "setup"})
                    break;
                }
            }
        }
    }
}

exports.outOfBounds = (player, players, coordinate, ship, direction, turn, res) => {
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
}