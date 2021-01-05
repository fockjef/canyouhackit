(function( challenge_id = "tiles" ){

	const MOVES = [ "UU", "UL", "UR", "DD", "DL", "DR", "LU", "LD", "LL", "RU", "RD", "RR" ],
	      INC_ROW = { "U": -1, "D": 1, "L":  0, "R": 0 },
	      INC_COL = { "U":  0, "D": 0, "L": -1, "R": 1 };

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let board = tag.challenge.game_board.map( row => row.slice() ),
		    numRows = board.length,
		    numCols = board[0].length,
		    moves = "";

		// Align all but the last 2 rows
		for( let row = 0; row < numRows - 2; row++ ){
			for( let col = 0; col < numCols - 2; col++ ){
				moves += doMoves( board, alignTile( board, col + row * numCols ) );
				board[row][col] = "#";
			}
			let endTile = (row + 1 ) * numCols - 1;
			moves += doMoves( board, alignTile( board, endTile, endTile + numCols * 2 ) );		// ensure last tile of row is out of the way
			moves += doMoves( board, alignTile( board, endTile - 1, endTile ) + "D" );			// move penultimate tile of row to the end of the row
			moves += doMoves( board, alignTile( board, endTile, endTile + numCols ) );			// move last tile directly below its target location
			if(  findTile( board, "X" ).row === row + 2 ) moves += doMoves( board, "LU" );		// rotate final 2 tiles of the row into position
			moves += doMoves( board, "URD" );
			board[row][numCols-2] = board[row][numCols-1] = "#";
		}

		// Align all but the last 2 columns
		for( let col = 0; col < numCols - 2; col++ ){
			let endTile = col + ( numRows - 1 ) * numCols;
			moves += doMoves( board, alignTile( board, endTile, endTile + 2 ) );				// ensure last tile of column is out of the way
			moves += doMoves( board, alignTile( board, endTile - numCols, endTile ) + "R" );	// move penultimate tile of column to the end of the column
			moves += doMoves( board, alignTile( board, endTile, endTile + 1 ) );				// move last tile directly to the right of its target location
			if(  findTile( board, "X" ) .col === col + 2 ) moves += doMoves( board, "UL" );		// rotate final 2 tiles of the column into position
			moves += doMoves( board, "LDR" );
			board[numRows-2][col] = board[numRows-1][col] = "#";
		}

		// Align final 2x2 grid
		let endTile = findTile( board, numRows * numCols - 1 );
		if( endTile.row === numRows - 1 ){
			moves += "R";
		}
		else{
			moves += "URD";
			if( endTile.col === numCols - 1 ){
				moves += "LURD";
			}
		}

		console.info( `${moves.length} moves` );
		moves = moves.split( "" ).join( "," );
		console.info( moves );
		Tiles_submit( moves );
	}

	function doMoves( board, moves ){
		let tileX = findTile( board, "X" ),
		    validMoves = "";
		for( let i = 0; i < moves.length; i++ ){
			let newR = tileX.row + INC_ROW[moves[i]],
				newC = tileX.col + INC_COL[moves[i]];
			if( newR >= 0 && newR < board.length && newC >= 0 && newC < board[0].length ){
				board[tileX.row][tileX.col] = board[newR][newC];
				board[newR][newC] = "X";
				tileX.row = newR;
				tileX.col = newC;
				validMoves += moves[i];
			}
		}
		return validMoves.replace( /UD|DU|LR|RL/g , "" );
	}

	function alignTile( board, tile, goal ){
		if( goal === undefined ) goal = tile;
		goal = {
			row: ( goal ) / board[0].length >>> 0,
			col: ( goal ) % board[0].length
		};
		tile = findTile( board, tile + 1 );
		if( tile.row === goal.row && tile.col === goal.col ) return "";
		let tileX = findTile( board, "X" ),
		    stack = [ {
		    	moves: "",
		    	dist: calcDist( board, tile, goal, tileX ),
		    	board, tile, goal, tileX
		    } ];
		let MAX_STACK_LOOP = 50;	// make sure we don't get stuck in a loop if something is wrong
		while( stack.length && MAX_STACK_LOOP-- ){
			let newStack = [],
			    minDist = stack[0].dist;
			for( let i = 0; i < stack.length; i++ ){
				for( let j = 0; j < MOVES.length; j++ ){
					let result = evalMoves( stack[i], MOVES[j] );
					if( result.dist === 0 ){
						return result.moves;
					}
					else if( result.dist < minDist ){
						minDist = result.dist;
						newStack = [ result ];
					}
					else if( result.dist === minDist ){
						newStack.push( result );
					}
				}
			}
			stack = newStack;
		}
		throw new Error( "Failed to align tile" );
	}

	function findTile( board, tile ){
		let row = board.findIndex( row => row.includes( tile ) ),
		    col = board[row].findIndex( col => col === tile );
		return { row, col };
	}

	function evalMoves( state, moves ){
		if( state.moves.length && "UDLR"["DURL".indexOf( state.moves.slice( -1 ) )] === moves[0] ) return { dist: Infinity };
		let { board, tile, goal, tileX } = state,
		    rowT = tile.row,
		    colT = tile.col,
		    rowX = tileX.row,
		    colX = tileX.col;
		for( let i = 0; i < moves.length; i++ ){
			rowX += INC_ROW[moves[i]];
			colX += INC_COL[moves[i]];
			if( rowX < 0 || rowX >= board.length || colX < 0 || colX >= board[0].length || board[rowX][colX] === "#" ){
				// invalid move
				return { moves: moves, dist: Infinity };
			}
			if( rowX === rowT && colX === colT ){
				rowT -= INC_ROW[moves[i]];
				colT -= INC_COL[moves[i]];
				if( rowT === goal.row && colT === goal.col ) return { moves: state.moves + moves.slice( 0, i + 1 ), dist: 0 };
			}
		}
		return {
			moves: state.moves + moves,
			dist: calcDist( board, tile, goal, tileX ),
			tile: { row: rowT, col: colT },
			tileX: { row: rowX, col: colX },
			board, goal
		};
	}

	function calcDist( board, tile, goal, tileX ){
		let distBase = board.length + board[0].length - 1;
		return ( Math.abs( tile.row - goal.row ) + Math.abs( tile.col - goal.col ) ) * distBase + ( Math.abs( tile.row - tileX.row ) + Math.abs( tile.col - tileX.col ) );
	}
})();
