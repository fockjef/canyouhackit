(function( challenge_id = "button_clicker" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        ButtonClicker_num_clicks = 1e6;
        ButtonClicker_click_button({originalEvent:{isTrusted: true}, type: "click"});
        tag.submitAnswer();
    }
})();