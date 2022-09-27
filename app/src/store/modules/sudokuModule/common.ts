export class Methods {
	static InitializeMatix(): Array<Array<number>> {
		const matrix = Array<Array<number>>(9);
		for (let i = 0; i < 9; i++) {
			matrix[i] = [];
			for (let j = 0; j < 9; j++) {
				matrix[i][j] = 0;
			}
		}
		return matrix;
	}
}