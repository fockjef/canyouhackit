(function( challenge_id = "post_decrement" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		tag.refs.answer.value = "4,3,2,1,0,";
		console.info( tag.refs.answer.value );
		tag.submitAnswer();
	}

	function solution2( tag ){
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
