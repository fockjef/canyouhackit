(function( challenge_id = "disabled_button" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		while( tag.refs.submitButton.disabled == false ){
			await sleep(100);
		}
		tag.refs.submitButton.disabled = false;
		tag.submit( {} );
	}

	function sleep( ms ){
		return new Promise( resolve => setTimeout( resolve, ms ) );
	}
})();