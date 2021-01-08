// strings http-auth.cap | grep -i user | grep -i pass
// name=superuser&pass=thisistotallysecure&openid_identifier=&op=Log+in&remember_me=1& ...

(function( challenge_id = "http_auth" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let user = "superuser",
		    pass = "thisistotallysecure";
		console.info( user );
		console.info( pass );
		tag.refs.username.value = user;
		tag.refs.password.value = pass;
		tag.submitAnswer();
	}
})();
