(function( challenge_id = "brutal_force" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let pin;
		for( let i = 0; i < 10000 && pin === undefined; i++ ){
			let p = ( 10000 + i ).toString().slice( 1 );
			if( sha256( p ) === tag.challenge.pin_hash ){
				pin = p;
			}
			else if( i < 1000 && sha256( p.slice( 1 ) ) === tag.challenge.pin_hash ){
				pin = p.slice( 1 );
			}
		}
		console.info( pin );
		tag.refs.answer.value = pin;
		tag.submitAnswer();
	}
})();
