(function( challenge_id = "encoded" ){

	let requires = [ "https://fockjef.net/canyouhackit/lib/bzip2.js" ];

	runSolution( { challenge_id, requires, solution } );

	function solution( tag ){
		let bin  = Uint8Array.from( atob( tag.challenge.encoded_flag ), chr => chr.charCodeAt() ),
		    txt1 = String.fromCharCode( ...bzip2.decompress( bin ) ),
		    txt2 = String.fromCharCode( ...txt1.match( /\b[01]+\b/g  ).map( bits => parseInt( bits,  2 ) ) ),
		    flag = String.fromCharCode( ...txt2.match( /[\da-f]{2}/g ).map( byte => parseInt( byte, 16 ) ) );
		console.info( flag );
		tag.refs.answer.value = flag;
		tag.submitAnswer();
	}
})();
