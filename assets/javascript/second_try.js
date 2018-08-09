$(document).ready(function () {

    $(".welcome-container").show();
    $(".player2-area").hide();
    $(".game-container-player1").hide();
    $(".game-container-player2").hide();
    $(".only-one-player-left").hide();

    var config = {
        apiKey: "AIzaSyCMq10KVdAHPKNC4jpdOMcmfPcRXbpoZMs",
        authDomain: "rps-firebase-40930.firebaseapp.com",
        databaseURL: "https://rps-firebase-40930.firebaseio.com",
        projectId: "rps-firebase-40930",
        storageBucket: "rps-firebase-40930.appspot.com",
        messagingSenderId: "445863158721"
    };
    
    firebase.initializeApp(config);
    var database = firebase.database();


//-------player watcher---------
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    };
});

connectionsRef.on("value", function (snap) {
    // console.log(snap.numChildren())

    if (snap.numChildren() === 1) {
        $(".players-status").text("Only one player is active.").addClass("one-player");
    } else if (snap.numChildren() === 2) {
        $(".players-status").text("Status: Both players are logged on.");
    }
 });

    
    var answer1;
    var answer2;
    var player1Active;
    var player2Active;
    var player1Turn;
    var player2Turn;
    
    database.ref().on("value", function(snapshot) {
  
        if ((snapshot.child("player1").exists()) && (snapshot.child("player2").exists())) {

            $(".welcome-container").hide();
            $(".game-container-player1").show();
            $(".game-container-player2").show();
            //  transfer.html
            $(".player1-name-top").text("Player 1: " + snapshot.val()["player1"].name);
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
            // $(".choice-player1").text(snapshot.val()["player1"].choice);
            $(".opponent2-name").text(snapshot.val()["player2"].name);
            // $(".player1-selection").hide();  // hides the selected choice

            // $(".opponent-selection-area").hide();
            
            //  index.html
            $(".player2-name-top").text("Player 2: " + snapshot.val()["player2"].name);
            $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
            $(".losses2").text("Losses: " + snapshot.val()["player2"].losses);
            $(".ties2").text("Ties: " + snapshot.val()["player2"].ties);
            // $(".choice-player2").text(snapshot.val()["player2"].choice);
            // $(".player2-selection").hide();  // hides the selected choice

            $(".opponent1-name").text(snapshot.val()["player1"].name);




            if(snapshot.val()["player1"].reset) {
                console.log("inside the reset()");

                setTimeout(resetGame, 4000);
                // $(".opponent-selection-area").hide();  // this will hide both player's selection to the other player,
                // $(".player1-game-selection-area").show();  // show the choices
                // $(".player1-selection").hide();  // hides the selected choice

                // $(".player2-game-selection-area").show();  // shows the choices
                // $(".player2-selection").hide();  // hides the selected choice




            } else if (snapshot.val()["player2"].readyToCheck) { // ready to check answers
              console.log("ready to check answers" );

                $(".opponent-selection-area").show();  // this will show both player's selection to the other player,

               
                // answer1 = snapshot.val()["player1"].choice;
                $(".choice-player1").text(snapshot.val()["player1"].choice);
                $(".player1-game-selection-area").hide();  // hides the choices
                $(".player1-selection").show();  // shows the selected choice

               
                // answer2 = snapshot.val()["player2"].choice;
                $(".choice-player2").text(snapshot.val()["player2"].choice);
                $(".player2-game-selection-area").hide();  // hides the choices
                $(".player2-selection").show();  // shows the selected choice

               compareAnswers();

            } else if (snapshot.val()["player1"].turn) { // if true, let player1 select rps
                console.log("player 1 can select");
                $(".player1-selection").hide();  // shows the selected choice
                $(".player2-selection").hide();  // shows the selected choice
                $(".opponent-selection-area").hide();  // this will hide both player's selection to the other player,




                player1SelectRPS();
  
            } else if (!snapshot.val()["player1"].turn) {
                console.log("player 2 can select");
                $(".choice-player1").text(snapshot.val()["player1"].choice);
                // $(".player1-game-selection-area").hide();  // hides the choices
                // $(".player1-selection").show();  // shows the selected choice

                player2SelectRPS();
 
            };


        } else if ((snapshot.child("player1").exists()) && (!snapshot.child("player2").exists())) {   // should = true
            // console.log("player1 exists only");
            $(".player2-area").show();
            $(".player1-title").text("Player 1: " + snapshot.val()["player1"].name)
            $(".input-area1").hide();

            $(".name").text("Name: " + snapshot.val()["player1"].name);
            $(".choice").text("Selected: " + snapshot.val()["player1"].choice)
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
            player1Active = snapshot.val()["player1"].logged_on;
            player1Select = snapshot.val()["player1"].choice;
           addUser2();
           
        } else if ((!snapshot.child("player1").exists()) && (!snapshot.child("player2").exists())) {
            console.log("no player exists");


            addUser1();

        };

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

//=========================================================================================

     //---------------- functions -----------------

        function addUser1() {
            // console.log("adding user1")
            $("#submit-name1").on("click", function (event) {
                event.preventDefault();
    
                 var player1Name = capitalizeFirstLetter($("#user-name1").val().trim());
                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
                };
    
                database.ref("player1").update({
                    "name": player1Name,
                    "wins": 0,
                    "losses": 0,
                    "ties": 0,
                    "logged_on": true,
                    // "choice": "",
                    "turn" : true,
                    // "readyToCheck": false,
                }); 
         
             //  console.log("player1 is ready");
             $(".opponent-selection-area").hide();  // this will hide both player's selection to the other player,

             $(".player-one-welcome").hide();
             $(".player-two-welcome").show();

             window.location='transfer.html';

            });
        };
    
    
        function addUser2() {
            // console.log("waiting for user2");
            $("#submit-name2").on("click", function (event) {
                event.preventDefault();
    
                var player2Name = capitalizeFirstLetter($("#user-name2").val().trim());
                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
                };
    
                database.ref("player2").update({
                    "name": player2Name,
                    "wins": 0,
                    "losses": 0,
                    "ties": 0,
                    "logged_on": true,
                    // "choice": "",
                    // "turn" : false,
                    "readyToCheck": false,
                });
                // console.log("player2 is ready");



            });
        };
    
    
        function player1SelectRPS() {
                // database.ref("player1").update({
                //     "choice": "",
                // });
                // database.ref("player2").update({
                //     "choice": "",
                // });

                console.log("player1's turn to select");
                $(document.body).on("click", ".select", function () {
                    var playerChoice = $(this).attr("value");

                    database.ref("player1").update({
                        "choice": playerChoice,
                        "turn": false,
                        // "readyToCheck": true,
                    });

                    // $(".choice-player1").text(snapshot.val()["player1"].choice);
                    $(".player1-game-selection-area").hide();  // hides the choices
                    $(".player1-selection").show();  // shows the selected choice

                    // database.ref("player2").update({
                    //     "turn": true,
                    // });
                });
        };


        function player2SelectRPS() {
                // database.ref("player2").update({
                //     "choice": "",
                // });
    
                $(document.body).on("click", ".select2", function () {
                    var playerChoice = $(this).attr("value");
                    console.log("this is player2: " + playerChoice);
                    database.ref("player2").update({
                        "choice": playerChoice,
                        
                        // "turn": false,
                        "readyToCheck": true,
                    });
  
                   
                    $(".player2-game-selection-area").hide();  // hides the choices
                    $(".player2-selection").show();  // shows the selected choice
                    
                    $(".opponent-selection-area").show();  // this will show both player's selection to the other player,
                });
        };
    
    
        function compareAnswers() {
            console.log("this is inside compare Answers");

            // may need to have player2 info submitted before player1
            var answer1;
            var answer2;
            var wins1;
            var losses1;
            var ties1;
            var wins2;
            var losses2;
            var ties2;

            database.ref().once("value", function(snapshot) {
                answer1 = snapshot.val()["player1"].choice;
                answer2 = snapshot.val()["player2"].choice;
                wins1 = snapshot.val()["player1"].wins;
                losses1 = snapshot.val()["player1"].losses;
                ties1 = snapshot.val()["player1"].ties;
                wins2 = snapshot.val()["player2"].wins;
                losses2 = snapshot.val()["player2"].losses;
                ties2 = snapshot.val()["player2"].ties;
            });

                     
            if (answer1 === "rock" && answer2 === "sissor") {
              
                
                losses2++;
                database.ref("player2").update({
                    "losses": losses2,
                    // // "turn": false,
                    // "choice": "",
                    "readyToCheck": false,
                }); 

                wins1++;
                database.ref("player1").update({
                    "wins": wins1,

                    // "choice": "",
                    "reset": true,
                    // "readyToCheck": false,
                }); 

            // } else if (answer1 === "r" && answer2 === "p") {
            //     losses1++;
            //     wins2++;
            //     database.ref("player1").update({
            //         "losses": losses1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
          
            //     database.ref("player2").update({
            //         "wins": wins2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
    
            // } else if (answer1 === "s" && answer2 === "p") {
            //     wins1++;
            //     losses2++;
            //     database.ref("player1").update({
            //         "wins": wins1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
                
            //     database.ref("player2").update({
            //         "losses": losses2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
    
            // } else if (answer1 === "s" && answer2 === "r") {
            //     losses1++;
            //     wins2++;
            //     database.ref("player1").update({
            //         "losses": losses1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
              
            //     database.ref("player2").update({
            //         "wins": wins2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
    
            // } else if (answer1 === "p" && answer2 === "r") {
            //     wins1++;
            //     losses2++;
            //     database.ref("player1").update({
            //         "wins": wins1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
         
            //     database.ref("player2").update({
            //         "losses": losses2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
    
            // } else if (answer1 === "p" && answer2 === "r") {
            //     losses1++;
            //     wins2++;
            //     database.ref("player1").update({
            //         "losses": losses1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
              
            //     database.ref("player2").update({
            //         "wins": wins2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
    
            // } else if (answer1 === answer2) {
            //     ties1++;
            //     ties2++;
            //     database.ref("player1").update({
            //         "ties": ties1,
            //         "turn": true,
            //         "choice": "",
            //         // "readyToCheck": false,
            //     }); 
              
            //     database.ref("player2").update({
            //         "ties": ties2,
            //         // "turn": false,
            //         "choice": "",
            //         "readyToCheck": false,
            //     }); 
            };

        };
    
        function resetGame() {

           
            database.ref("player1").update({
                "turn": true,
                "reset": false,
            }); 
          console.log("just finished resetGame()");
          $(".opponent-selection-area").hide();  // this will hide both player's selection to the other player,

          $(".player1-game-selection-area").show();  // show the choices
          $(".player1-selection").hide();  // hides the selected choice

          $(".player2-game-selection-area").show();  // shows the choices
          $(".player2-selection").hide();  // hides the selected choice
        };

    });  // end of document ready
    
  
    
    
    