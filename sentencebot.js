// https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// http://blog.k3170makan.com/2018/10/introduction-to-elf-format-part-vi.html

// *note* most 32-bit int's should really be 64-bits
// but if the binary is +4GB then maybe javascript isnt the best way to do this

(function( challenge_id = "sentencebot" ){

	runSolution( { challenge_id, solution } );

	async function solution( tag ){
		let url = HackerChallenge.getBinaryLink( `${challenge_id}/${challenge_id}` )[0].href,
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

		// get symbol table and string table
		let symtab = sections.filter( s => s.name === ".symtab" )[0],
			strtab = sections.filter( s => s.name === ".strtab" )[0],
			flag;
		// work from back of symbol table cause reasons :P
		for( let pos = symtab.offset + symtab.size - symtab.entsize; pos >= symtab.offset; pos -= symtab.entsize ){
			let name = readStr( bin.getUint32( pos, true ), strtab.offset, bin );
			if( name === "FLAG" ){
				let temp = readStr( bin.getUint32( pos + 0x08, true ) - vaddr, 0, bin );
				flag = String.fromCharCode( ...temp.substr( temp.length / 2 ).split( "" ).map( ( c, i ) => c.charCodeAt() ^ temp.charCodeAt( i ) ) );
				break;
			}
		}
		
		console.info( flag );
		tag.refs.answer.value = flag;
		tag.submitAnswer();
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
