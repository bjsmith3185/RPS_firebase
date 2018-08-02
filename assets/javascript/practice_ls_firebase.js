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

    localStorage.getItem("name")



    $("#submit-name").on("click", function(event) {
        event.preventDefault();
    
    // var userName = $("#user-name").val().trim();
    
    var userName = capitalizeFirstLetter($("#user-name").val().trim());

        function capitalizeFirstLetter(string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        localStorage.setItem("name", userName);



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


});