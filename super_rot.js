(function( challenge_id = "super_rot" ){

	let requires = [ "https://fockjef.net/canyouhackit/lib/score-text.js" ];

	runSolution( { challenge_id, requires, solution } );

	async function solution( tag ){
		let prev_enc_msg = "";
		while( tag.challenge.num_solved < tag.challenge.num_to_solve ){
			// make sure we wait for the challenge tag to be updated with a new encrypted message
			while( tag.challenge.encrypted_message === prev_enc_msg ){
				await sleep( 250 );
			}
			let enc_msg = prev_enc_msg = tag.challenge.encrypted_message,
			    bestScore = 0,
			    bestMsg = "";
			for( let i = 0; i < 26; i++ ){
				let msg = rotX( enc_msg, i ),
				    score = countWords( msg );
				if( score > bestScore ){
					bestScore = score;
					bestMsg = msg;
				}
			}
			console.info( tag.challenge.num_solved, bestMsg );
			if( !await SuperRot_submit( bestMsg ) ){
				console.error( "Failed to decode message", enc_msg, bestMsg );
				return;
			}
		}
	}

	function rotX( str, x ){
		return str.replace( /[a-z]/g, chr => String.fromCharCode( 97 + ( chr.charCodeAt() - 97 + x ) % 26 ) );
	}

	function sleep( ms ){
		return new Promise( resolve => setTimeout( resolve, ms ) );
	}
})();
