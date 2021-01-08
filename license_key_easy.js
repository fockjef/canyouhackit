(function( challenge_id = "license_key_easy" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let flag = update( generate_table( 0xdeadbeef ), 0, "AIS Basic Keygen Flag (No Cheating!)" ).toString(16);
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

	function update( table, iv, msg ){
		let hash = ~iv >>> 0;
		for( let i = 0; i < msg.length; i++ ){
			hash = ( table[( msg.charCodeAt( i ) ^ hash ) & 0xff] ^ ( hash >>> 8 ) ) >>> 0;
		}
		return ~hash >>> 0;
	}

	function find_preimage( table, iv, hash, prefix = "" ){
		let preimage = [ 0, 0, 0, 0 ];
		iv = ~update( table, 0, prefix ) >>> 0;
		hash = ~hash >>> 0;
		for( let i = 0; i < 4; i++ ){
			let idx = table.findIndex( t => ( t ^ hash ) >>> 24 === 0 ),
				val = table[idx];
			preimage[i] ^= idx ^ ( ( iv >>> ( 24 - 8 * i ) ) & 0xff );
			hash = ( ( hash ^ val ) << 8 ) >>> 0;
			for( let j = i; j > 0; j-- ){
				preimage[j-1] ^= val & 0xff;
				val >>>= 8;
			}
		}
		return prefix + String.fromCharCode( ...preimage.reverse() );
	}

	function generate_license_key( seed = 0xc67d853b, iv = 0, hash = 0x984d83e0 ){
		let hex = /^[\da-f]+$/i,
			prefix = Math.floor( Math.random() * Math.pow( 2, 48 ) ).toString( 16 ),
			table = generate_table( seed );
		for( let i = 0; i < 1e6; i++ ){
			let h = find_preimage( table, iv, hash, ( prefix + i.toString( 16 ) ).slice( -12 ) );
			if( hex.test( h ) ) return h;
		}
	}
})();
