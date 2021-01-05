(function( challenge_id = "xor" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let cipher = tag.challenge.cipher.match( /../g ).map( x => parseInt( x, 16 ) ),
		    key = new Array( tag.challenge.key_len );
		for( let i = 0; i < key.length; i++ ){
			let temp = cipher.filter( ( _, j ) => j % key.length === i )
			for( let byte = 32, bestByteScore = -1; byte < 127; byte++ ){
				let score = String.fromCharCode( ...temp.map( x => x ^ byte ) ).replace( /[^a-z ]+/gi, "" ).length;
				if( score > bestByteScore ){
					bestByteScore = score;
					key[i] = byte;
				}
			}
		}
		let msg = String.fromCharCode( ...cipher.map( ( c, i ) => c ^ key[i%key.length] ) );
		key = String.fromCharCode( ...key );
		console.info( key );
		console.info( msg );
		tag.refs.answer.value = key;
		tag.submitAnswer();
	}
})();
