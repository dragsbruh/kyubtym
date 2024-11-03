export function generateScramble() {
	const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
	const modifiers = ['', "'", '2'];
	const scrambleLength = 20;
	let scramble = [];
	let lastMove = null;

	for (let i = 0; i < scrambleLength; i++) {
		let move, modifier;

		do {
			move = moves[Math.floor(Math.random() * moves.length)];
		} while (move === lastMove);

		modifier = modifiers[Math.floor(Math.random() * modifiers.length)];

		scramble.push(move + modifier);

		lastMove = move;
	}

	return scramble.join(' ');
}

