(function( challenge_id = "base64_enc" ){

    let requires = [ "https://fockjef.net/canyouhackit/lib/zip.js" ];

    runSolution( { challenge_id, requires, solution } );

    function solution( tag ){
        JSZip.loadAsync(tag.challenge.b64_blob, {base64: true}).then(async data => {
            let flag = await data.file("flag.txt").async("string"),
                xor_key = await data.file("xor_key.txt").async("string");
            flag = String.fromCharCode(...flag.match(/../g).map((x, i) => parseInt(x, 16) ^ xor_key.charCodeAt(i)));
            console.info( flag );
            tag.refs.answer.value = flag;
            tag.submitAnswer();
        })
    }
})();
