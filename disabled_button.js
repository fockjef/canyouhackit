(function( challenge_id = "disabled_button" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		tag.refs.submitButton.disabled = false;
		tag.submitAnswer();
	}
})();