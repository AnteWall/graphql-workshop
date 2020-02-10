import { RESTDataSource } from 'apollo-datasource-rest';

export default class StarWarsApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://swapi.co/api/';
  }

  async getFilms() {
    const response = await this.get('films/');
    return response.results;
  }

  async getPeople(id) {
    const response = await this.get(`people/${id}`);
    return response;
  }
}
