(function( challenge_id = "license_key_hard" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let time = Date.now() / 1000 >>> 0,
		    table = generate_table( 0xedb88320 ),
		    challenge = update_uint32( table, 0, time - time % 30 ),
		    response = challenge % 2 ? challenge * 0x39b + 0x8a076da9 ^ 0x8b720af7 : challenge / 0x337 + 0xf29ab3f7 ^ 0xe341c9d9,
		    hash = update_uint32( table, update_uint32( table, 0, challenge ), response ),
		    flag = [ challenge, response, hash ].map( x => ( x >>> 0 ).toString( 16 ) ).join( "" );
		console.info( flag );
		tag.refs.answer.value = flag;
		tag.submitAnswer();
	}

	function generate_table( seed ){
		let table = new Uint32Array( 256 );
		for( let i = 0; i < 0x100; i++ ){
			let val = i;
			for( let j = 0; j < 8; j++ ){
				val = val & 1 ? ( val >>> 1 ) ^ seed : val >>> 1;
			}
			table[i] = val;
		}
		return table;
	}

	function update_uint32( table, iv, uint32 ){
		// convert to network order ( big-endian )
		uint32 = new DataView( new Uint32Array( [ uint32 ] ).buffer ).getUint32( 0 );
		// convert uint to binary string
		let msg = String.fromCharCode( ...new Uint8Array( new Uint32Array( [ uint32 ] ).buffer ) );
		return update( table, iv, msg );
	}

	function update( table, iv, msg ){
		let hash = ~iv >>> 0;
		for( let i = 0; i < msg.length; i++ ){
			hash = ( table[( msg.charCodeAt( i ) ^ hash ) & 0xff] ^ ( hash >>> 8 ) ) >>> 0;
		}
		return ~hash >>> 0;
	}
})();
