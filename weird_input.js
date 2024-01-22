(function( challenge_id = "weird_input" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.refs.answer.value = tag.challenge.flag;
		tag.submit( {} );
	}
})();