(function( challenge_id = "sentencebot" ){

    let requires = [ "https://fockjef.net/canyouhackit/lib/elf.js" ];

    runSolution( { challenge_id, requires, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelector("a").href,
            file = await fetch(url).then(res => res.arrayBuffer()),
            elf = new ELF(file);
            flag = elf.readString(elf.symbol("FLAG")[0].value - elf.base_addr).split("").map(c => c.charCodeAt());
        flag = String.fromCharCode(...flag.slice(flag.length/2).map((x, i) => x ^ flag[i]));
        console.info( flag );
        tag.refs.answer.value = flag;
        tag.submitAnswer();
    }
})();