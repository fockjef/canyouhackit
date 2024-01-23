(function( challenge_id = "birthday" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        for(let y = 1900; y <= 2024; y++){
            for(let m = 1; m <= 12; m++){
                for(let d = 1; d <= 31; d++){
                    let date = `${m.toString().padStart(2, "0")}/${d.toString().padStart(2, "0")}/${y}`;
                    if( sha256(date) == tag.challenge.date_hash ){
                        Birthday_get_today = () => date;
                        tag.submit({});
                        return;
                    }
                }
            }
        }
    }
})();