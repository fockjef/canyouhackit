(function( challenge_id = "enigma" ){

	const reflector = "UKW B",
	      plugboard = "BV PK XZ IJ RA GD MQ UT WF",
	      hint1 = [ 16, 18, 03 ],
	      hint2 = [ 06, 23, 12 ];

	let requires = [
	    	"https://fockjef.net/canyouhackit/lib/enigma.js",
	    	"https://fockjef.net/canyouhackit/lib/wordtree.js"
	    ];

	runSolution( { challenge_id, requires, solution } );

	function solution( tag ){
		let rotorPerms = choose( [ RotorI, RotorII, RotorIII, RotorIV, RotorV ], 3 ),
		    initPerms = choose( "012", 3 ).map( p => [
		    	String.fromCharCode( ...p.map( i => hint1[+i] + 64 ) ),
		    	String.fromCharCode( ...p.map( i => hint2[+i] + 64 ) )
		    ] ),
		    enigma = new Machine(),
		    bestScore = 0, bestMsg;
		enigma.setReflector( window["Reflector"+reflector.slice(-1)]() );
		enigma.setPlugboard( new Plugboard( ...plugboard.split( " " ) ) );
		rotorPerms.forEach( rotors => {
			initPerms.forEach( init => {
				for( let i = 0; i < 2; i++ ){
					enigma.setRotors( ...rotors.map( r => r() ) );
					enigma.rotors.forEach( ( r, j ) => {
						r.setInitialPosition( init[i][j] );
						r.setInnerPosition( init[1-i][j] );
					} );
					let msg = enigma.encodeLetters( tag.challenge.encrypted_message ),
						score = scoreText( msg );
					if( score > bestScore ){
						bestScore = score;
						bestMsg = msg;
					}
				}
			} )
		} );
		console.info( bestMsg );
		tag.refs.answer.value = bestMsg;
		tag.submitAnswer();
	}

	function choose( list, k, allowDupes = false ){
		let perms = new Array( Math.pow( list.length, k ) );
		for( let i = 0; i < perms.length; i++ ){
			perms[i] = ( perms.length + i ).toString( list.length ).slice( 1 );
		}
		if( !allowDupes ){
			let hasDupes = /(.).*\1/;
			perms = perms.filter( p => !hasDupes.test( p ) );
		}
		return perms.map( p => p.split( "" ).map( i => list[+i] ) );
	}

	function scoreText( str ){
		let score = 0;
		str = str.toLowerCase();
		for( let i = 0; i < str.length - 4; i++ ){
			score += +!!str.slice( i, i + 4 ).split( "" ).reduce( ( T, c ) => T && c in T ? T[c] : undefined, tree );
		}
		return score;
	}
})();
