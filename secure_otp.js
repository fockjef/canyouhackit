(function( challenge_id = "secure_otp" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        console.log("seed", tag.challenge.seed);
    }
})();
