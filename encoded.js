(function( challenge_id = "encoded" ){

    let requires = [
        "https://fockjef.net/canyouhackit/lib/bzip2.js",
        "https://fockjef.net/canyouhackit/lib/zip.js"
    ];

    runSolution( { challenge_id, requires, solution } );

    function solution( tag ){
        JSZip.loadAsync(new Uint8Array(tag.challenge.encoded_flag.match(/../g).map(x => parseInt(x, 16))).buffer).then(async data => {
            let flag = await data.file("flag.txt").async("string"),
                bin =  Uint8Array.from(atob(flag), chr => chr.charCodeAt());
            flag = String.fromCharCode(...bzip2.decompress(bin));
            flag = String.fromCharCode(...flag.match(/[01]+/g).map(x => parseInt(x, 2)));
            flag = String.fromCharCode(...flag.match(/../g).map(x => parseInt(x, 16)));
            console.info( flag );
            tag.refs.answer.value = flag;
            tag.submitAnswer();
        });
    }
})();
