(function(){
	let challenges = window.challenges = {};

	document.querySelectorAll( "challenge-card" ).forEach( card => {
		let tag = card.getElementsByTagName( "challenge-modal" )[0]._tag,
			cid = tag.challenge.meta.challenge_id;
		challenges[cid] = tag;
		card.querySelector( "button.btn-lg" ).addEventListener( "click", () => {
			if( !tag.challenge.solved ){
				let solution = document.head.appendChild( document.createElement( "script" ) );
				solution.onerror = () => console.error( `ERROR: No solution for challenge "${cid}".` );
				solution.src = `https://fockjef.net/canyouhackit/${cid}.js`;
			}
		} );
	} );

	function loadScript( src ){
		if( [ ...document.getElementsByTagName( "script" ) ].some( script => script.src === src ) ) return Promise.resolve();
		return new Promise( ( resolve, reject ) => {
			let script = document.head.appendChild( document.createElement( "script" ) );
			script.onload = resolve;
			script.onerror = () => {
				script.parentNode.removeChild( script );
				reject( `Failed to load script ${src}` );
			};
			script.src = src;
		} );
	}

	window.runSolution = async function( { challenge_id, solution, requires } ){
		if( requires ){
			if( typeof requires === "string" ) requires = [ requires ];
			if( !Array.isArray( requires ) ) return console.error( "Parameter 'requires' expects array" );
			try{
				await Promise.all( requires.map( loadScript ) );
			}
			catch( error ){
				return console.error( error );
			}
		}
		if( !( challenge_id in challenges ) ) return console.error( `Invalid challenge_id ${challenge_id}` );
		if( typeof solution !== "function" ) return console.error( "Parameter 'solution' expects function" );
		console.group( challenge_id );
		solution( challenges[challenge_id] );
		console.groupEnd( challenge_id );
	};

	window.sleep = function( ms ){
		return new Promise( resolve => setTimeout( resolve, ms ) );
	}
})();
