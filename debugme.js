(function( challenge_id = "debugme" ){
    /*
    NOTES:
    1) 	running `strings debugme` points to:
        $Info: This file is packed with the     executable packer http://   .sf.net $
        $Id:     3.94 Copyright (C) 1996-2017 the     Team. All Rights Reserved. $
        which looks an awful lot like UPX packer
    2) 	tried unpacking with upx packer but complains the file is not a valid packed executable
        so now we look into what makes a valid upx packed executable
        turns out upx looks for the magic bytes "UPX!" at certain locations and ...
        suprise suprise the UPX bytes have been replace with spaces ( 0x20 )
        so fix that up and boom we have an unpacked program
    3)	decompile that bad boy and get stuck for a couple of days because
        the people who made the program are jerks. the function that looks like it prints the
        prompts and responses isn't actually the one that does that stuff. as they say IT'S A TRAP
    4)	found the real function that prints the prompts (not sure exactly how it is passed execution but suspect
        some sort of exception handler since Ctrl-C doesnt kill the process, so maybe it really is a trap :) )
    5)	time to start twiddling some things around
        managed to get the program to complain:
            "Are you trying to influence me? Your Jedi mind tricks are no good here."
            "Hmm, that doesn't SEEM like an answer I'd give..."
    BINGO!
    Wow! You must be psychic!
    Here you go, but keep in mind that the flag is time-sensitive.
    flag{DebuggerXordinaire-5FFF5782-E722796A}
    6) So looks like those 2 hex numbers are time dependent as it clearly says
        the first number is just number of seconds since epoch from time()
        the second is probably some sort of hash of the number which is probably a real pain to reverse
        so instead just patch the unpacked binary by changing 2 JZ instructions to JNZ instructions (change byte from 0x84 to 0x85)
        [see debugme.sh]
    */

    runSolution( { challenge_id, solution } );

    function solution( tag ){
        let callback = "debugme_" + Date.now();
        window[callback] = function(flag){
            console.info( flag );
            tag.refs.answer.value = flag;
            tag.submitAnswer();
        }
        document.head.appendChild(document.createElement("script")).src = `https://fockjef.net/canyouhackit/debugme.pl?callback=${callback}`;
    }
})();
