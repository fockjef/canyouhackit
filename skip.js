(function( challenge_id = "skip" ){

    let requires = [ "https://fockjef.net/canyouhackit/lib/score-text.js" ];

    runSolution( { challenge_id, requires, solution } );

    function solution( tag ){
        let msg = tag.challenge.encrypted_message,
            bestGuess = msg,
            bestScore = countWords(msg);
        for( let i = 1; i < msg.length; i++ ){
            let msgSkip = skip(msg, i),
                score = countWords(msgSkip);
            if( score > bestScore ){
                bestScore = score;
                bestGuess = msgSkip;
            }
        }
        console.info( msg );
        console.info( bestGuess );
        tag.refs.answer.value = bestGuess;
        tag.submitAnswer();
    }

    function skip( str, x ){
        let msg = "";
        for(let i = 0, j = 0; i < str.length; i++, j = (j + x) % str.length){
            msg += str[j];
        }
        return msg;
    }
})();
