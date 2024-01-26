// https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// http://blog.k3170makan.com/2018/10/introduction-to-elf-format-part-vi.html

// *note* most 32-bit int's should really be 64-bits
// but if the binary is +4GB then maybe javascript isnt the best way to do this

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
