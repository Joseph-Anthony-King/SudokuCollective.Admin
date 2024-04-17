export class Endpoints {
  static createEndpoint = `${process.env.VITE_APP_API_URL}api/v1/games/createannonymous?DifficultyLevel=`;
  static checkEndpoint = `${process.env.VITE_APP_API_URL}api/v1/games/checkannonymous`;
}
