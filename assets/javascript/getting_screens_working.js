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
        console.log(snap.numChildren())

        if (snap.numChildren() === 1) {
            $(".players-status").text("Only one player is active.").addClass("one-player");
        } else if (snap.numChildren() === 2) {
            $(".players-status").text("Status: Both players are logged on.");
        }
        // $("#connected-viewers").text(snap.numChildren());
    });





    
    
    database.ref().on("value", function(snapshot) {
  
        if ((snapshot.child("player1").exists()) && (snapshot.child("player2").exists())) {

            $(".welcome-container").hide();

            //---info for transfer.html----
            $(".game-container-player1").show();
            $(".player1-name-top").text(snapshot.val()["player1"].name);
            $(".player1-choice").text("Selected: " + snapshot.val()["player1"].choice)
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);

            $(".opponent2-name").text(snapshot.val()["player2"].name);
            $(".choice-player2").text("Selected: " + snapshot.val()["player2"].choice);

            $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
            $(".losses2").text("Wins: " + snapshot.val()["player2"].losses);
            $(".ties2").text("Wins: " + snapshot.val()["player2"].ties);

            //----info for index.html-----
            $(".game-container-player2").show();
            $(".player2-name-top").text(snapshot.val()["player2"].name);
            $(".player2-choice").text("Selected: " + snapshot.val()["player2"].choice)
            $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
            $(".losses2").text("Losses: " + snapshot.val()["player2"].losses);
            $(".ties2").text("Ties: " + snapshot.val()["player2"].ties);


            $(".opponent1-name").text(snapshot.val()["player1"].name);
            $(".choice-player1").text("Selected: " + snapshot.val()["player1"].choice);

            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Wins: " + snapshot.val()["player1"].losses);
            $(".ties").text("Wins: " + snapshot.val()["player1"].ties);

         //------------------------------------------------------------------
            // $(".player1-title-info").text(snapshot.val()["player1"].name);
            // $(".choice").text("Selected: " + snapshot.val()["player1"].choice);
            // $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            // $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            // $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
            
        
            // $(".player2-title-info").text(snapshot.val()["player2"].name);
            // $(".choice2").text("Selected: " + snapshot.val()["player2"].choice)
            // $(".wins2").text("Wins: " + snapshot.val()["player2"].wins);
            // $(".losses2").text("Losses: " + snapshot.val()["player2"].losses);
            // $(".ties2").text("Ties: " + snapshot.val()["player2"].ties);
            

            if ((snapshot.val()["player1"].readyToCheck)  && (snapshot.val()["player2"].readyToCheck)) { // if both players have made a seleciton
              console.log((snapshot.val()["player1"].readyToCheck) + " and " +   (snapshot.val()["player2"].readyToCheck) );

              // show on both player1 and player2 screens
              // what player1 selected
              // what player 2 selected
              // in center, who won
               setTimeout(compareAnswers, 1000);

            } else if (snapshot.val()["player1"].turn) { // if true, let player1 select rps
                //show player1 screen
                // show player1 selections
                // show player 1 selected
                // show player 2 blank


                setTimeout(player1SelectRPS, 1000);
  
            } else if (snapshot.val()["player2"].turn) {

                // show player2 screen
                // show player2 selections
                // show player2 selected
                // show player 1 blank

                setTimeout(player2SelectRPS, 1000);
 
            };


        } else if ((snapshot.child("player1").exists()) && (!snapshot.child("player2").exists())) {   // should = true
            // console.log("player1 exists only");
            $(".player1-title-info").text(snapshot.val()["player1"].name);
            $(".player2-area").show();
            $(".player1-title").text("Hurry, " + snapshot.val()["player1"].name + " is waiting on you.")
            $(".input-area1").hide();

            $(".name").text("Name: " + snapshot.val()["player1"].name);
            $(".choice").text("Selected: " + snapshot.val()["player1"].choice)
            $(".wins").text("Wins: " + snapshot.val()["player1"].wins);
            $(".losses").text("Losses: " + snapshot.val()["player1"].losses);
            $(".ties").text("Ties: " + snapshot.val()["player1"].ties);
           
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
                    "choice": "",
                    "turn" : true,
                    "readyToCheck": false,
                }); 
         
            //  console.log("player1 is ready");
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
                    "choice": "",
                    "turn" : false,
                    "readyToCheck": false,
                });
                // console.log("player2 is ready");
                
                    // window.location='player2.html';
                  
            });
        };
    
    
        function player1SelectRPS() {
                console.log("player1's turn to select");
                $(document.body).on("click", ".select", function () {
                    var playerChoice = $(this).attr("value");

                    database.ref("player1").update({
                        "choice": playerChoice,
                        "turn": false,
                        "readyToCheck": true,
                    });

                    database.ref("player2").update({
                        "turn": true,
                    });
                });
        };


        function player2SelectRPS() {
    
                $(document.body).on("click", ".select2", function () {
                    var playerChoice = $(this).attr("value");
                    database.ref("player2").update({
                        "choice": playerChoice,
                        "turn": false,
                        "readyToCheck": true,
                    });
  
                });
        };
    
    
        function compareAnswers() {
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

                     
            if (answer1 === "r" && answer2 === "s") {
              
                wins1++;
                losses2++;
                database.ref("player2").update({
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 

                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 

            } else if (answer1 === "r" && answer2 === "p") {
                losses1++;
                wins2++;
                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 
          
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
    
            } else if (answer1 === "s" && answer2 === "p") {
                wins1++;
                losses2++;
                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 
                
                database.ref("player2").update({
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
    
            } else if (answer1 === "s" && answer2 === "r") {
                losses1++;
                wins2++;
                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 
              
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
    
            } else if (answer1 === "p" && answer2 === "r") {
                wins1++;
                losses2++;
                database.ref("player1").update({
                    "wins": wins1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 
         
                database.ref("player2").update({
                    "losses": losses2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
    
            } else if (answer1 === "p" && answer2 === "r") {
                losses1++;
                wins2++;
                database.ref("player1").update({
                    "losses": losses1,
                    "turn": true,
                    "choice": "",
                    "readyToCheck": false,
                }); 
              
                database.ref("player2").update({
                    "wins": wins2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
    
            } else if (answer1 === answer2) {
                ties1++;
                ties2++;
                database.ref("player1").update({
                    "ties": ties1,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
              
                database.ref("player2").update({
                    "ties": ties2,
                    "turn": false,
                    "choice": "",
                    "readyToCheck": false,
                }); 
            };

        };
    
    
    });  // end of document ready
    
  
    
    
    