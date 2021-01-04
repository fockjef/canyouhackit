(function( challenge_id = "base64_enc" ){

	let requires = [ "https://fockjef.net/canyouhackit/lib/zip.js" ];

	runSolution( { challenge_id, requires, solution } );

	function solution( tag ){
		zip.useWebWorkers = false;
		zip.createReader( new zip.Data64URIReader( tag.challenge.b64_blob ), reader =>
			reader.getEntries( files =>
				files.filter( f => f.filename === "flag.txt" )[0].getData( new zip.TextWriter(), flag => {
					flag = flag.match( /[\da-f]{2}/g ).map( ( byte, i ) => parseInt( byte, 16 ) );
					files.filter( f => f.filename === "xor_key.txt" )[0].getData( new zip.TextWriter(), key => {
						flag = String.fromCharCode( ...flag.map( ( f, i ) => f ^ key.charCodeAt( i ) ) );
						console.info( flag );
						tag.refs.answer.value = flag;
						tag.submitAnswer();
					} );
				} )
			)
		)
	}
})();
