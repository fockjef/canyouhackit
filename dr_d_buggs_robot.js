(function( challenge_id = "dr_d_buggs_robot" ){

    runSolution( { challenge_id, solution } );

    function command_transmitter(command){
        if( command.length != 16 ) return new Array(16).fill("A".charCodeAt());
        let result = command.split("").map(c => c.charCodeAt());
        for(let i = 0, j, k; j != 0; i = j){
            j = (i * 13 + 7) % 16;
            k = command[j].charCodeAt();
            if( (k >= 65 && k <= 90) ^ !(k & 1) ){
                result[i] ^= 0x20;
            }
        }
        return String.fromCharCode(...result);
    }

    function solution( tag ){
        let goal = "quietrobotplease";
        for(let i = 0; i < 0x10000; i++){
            let cmd = String.fromCharCode(...(0x10000+i).toString(2).slice(1).split("").map((x, i) => x == "0" ? goal.charCodeAt(i) : goal.charCodeAt(i) ^ 0x20));
            if( command_transmitter(cmd) == goal ){
                console.info(cmd);
                tag.refs.answer.value = cmd;
                tag.submitAnswer();
                break;
            }
        }
    }
})();
