(function( challenge_id = "super_admin" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.submitAnswer();
	}

	function solution2( tag ){
		window.super_admin = true;
		tag.submit( {} );
	}
})();
