(function( challenge_id = "timer" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.submitAnswer( tag.challenge.resp );
	}

	function solution2( tag ){
		HackerChallenge.stopTimer( $( "#" + tag.challenge.oid + "-timer" ) );
		localStorage.setItem( "hackerchallenge.timer", 0 );
		tag.submit( {} );
	}
})();
