// https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// http://blog.k3170makan.com/2018/10/introduction-to-elf-format-part-vi.html

// *note* most 32-bit int's should really be 64-bits
// but if the binary is +4GB then maybe javascript isnt the best way to do this

(function( challenge_id = "babysfirst" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelector("a").href,
            bin = new DataView( await fetch( url ).then( res => res.arrayBuffer() ) ),
            phoff = bin.getUint32( 0x20, true ),
            vaddr = bin.getUint32( phoff + 0x10, true ),
            shoff = bin.getUint32( 0x28, true ),
            shentsize = bin.getUint16( 0x3a, true ),
            shnum = bin.getUint16( 0x3c, true ),
            shstrndx = bin.getUint16( 0x3e, true ),
            shstrtaboff = bin.getUint32( shoff + shentsize * shstrndx + 0x18, true ),
            shstrtabsize = bin.getUint32( shoff + shentsize * shstrndx + 0x20, true );

        // read sections from section header
        let sections = new Array( shnum );
        for( let i = 0, pos = shoff; i < shnum; i++, pos += shentsize ){
            sections[i] = {
                name: readStr( bin.getUint32( pos, true ), shstrtaboff, bin ),
                offset: bin.getUint32( pos + 0x18, true ),
                size: bin.getUint32( pos + 0x20, true ),
                entsize: bin.getUint32( pos + 0x38, true )
            }
        }

        // get password from topsykrett data section
        let topsykretts = sections.filter( s => s.name === ".topsykretts" )[0],
            password = readStr(0, topsykretts.offset, bin);

        console.info( password );
        tag.refs.answer.value = password;
        tag.submit({});
    }

    function readStr( offset, base, bin ){
        let name = "",
            pos = base + offset;
        while( bin.getInt8( pos ) ){
            name += String.fromCharCode( bin.getInt8( pos ) );
            pos++;
        }
        return name;
    }
})();
