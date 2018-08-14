# RPS_firebase

This homework was a challenge.

the game begins on index.html
- when player one enters their name they are moved to transfer.html for the rest of the game
- when player two enters their name on index.html they remain on index.html

main.js controls both html pages

both html pages use many similar "clases" to show and hide information

all functions are called from the firebase listener,  database.ref().on("value", function(snapshot) 

this listener hides/shows classes and calls functions
- if one player disconnects the status just below the title tells of this change.

i should have put a reset button on the page to take the player back to index.html to begin again. i dont have the time to do that right now with project 1 already in progress.

i also was going to add more css style and maybe some pictures but spend way too many hours trying to get the logic working with the database.

i learned a lot doing this homework and hope there is a video showing the best way to have coded this project.

