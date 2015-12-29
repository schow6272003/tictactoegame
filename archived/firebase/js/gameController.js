app.controller("GameController",  function($scope, $firebase){

	// game related variables
	
	$scope.game = getGameGrid();
	$scope.game.grid =["","","","","","","","",""];
	$scope.game.turn = true ;
	$scope.game.outcome = "" ;
	$scope.game.colorSwitch = {red: true, blue: false};
	$scope.game.count = 0 ;
	$scope.game.playAgainFlag = false;
	$scope.game.gameStart = false ;
    $scope.game.buttonHide = false;
	$scope.game.$save();

	// player related variables
	$scope.player = getPlayer(); // data initialization
	$scope.player.redScore = ["","","","",""];
	$scope.player.blueScore = ["","","","",""] ;
	$scope.player.redTeam = ["","","","",""];
	$scope.player.blueTeam = ["","","","",""];
	$scope.player.redPosition = ["","","","","","","","",""];
	$scope.player.bluePosition = ["","","","","","","","",""];

	$scope.player.redTotalScores = 0 ;
	$scope.player.blueTotalScores = 0 ;
	$scope.player.redCount = 0;
    $scope.player.blueCount = 0 ;
	$scope.player.$save();


	// players related variables
	$scope.players = getPlayers();

	$scope.mark = "";

	// blue and red string join
	 $scope.blueJointStr = "";
	 $scope.redJointStr = "";



     // Retrieve data from Firebase;

      // general game related data from Firebase
	 function getGameGrid(){
			var ref = new Firebase('https://sctttapp.firebaseio.com/game')
			var game = $firebase(ref).$asObject();
			return game;
		}

	// player related data from Firebase
	function getPlayer(){
			var ref = new Firebase('https://sctttapp.firebaseio.com/player')			
			var player = $firebase(ref).$asObject();
			return player;
		}

	
	function getPlayers(){
			var ref = new Firebase('https://sctttapp.firebaseio.com/players')			
			var players = $firebase(ref).$asObject();
			return players;
		}





	$scope.gamePlay = function(g, p){
            $scope.game.count++;
            $scope.game.$save();
            

    if($scope.game.grid[g] == ""){    // function to disable the space after being chosen.   
		if ($scope.game.turn){
			$scope.mark ="X"
			$scope.player.redPosition[g] = p ;
			$scope.player.redTeam.push(p);
			$scope.player.$save();
			$scope.game.grid[g] = $scope.mark ;
			$scope.game.$save();
			$scope.colorSwitch($scope.game.turn);
            $scope.game.turn = false;
            $scope.game.$save();

		} else {
			$scope.mark ="O";
			$scope.player.bluePosition[g] = p ;
			$scope.player.blueTeam.push(p);
			$scope.player.$save();
			$scope.game.grid[g]= $scope.mark;
			$scope.game.$save();
			$scope.colorSwitch($scope.game.turn);
			$scope.game.turn = true;
			$scope.game.$save();


		}

    	$scope.outcomeCalculate();

      }

	};
	
	$scope.colorSwitch = function(t){

		if (t){
			 $scope.game.colorSwitch.red = true;
			 $scope.game.colorSwitch.blue = false;
			 $scope.game.$save();
		} else {
			 $scope.game.colorSwitch.red = false;
			 $scope.game.colorSwitch.blue = true;
			 $scope.game.$save();

		}

	};

	$scope.outcomeCalculate = function(){
		 var winCombo = ["111","222","333"];
		 // outcome variable
         var redOutcome = null ;
         var blueOutcome = null;
		 var redString = $scope.player.redTeam.join("") ;
		 var blueString = $scope.player.blueTeam.join("");
	     $scope.blueJointStr = blueString;
	     $scope.redJointStr = redString;



         // outcome determination function
         function stringMatch(a, player, position) {
         	 var combinedReg = "("+ a.join("|") +")";
         	 var jointString = player.sort().join("");
         	 var matchResult = jointString.match(combinedReg);
         	 

             var positionArray = [ ( String(position[0]) + String(position[3]) + String(position[6]) ),
					  ( String(position[1]) + String(position[4]) + String(position[7]) ), 
					  ( String(position[2]) + String(position[5]) + String(position[8]) ), 
					  ( String(position[0]) + String(position[4]) + String(position[8]) ), 
					  ( String(position[2]) + String(position[4]) + String(position[6]) )
			        ] ; 


         	 if (matchResult){
         	 		return matchResult;
         	 }else {
         	 	for (i=0; i < positionArray.length ; i++ ) {
         	 		if (positionArray[i] == "123"){
         	 		  return true ;
         	 		}
         	 	};
         	 }

    

			return jointString.match(combinedReg); 

         	
         }

		 // create string from player's arrays

		$scope.redOutcome = stringMatch(winCombo, $scope.player.redTeam, $scope.player.redPosition),
		$scope.blueOutcome = stringMatch(winCombo, $scope.player.blueTeam, $scope.player.bluePosition) ;



		 $scope.outcomeDisplay = function(red, blue){

		  	if(red){
	        	$scope.game.outcome = "Red Team Won" ;
	        	$scope.game.$save();

	        

	        	$scope.player.redScore[$scope.player.redCount] = true ;
	        	$scope.player.$save();

	        	$scope.player.redCount++;


	        	$scope.reset();
	        	$scope.gameWinningFunction();
	        	


	        } else if (blue){

	        	$scope.game.outcome = "Blue Team Won";
	        	$scope.game.$save();
	        	
	        	$scope.player.blueScore[$scope.player.blueCount] = true ;
	        	$scope.player.$save();
	        	
	        	$scope.player.blueCount++;

	        	$scope.reset();
	        	$scope.gameWinningFunction();
	        	

	        }else if ($scope.game.count == 9){
	        	$scope.game.outcome = "Game is a Draw";
	        	$scope.reset();
	        }

		  };

		$scope.gameWinningFunction =  function() {  
			  if($scope.player.redCount == 3){
			  	$scope.player.redTotalScores++;
			  	$scope.player.$save();
			  	$scope.game.outcome = "Red Team Won The Game";			  	
			  	$scope.game.$save();
			  	$scope.afterWinFunction();
			  }else if($scope.player.blueCount == 3){
			  	$scope.player.blueTotalScores++;
			  	$scope.player.$save();
			  	$scope.game.outcome  = "Blue Team Won The Game";
			  	$scope.game.$save();
			  	$scope.afterWinFunction();
			  }
		};


        
	   $scope.outcomeDisplay($scope.redOutcome, $scope.blueOutcome);

	   $scope.reset = function( ){

			$scope.game.turn = true;
			$scope.game.grid = ["","","","","","","","",""];
			$scope.game.$save();
			$scope.player.redTeam = ["","","","","",""];
			$scope.player.blueTeam = ["","","","","",""];
			$scope.player.redPosition = ["","","","","","","","",""];
			$scope.player.bluePosition = ["","","","","","","","",""];
			$scope.player.$save();
			$scope.mark = "";
			$scope.game.colorSwitch.red = true;
			$scope.game.colorSwitch.blue = false;
			$scope.game.count = 0;
			$scope.game.$save();
			$scope.redOutcome = null;
			$scope.blueOutcome = null ;



	   }


	};
	// Game start function
	$scope.startGame = function(){ 
		$scope.game.gameStart = true ;
		$scope.game.$save();

	    $scope.game.buttonHide = true;
	    $scope.game.$save();
	

		
	};

	// After Win Function
	$scope.afterWinFunction = function(){

		  $scope.game.playAgainFlag = true;
		  $scope.game.$save();
		  $scope.game.gameStart = false ;
		  $scope.game.buttonHide = false ;
		  $scope.game.$save();

		   //After game win additional variable reset

			if($scope.game.playAgainFlag){
				$scope.player.redCount = 0 ;
				$scope.player.blueCount = 0 ;
				$scope.player.redScore = ["","","","",""];
				$scope.player.blueScore = ["","","","",""] ;
			    $scope.player.$save();
			    // $scope.game.playAgainFlag = false ;
			    // $scope.game.$save()
			}

	};





});





