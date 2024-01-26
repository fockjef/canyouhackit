// https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
// http://blog.k3170makan.com/2018/10/introduction-to-elf-format-part-vi.html

function ELF(binary){
    let elf = {};
    parseHeader();
    parseProgramHeaderTable();
    parseSectionHeaderTable();
    parseSymbolTable();
    elf.binary = binary;
    elf.section = section;
    elf.symbol = symbol;
    elf.readString = readString;
    let bin = new DataView(binary),
        endianness = elf.ident.data == 1
    elf.base_addr = Math.min(...elf.phtable.map(e => e.vaddr).filter(Boolean));
    elf.getUint8 = offset => bin.getUint8(offset);
    elf.getUint16 = offset => bin.getUint16(offset, endianness);
    elf.getUint32 = offset => bin.getUint32(offset, endianness);
    elf.getBigInt64 = offset => Number(bin.getBigInt64(offset, endianness));
    elf.getBytes = (offset, length) => new Uint8Array(binary, offset, length).slice();
    return elf;

    function parseHeader(){
        let bin = new DataView(binary, 0x0, 0x10);
        elf.ident = {
            magic:      new Uint8Array(binary, 0, 4),
            class:      bin.getUint8(0x04),
            data:       bin.getUint8(0x05),
            version:    bin.getUint8(0x06),
            osabi:      bin.getUint8(0x07),
            abiversion: bin.getUint8(0x08)
        }
        if( elf.ident.magic[0] != 0x7f || String.fromCharCode(...elf.ident.magic.slice(1)) != "ELF" ){
            throw new Error("Invalid ELF binary");
        }
        if( elf.ident.class == 1 ) __parseHeader32();
        if( elf.ident.class == 2 ) __parseHeader64();
    }

    function __parseHeader32(){
        let bin = new DataView(binary, 0x0, 0x34),
            endianness = elf.ident.data == 1;
        elf.type      = bin.getUint16(0x10, endianness);
        elf.machine   = bin.getUint16(0x12, endianness);
        elf.version   = bin.getUint32(0x14, endianness);
        elf.entry     = bin.getUint32(0x18, endianness);
        elf.phoff     = bin.getUint32(0x1c, endianness);
        elf.shoff     = bin.getUint32(0x20, endianness);
        elf.flags     = bin.getUint32(0x24, endianness);
        elf.ehsize    = bin.getUint16(0x28, endianness);
        elf.phentsize = bin.getUint16(0x2a, endianness);
        elf.phnum     = bin.getUint16(0x2c, endianness);
        elf.shentsize = bin.getUint16(0x2e, endianness);
        elf.shnum     = bin.getUint16(0x30, endianness);
        elf.shstridx  = bin.getUint16(0x32, endianness);
    }

    function __parseHeader64(){
        let bin = new DataView(binary, 0x0, 0x40),
            endianness = elf.ident.data == 1;
        elf.type      = bin.getUint16(0x10, endianness);
        elf.machine   = bin.getUint16(0x12, endianness);
        elf.version   = bin.getUint32(0x14, endianness);
        elf.entry     = Number(bin.getBigInt64(0x18, endianness));
        elf.phoff     = Number(bin.getBigInt64(0x20, endianness));
        elf.shoff     = Number(bin.getBigInt64(0x28, endianness));
        elf.flags     = bin.getUint32(0x30, endianness);
        elf.ehsize    = bin.getUint16(0x34, endianness);
        elf.phentsize = bin.getUint16(0x36, endianness);
        elf.phnum     = bin.getUint16(0x38, endianness);
        elf.shentsize = bin.getUint16(0x3a, endianness);
        elf.shnum     = bin.getUint16(0x3c, endianness);
        elf.shstridx  = bin.getUint16(0x3e, endianness);
    }

    function parseProgramHeaderTable(){
        if( elf.ident.class == 1 ) __parseProgramHeaderTable32();
        if( elf.ident.class == 2 ) __parseProgramHeaderTable64();
    }

    function __parseProgramHeaderTable32(){
        let endianness = elf.ident.data == 1;
        elf.phtable = new Array(elf.phnum);
        for(let i = 0; i < elf.phnum; i++){
            let bin = new DataView(binary, elf.phoff + elf.phentsize * i, elf.phentsize);
            elf.phtable[i] = {
                type  : bin.getUint32(0x00, endianness),
                offset: bin.getUint32(0x04, endianness),
                vaddr : bin.getUint32(0x08, endianness),
                paddr : bin.getUint32(0x0c, endianness),
                filesz: bin.getUint32(0x10, endianness),
                memsz : bin.getUint32(0x14, endianness),
                flags : bin.getUint32(0x18, endianness),
                align : bin.getUint32(0x1c, endianness)
            }
        }
    }

    function __parseProgramHeaderTable64(){
        let endianness = elf.ident.data == 1;
        elf.phtable = new Array(elf.phnum);
        for(let i = 0; i < elf.phnum; i++){
            let bin = new DataView(binary, elf.phoff + elf.phentsize * i, elf.phentsize);
            elf.phtable[i] = {
                type  : bin.getUint32(0x00, endianness),
                flags : bin.getUint32(0x04, endianness),
                offset: Number(bin.getBigInt64(0x08, endianness)),
                vaddr : Number(bin.getBigInt64(0x10, endianness)),
                paddr : Number(bin.getBigInt64(0x18, endianness)),
                filesz: Number(bin.getBigInt64(0x20, endianness)),
                memsz : Number(bin.getBigInt64(0x28, endianness)),
                align : Number(bin.getBigInt64(0x30, endianness))
            }
        }
    }

    function parseSectionHeaderTable(){
        if( elf.ident.class == 1 ) __parseSectionHeaderTable32();
        if( elf.ident.class == 2 ) __parseSectionHeaderTable64();
        // resolve section header names
        elf.shtable.forEach(e => e.name = readString(elf.shtable[elf.shstridx].offset + e.name));
    }

    function __parseSectionHeaderTable32(){
        let endianness = elf.ident.data == 1;
        elf.shtable = new Array(elf.shnum);
        for(let i = 0; i < elf.shnum; i++){
            let bin = new DataView(binary, elf.shoff + elf.shentsize * i, elf.shentsize);
            elf.shtable[i] = {
                name     : bin.getUint32(0x00, endianness),
                type     : bin.getUint32(0x04, endianness),
                flags    : bin.getUint32(0x08, endianness),
                addr     : bin.getUint32(0x0c, endianness),
                offset   : bin.getUint32(0x10, endianness),
                size     : bin.getUint32(0x14, endianness),
                link     : bin.getUint32(0x18, endianness),
                info     : bin.getUint32(0x1c, endianness),
                addralign: bin.getUint32(0x20, endianness),
                entsize  : bin.getUint32(0x24, endianness)
            }
        }
    }

    function __parseSectionHeaderTable64(){
        let endianness = elf.ident.data == 1;
        elf.shtable = new Array(elf.shnum);
        for(let i = 0; i < elf.shnum; i++){
            let bin = new DataView(binary, elf.shoff + elf.shentsize * i, elf.shentsize);
            elf.shtable[i] = {
                name     : bin.getUint32(0x00, endianness),
                type     : bin.getUint32(0x04, endianness),
                flags    : Number(bin.getBigInt64(0x08, endianness)),
                addr     : Number(bin.getBigInt64(0x10, endianness)),
                offset   : Number(bin.getBigInt64(0x18, endianness)),
                size     : Number(bin.getBigInt64(0x20, endianness)),
                link     : bin.getUint32(0x28, endianness),
                info     : bin.getUint32(0x2c, endianness),
                addralign: Number(bin.getBigInt64(0x30, endianness)),
                entsize  : Number(bin.getBigInt64(0x38, endianness))
            }
        }
    }

    function parseSymbolTable(){
        if( elf.ident.class == 1 ) __parseSymbolTable32();
        if( elf.ident.class == 2 ) __parseSymbolTable64();
    }

    function __parseSymbolTable32(){
        let endianness = elf.ident.data == 1,
            symtab = section(".symtab")[0],
            strtab = section(".strtab")[0];
        if( !symtab || !strtab ){
            elf.symtab = [];
            return;
        }
        elf.symtab = new Array(symtab.size/symtab.entsize);
        for(let i = 0; i < elf.symtab.length; i++){
            let bin = new DataView(binary, symtab.offset + symtab.entsize * i, symtab.entsize);
            elf.symtab[i] = {
                name : readString(strtab.offset + bin.getUint32(0x00, endianness)),
                value: bin.getUint32(0x04, endianness),
                size : bin.getUint32(0x08, endianness),
                info : bin.getUint8(0x0c, endianness),
                other: bin.getUint8(0x0d, endianness),
                shndx: bin.getUint16(0x0e, endianness)
            }
        }
    }

    function __parseSymbolTable64(){
        let endianness = elf.ident.data == 1,
            symtab = section(".symtab")[0],
            strtab = section(".strtab")[0];
        if( !symtab || !strtab ){
            elf.symtab = [];
            return;
        }
        elf.symtab = new Array(symtab.size/symtab.entsize);
        for(let i = 0; i < elf.symtab.length; i++){
            let bin = new DataView(binary, symtab.offset + symtab.entsize * i, symtab.entsize);
            elf.symtab[i] = {
                name : readString(strtab.offset + bin.getUint32(0x00, endianness)),
                info : bin.getUint8(0x04, endianness),
                other: bin.getUint8(0x05, endianness),
                shndx: bin.getUint16(0x06, endianness),
                value: Number(bin.getBigInt64(0x08, endianness)),
                size : Number(bin.getBigInt64(0x10, endianness))
            }
        }
    }

    function readString(offset){
        let bin = new Uint8Array(binary, offset);
        return String.fromCharCode(...bin.slice(0, bin.indexOf(0)));
    }

    function section(name){
        return elf.shtable.filter(e => e.name == name);
    }

    function symbol(name){
        return elf.symtab.filter(e => e.name == name);
    }
}
