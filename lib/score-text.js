function scoreText( str, MIN_WORD_LENGTH = 4 ){
	let score = 0;
	str = str.toLowerCase().replace( /[^a-z]/g, "" );
	for( let i = 0; i <= str.length - MIN_WORD_LENGTH; i++ ){
		let tree = word.tree[str[i]][str[i+1]];
		for( let j = 2; j < MIN_WORD_LENGTH && tree; j++ ){
			tree = str[i+j];
		}
		if( tree ) score++;
	}
	return score;
}

    wordtree = {};
wordlist.forEach( w => w.split( "" ).reduce( ( t, l ) => t = l in t ? t[l] : t[l] = {}, wordtree )["!"] = {} );