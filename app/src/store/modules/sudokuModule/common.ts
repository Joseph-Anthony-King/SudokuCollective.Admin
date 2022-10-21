export class Methods {
	static InitializeMatix(): Array<Array<string>> {
		const matrix = Array<Array<string>>(9);
		for (let i = 0; i < 9; i++) {
			matrix[i] = [];
			for (let j = 0; j < 9; j++) {
				matrix[i][j] = "";
			}
		}
		return matrix;
	}
}
