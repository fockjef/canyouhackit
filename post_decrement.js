(function( challenge_id = "post_decrement" ){

    runSolution( { challenge_id, solution } );

    function solution( tag ){
        let i = 5,
            output = "";
        while( i-- > 0 ){
            output += `${i},`;
        }
        console.info( output );
        tag.refs.answer.value = output;
        tag.submitAnswer();
    }
})();
