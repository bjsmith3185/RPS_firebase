

var config = {
    apiKey: "AIzaSyCMq10KVdAHPKNC4jpdOMcmfPcRXbpoZMs",
    authDomain: "rps-firebase-40930.firebaseapp.com",
    databaseURL: "https://rps-firebase-40930.firebaseio.com",
    projectId: "rps-firebase-40930",
    storageBucket: "rps-firebase-40930.appspot.com",
    messagingSenderId: "445863158721"
  };

  firebase.initializeApp(config);

  $(document).ready(function(){

    var database = firebase.database();



    $("#submit-name").on("click", function(event) {
        event.preventDefault();
    
    // var userName = $("#user-name").val().trim();
    
    var userName = capitalizeFirstLetter($("#user-name").val().trim());

        function capitalizeFirstLetter(string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };
        // database.ref('users/' + userName).update({
        //     "wins": 0,
        //     "losses": 0,
        //     "ties": 0,
            database.ref(userName).update({
                "name" : userName,
                "wins": 0,
                "losses": 0,
                "ties": 0,

        }); // end of push to database

        database.ref().once("value", function(snapshot) {

            // Log everything that's coming out of snapshot
            // console.log(snapshot.val());
            console.log(snapshot.val()[userName]);

            $(".name").text(snapshot.val()[userName].name);
           
    });  
    });
// end of onclick for addin
    $("#submit-choice").on("click", function() {

        database.ref().once("value", function(snapshot) {

            // Log everything that's coming out of snapshot
            // console.log(snapshot.val());
            console.log(snapshot.val().users[1]);


            // .ref(shop).child(key).remove();
        });
        var userChoice = $("#user-choice").val().trim()
        console.log(userChoice);
        database.ref("Brian").update({
            "wins": 0,
            "losses": 0,
            "ties": 0,
            "choice": userChoice,


        });
    });

  }); // end of document ready 
