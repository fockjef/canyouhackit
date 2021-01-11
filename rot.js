(function( challenge_id = "rot" ){

	let requires = [ "https://fockjef.net/canyouhackit/lib/score-text.js" ];

	runSolution( { challenge_id, requires, solution } );

	function solution( tag ){
		let msg = tag.challenge.encrypted_message,
		    bestGuess = msg,
		    bestScore = scoreText( msg );
		for( let i = 1; i < 26; i++ ){
			let msgRot = rotX( msg, i ),
			    score = countWords( msgRot );
			if( score > bestScore ){
				bestScore = score;
				bestGuess = msgRot;
			}
		}
		console.info( msg );
		console.info( bestGuess );
		tag.refs.answer.value = bestGuess;
		tag.submitAnswer();
	}

	function rotX( str, x ){
		return str.replace( /[a-z]/g, chr => String.fromCharCode( 97 + ( chr.charCodeAt() - 97 + x ) % 26 ) );
	}
})();
