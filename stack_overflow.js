/*
#include <stdio.h>
#include <string.h>

int main(int argc, char** argv) {
    int authenticated = 0;
    char password[12] = {'\0'};
    char checkpass[12] = "********";

    printf("Enter the password: ");

	// gets(password) will read an arbitrary number of bytes into the 12 byte password buffer
	// any bytes after the 12th will overflow into the memory allocated for int authenticated
	// bytes 13, 14, 15, and 16 of the password will be interpreted as an int (little endian most likely)
    gets(password);

    if (!strncmp(password, checkpass, 12)) {
        authenticated = 1;
    }

    if (authenticated) {
        printf("Success!\n");
        return 0;
    }

    printf("Invalid password!\n");
    return 1;
}
*/

(function( challenge_id = "stack_overflow" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let buff = crypto.getRandomValues( new Uint8Array( 16 ) ).map( n => 33 + 94 * n / 256 ),
			pass = String.fromCharCode( ...buff ),
		    auth = new DataView( buff.buffer ).getInt32( 12, true /* LE */ );
		console.info( pass );
		console.info( auth );
		tag.refs.password.value = pass;
		tag.refs.authenticated.value = auth;
		tag.submitAnswer();
	}
})();
