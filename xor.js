(function( challenge_id = "xor" ){

	let requires = [ "https://fockjef.net/canyouhackit/lib/score-text.js" ];

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let cipher = tag.challenge.cipher.match( /../g ).map( x => parseInt( x, 16 ) ),
		    key = new Array( tag.challenge.key_len );
		for( let i = 0; i < key.length; i++ ){
			let temp = cipher.filter( ( _, j ) => j % key.length === i )
			key[i] = [];
			for( let byte = 32, bestByteScore = 0; byte < 127; byte++ ){
				let score = String.fromCharCode( ...temp.map( x => x ^ byte ) ).replace( /[^a-z ]+/gi, "" ).length;
				if( score > bestByteScore ){
					bestByteScore = score;
					key[i] = [ byte ];
				}
				else if( score === bestByteScore ){
					key[i].push( byte );
				}
			}
		}
		key = buildKeys( key ).map( k => [ k, scoreText( decodeMsg( cipher, k ) ) ] ).sort( ( a, b ) => b[1] - a[1] )[0][0];
		let msg = String.fromCharCode( ...cipher.map( ( c, i ) => c ^ key[i%key.length] ) );
		key = String.fromCharCode( ...key );
		console.info( key );
		console.info( msg );
		tag.refs.answer.value = key;
		tag.submitAnswer();
	}

	function buildKeys( keyBytes, key = [] ){
		if( keyBytes.length === 0 ) return [ key ];
		let keys = [];
		for( let i = 0; i < keyBytes[0].length; i++ ){
			keys.push( ...buildKeys( keyBytes.slice( 1 ), key.concat( keyBytes[0][i] ) ) );
		}
		return keys;
	}

	function decodeMsg( cipher, key ){
		return String.fromCharCode( ...cipher.map( ( c, i ) => c ^ key[i%key.length] ) );
	}
})();
