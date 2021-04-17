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

exports.handleShips = (res, column, row, coordinate, ship, playerGrid, playerShips, players, player) => {
    for(let key = 0; key<playerGrid.length; key++) {
        console.log(`Comparing ${playerGrid[key].tile} against ${column[0]}${row[0]} and ${playerGrid[key].marked}`)
        if(playerGrid[key].tile === ""+column[0]+row[0]+"" && playerGrid[key].marked == false) {
            console.log(`Found selected coordinate: ${coordinate} at key tile: ${playerGrid[key].tile} and it is available.`);
            // check for any collisions in the path

            playerGrid[key].marked = true;

            // update grid with ship and direction info for remaining spaces

            // remove from ships array for player
            playerShips = playerShips.filter(s => s.type !== ship);
            console.log(`${player} has ${playerShips.length} ships left in their shipyard.`)
            if(playerShips.length == 0 && playerShips.length == 0) {
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