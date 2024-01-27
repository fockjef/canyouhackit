(function( challenge_id = "babysfirst" ){

    let requires = [ "https://fockjef.net/canyouhackit/lib/elf.js" ];

    runSolution( { challenge_id, requires, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelector("a").href,
            file = await fetch(url).then(res => res.arrayBuffer()),
            elf = new ELF(file),
            password = elf.readString(elf.section(".topsykretts")[0].offset);
        console.info( password );
        tag.refs.answer.value = password;
        tag.submitAnswer();
    }
})();
