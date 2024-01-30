(function( challenge_id = "waveform_flag" ){

    runSolution( { challenge_id, solution } );

    async function solution( tag ){
        const SAMPLE_RATE = 44100;
        const DURATION = 11;

        let url = tag.refs.challengeContent.querySelector("a").href,
            file = await fetch(url).then(res => res.arrayBuffer()),
            oac = new OfflineAudioContext(1, SAMPLE_RATE * DURATION, SAMPLE_RATE),
            data = await oac.decodeAudioData(file),
            samples = data.getChannelData(0),
            peaks = [],
            flag = "";
        for(let i = 1; i < samples.length - 1; i++){
            if( samples[i-1] < samples[i] && samples[i] >= samples[i+1] ){
                peaks.push(i/data.sampleRate);
            }
        }
        for(let i = 0; i < 11; i++){
            let p = peaks.filter(t => (i + 0.1) < t && t < (i + 0.9));
            flag += String.fromCharCode(Math.round((p.length - 1) / p.slice(1).map((t, i) => t - p[i]).reduce((S, n) => S + n)));
        }
        console.info(flag);
        tag.refs.answer.value = flag;
        tag.submitAnswer();
    }
})();
