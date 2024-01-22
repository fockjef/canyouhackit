(function( challenge_id = "http_auth" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        let downloadPCAP = true,
            user, pass;

        if( downloadPCAP ){
            let url = HackerChallenge.getBinaryLink( `${challenge_id}/http-auth.cap` )[0].href,
                data = await fetch(url).then(res => res.text());
            user = data.match(/(?<=name=)[^&]+/)[0];
            pass = data.match(/(?<=pass=)[^&]+/)[0];
        }
        else{
            // strings http-auth.cap | grep -i name | grep -i pass
            // name=superuser&pass=thisistotallysecure&openid_identifier=&op=Log+in&remember_me=1& ...
            user = "superuser",
            pass = "thisistotallysecure";
        }

        console.info( user );
        console.info( pass );
        tag.refs.username.value = user;
        tag.refs.password.value = pass;
        tag.submitAnswer();
    }
})();
