(function( challenge_id = "bitmap_flag" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        let url = tag.refs.challengeContent.querySelector("a").href,
            file = await fetch(url).then(res => res.arrayBuffer()),
            bmp1 = new Uint8Array(file),
            bmp1_data = bmp1.subarray(new DataView(file).getUint32(0x0a, true)),
            bmp2 = new Uint8Array(bmp1_data.map(b => b < 254 ? b : b - 254).join("").match(/[01]{8}/g).map(b => parseInt(b, 2))),
            bmp3 = bmp2.subarray(new DataView(bmp2.buffer).getUint32(0x0a, true)),
            bmp3_dv = new DataView(bmp3.buffer, bmp3.byteOffset),
            width = bmp3_dv.getUint32(0x12, true),
            height = bmp3_dv.getUint32(0x16, true);
        bmp3 = bmp3.subarray(0, bmp3_dv.getUint32(0x02, true));

        // convert to monochrome
        let data = bmp3.subarray(bmp3_dv.getUint32(0x0a, true));
        for(let i = 0; i < data.length; i += 4){
            data[i] = data[i+1] = data[i+2] = (data[i] + data[i+1] + data[i+2]) / 3 < 128 ? 0 : 255;
            data[i+3] = 255;
        }

        // display flag in place of original image
        let img = document.createElement("img");
        img.src = URL.createObjectURL(new Blob([bmp3.slice().buffer], {type: "image/bmp"}));
        img.onload = () => {
            let ctx = document.createElement("canvas").getContext("2d");
            ctx.canvas.width = tag.refs.challengeContent.querySelector("img").width;
            ctx.canvas.height = Math.round(img.naturalHeight * ctx.canvas.width / img.naturalWidth);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
            tag.refs.challengeContent.querySelector("img").src = ctx.canvas.toDataURL();
            tag.refs.answer.placeholder = "Enter the flag seen in the image above";
            URL.revokeObjectURL(img.src);
        }
    }
})();
