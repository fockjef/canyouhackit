(function( challenge_id = "defuse" ){

    let requires = [ "https://fockjef.net/canyouhackit/lib/elf.js" ];

    runSolution( { challenge_id, requires, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelector("a").href,
            file = await fetch(url).then(res => res.arrayBuffer()),
            elf = new ELF(file);
        tag.refs.phase_1.value = phase_1(elf);
        tag.refs.phase_2.value = phase_2(elf);
        tag.refs.phase_3.value = phase_3(elf);
        tag.refs.phase_4.value = phase_4(elf);
        console.info( tag.refs.phase1.value );
        console.info( tag.refs.phase2.value );
        console.info( tag.refs.phase3.value );
        console.info( tag.refs.phase4.value );
        tag.submitAnswer();
    }

    function phase_1(elf){
        return elf.readString(elf.section(".dabomb")[0].offset);
    }

    function phase_2(elf){
        let wire_cut_sequence = elf.symbol("wire_cut_sequence")[0];
        wire_cut_sequence = elf.getBytes(wire_cut_sequence.value - elf.base_addr, wire_cut_sequence.size);
        wire_cut_sequence = wire_cut_sequence.filter((_, i) => i % 4 == 0);
        wire_cut_sequence = wire_cut_sequence.map((_, i) => wire_cut_sequence.indexOf(i));
        return wire_cut_sequence.join(" ");
    }

    function phase_3(elf){
        let n = new Int8Array([elf.getUint8(0x08049ea5 - elf.base_addr)])[0] >>> 0,
            q = n / 3 >>> 0,
            r = n % 3;
        return [q + r, q, q].join(" ");
    }

    function phase_4(elf){
        let disposal_mode_str = elf.readString(elf.symbol("disposal_mode_str")[0].value - elf.base_addr);
        disposal_mode_str += String.fromCharCode(elf.getUint8(0x08049fe9 - elf.base_addr));
        disposal_mode_str += String.fromCharCode(elf.getUint8(0x0804a022 - elf.base_addr));
        return disposal_mode_str;
    }
})();
