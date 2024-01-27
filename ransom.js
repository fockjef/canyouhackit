
(function( challenge_id = "ransom" ){

    let requires = [
        "https://fockjef.net/canyouhackit/lib/bzip2.js",
        "https://fockjef.net/canyouhackit/lib/zip.js"
    ];

    runSolution( { challenge_id, requires, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelectorAll("a")[1].href,
            file = await fetch(url).then(res => res.arrayBuffer());
        decrypt(file);
        JSZip.loadAsync(file).then(async zip => {
            let flag = await zip.file("flag.txt").async("uint8array");
            flag = String.fromCharCode(...bzip2.decompress(flag));
            console.info(flag);
            tag.refs.answer.value = flag;
            tag.submitAnswer();
        })
    }

    function decrypt(data){
        data = new Uint8Array(data).reverse();
        for(let i = 0; i < data.length; i++){
            if( data[i] < 0x7f ){
                data[i] += 0x81;
            }
            else if( data[i] > 0x80 ){
                data[i] -= 0x81;
            }
        }
    }
})();
