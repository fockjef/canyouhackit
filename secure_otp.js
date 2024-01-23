(function( challenge_id = "secure_otp" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
        await sleep(250);
        console.log(tag.refs.challengeContent.innerText);
    }
    function sleep( ms ){
        return new Promise( resolve => setTimeout( resolve, ms ) );
    }
})();
