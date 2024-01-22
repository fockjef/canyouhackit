(function( challenge_id = "disabled_button" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.refs.submitButton.disabled = false;
		tag.submit( {} );
	}
})();