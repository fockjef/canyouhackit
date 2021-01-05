(function( challenge_id = "code_breaker" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		let code = "",
		    alphanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
		    score = 0;
		for( let i = 0; i < 7; i++ ){
			for( let j = 0; j < alphanum.length; j++ ){
				// CodeBreaker_submit never resolves on correct code ( solution still works but would hang at this point )
				// let s = await CodeBreaker_submit( code + alphanum[j] );
				let s = await HackerChallenge.submitAnswer( tag.challenge.meta.challenge_id, code + alphanum[j] ).fail( data => data.responseJSON ).then( data => data.hc_challenge.score );
				if( s > score ){
					score = s;
					code += alphanum[j];
					tag.refs.answer.value = code;
					j = Infinity;
				}
			}
		}
		console.info( code );
		tag.submitAnswer();
	}
})();
