(function( challenge_id = "paid_content" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.challenge.paid = true;
		tag.submit( {} );
	}
})();