// User Log in Users Controller
app.controller("UsersController",  function($scope, $firebase){



	  function makeId(){
		    var text = ""

		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    return text;
     }


      $scope.uniId  = makeId();


     		/*......define database................*/

			var ref = new Firebase('https://sctttapp.firebaseio.com/players');
			// var ref2 = new Firebase('https://sctttapp.firebaseio.com/game');
			var fb = $firebase(ref);
			// var fb2 = $firebase(ref2)				
			var players = fb.$asObject();
			// var game = fb2.$asObject() ;
          /*........................................*/


		players.$bindTo($scope, 'players');
		// game.$bindTo($scope, 'game');


      $scope.chooseOption = function(option){


      	if(option == 'red'){
      		fb.$update(option, { occupied: true });
      		fb.$update(option, { player: $scope.uniId });


      		
      		
      	 	if((players.blue.occupied == true) 
      	 		&& (players.blue.player == $scope.uniId)){
      	 		fb.$update('blue', {occupied: false, player: ""});
      	 	}

      	 	$scope.unseatedDisplay = true ;
    



      	}else if (option == 'blue'){
      	    fb.$update(option, { occupied: true });
      		fb.$update(option, { player: $scope.uniId });

      		
	 	
      	 	if((players.red.occupied == true) 
      	 		&& (players.red.player == $scope.uniId)){
      	 		fb.$update('red', {occupied: false, player: ""});
      	 	}


            $scope.unseatedDisplay = true ; 


		}



      
      };

      //unseated function.
      $scope.unseated = function(){

      		$scope.unseatedDisplay= false ;


      	   if(players.blue.player == $scope.uniId ){
      	   	  fb.$update('blue', {occupied: false, player: ""});
      	   	  $scope.abandonGame('blue');
      	    }else if(players.red.player == $scope.uniId ) {
      	   	  fb.$update('red', {occupied: false, player: ""});
			  $scope.abandonGame('red');


      	   }

      	};


	      $scope.abandonGame = function(s){
	     	var answer = confirm('Steven\'s Tic Tac Toe \n\n\ Are you sure you want to quit the game?');

		     if(answer){

		      	 if($scope.game.gameStart == true ){

		      	 	if(s == "blue"){
					  	$scope.player.blueTotalScores++; 
					  	$scope.player.$save();
					  	$scope.game.outcome  = "Blue Team Left the Game  Red Team Wins!";
						$scope.resetGrand(); 
		      	 	}else if (s == "red") {
		      	 		$scope.player.redTotalScores++;
					  	$scope.player.$save();
					  	$scope.game.outcome = "Red Team Left the Game. Blue Team Wins!";
					  	$scope.resetGrand(); 
		      	 	}

		      	 }

		      }

          };


      	  $scope.resetGrand = function( ){

			$scope.game.turn = true;
			$scope.game.grid = ["","","","","","","","",""];
			$scope.game.colorSwitch.red = true;
			$scope.game.colorSwitch.blue = false;
			$scope.game.count = 0;
			$scope.game.playAgainFlag = false ;
			$scope.game.gameStart = false ;
    	    $scope.game.buttonHide = false;
    	    $scope.game.$save();


			$scope.player.redTeam = ["","","","","",""];
			$scope.player.blueTeam = ["","","","","",""];
			$scope.player.redPosition = ["","","","","","","","",""];
			$scope.player.bluePosition = ["","","","","","","","",""];
			$scope.player.redCount = 0 ;
			$scope.player.blueCount = 0 ;
			$scope.player.redScore = ["","","","",""];
			$scope.player.blueScore = ["","","","",""] ;
			$scope.player.$save();


			$scope.mark = "";
			$scope.unseatedDisplay = false;

    		fb.$set({
      			red: {occupied: false, player: "", username: ""},
      			blue: {occupied: false, player: "", username: ""}
  					});

    			


			};




});