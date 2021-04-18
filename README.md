# Battleship
Simple node Battleship Clone

## SETUP AND LAUNCH INSTRUCTIONS
1. Install all dependencies by running npm install from each of the directories with a package.json in it.
    - install backend project dependencies from server/
    - install frontend project dependencies from battleship/
2. Once dependencies are installed start up node express server by opening terminal from server/ directory and running `node battleship.js`
3. Start front end from battleship/ directory using `ng serve` in separate terminal
4. Open browser and navigate to `localhost:4200` to begin game 


## GAMEPLAY INSTRUCTIONS
1. Input names of Player 1 and Player 2 and select `CREATE NEW GAME`
2. This will bring up the `SETUP GAME MENU` 
3. Alternating players, input ship placement by selecting a ship, coordinate and direction from the dropdown menu and selecting `SUBMIT`
4. Once all ships have been placed on board, the screen will change and display a new menu to select shot placement.
5. Alternating players, input shot placement by seleting a coordinate from the dropdown menu and selecting `SUBMIT`
    - Each type of shot result will alert to the player within the browser
        - `HIT`
        - `HIT_SUNK`
        - `HIT_GOOD_GAME`
        - `MISS`

## KNOWN BUGS
1. No clean restart capability
    - Once game is complete the backend does not reset cleanly and I did not have the necessary time to debug and implement a clean reset of the mockDB
    - currently in order to reset game perform the following steps.
        - refresh browser page
        - restart node server
2. Unable to refresh page and have it track the current state of the node backend
    - I would be able to fix this with ample time and implementing a true db solution
    - I chose to go the route I did for simplicity of packaging up and sending off for this challenge. Understanding the limitations of functionality.
3. Not true multiplayer i.e. cannot open in multiple browsers and play against another person from another computer
    - I could fix this by implementing a websocket architecture for the server to client connection and allowing 2 connections per multiplayer game
        - Any other connection could play against a computer (I could set up a random generation using the same logic I use for collisions of ships and out of bounds)
4. CSS is not up to snuff for my taste or any actual business shipment of code
    - Given time constraints I set my sights on functionality and not prettiness
    - I don't necessarily consider this a bug but rather more of a UI/UX issue. Still worth taking a look at and if this was a work condition it would be logged in a ticket and fixed before release.

## OTHER COMMENTS
1. I spent about 25% of time planning out the layout and flow of the application. 
    - Deciding where items should live and how data should flow in the logical configuration was the first step in my process of building this game. As I haven't built many games the logic flow was key to my success here.
2. Once I understood how each component of this would work I wrote the API in node.
3. After that I spun up and created the skeleton of the front end.
4. Connecting the pieces together I did notice myself struggling on certain logical portions.
    - SPECIFIC HURDLES I OVERCAME
        - Determining how to mark and track the remaining tiles of a ship that has been placed on the grid when only given the first tile and a direction.
            - The solution for me was to utilize extra fields in a grid object and mark them with the ship placed and direction faced.
            - Utilizing js filter/some methods I was able to find the tiles that contained the starting tile and using a reference object of A-J and 0-9 I counted the length of the ship-1 marking the remaining squares, adding either 10 or 1 to the index depending on whether I was moving right or down on the board.
        - Keeping track of both the front end board marking and the mockDB.
            - I did not optimize this solution but I do have a working one. Currently I am tracking them separately however in the future I would like to be able to use the backend one and add more information to the response object to have more relevant data coming back to the client. 
                - I am tracking the front end by div#id's and marking player boards in the DOM that way. 
