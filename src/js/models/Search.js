import axios from 'axios';

export default class Search {
  /* Each search instance has: 
  Base URL + App Token (prevents throttling) + Beginning of SoQL query string + query + Limit of returns (end of string) */
  constructor(query) {
    this.query = query;
    this.endpoint = 'https://data.colorado.gov/resource/6pd5-jdur.json?';
    this.appToken = '$$app_token=qlafHdIIyB5VrY2RvdpmlJ53K';
    this.select = '&$query=SELECT ';
    this.limit = 'LIMIT 10000';
  }
  // Fetches data and saves result to this object instance
  async searchForStudents() {
    try {
      // Uses axios HTTP client rather than fetch     
      const res = await axios(`${this.endpoint}${this.appToken}${this.select}${this.query}${this.limit}`);
      this.result = res.data;
    } catch (error) {
      console.log(error);
    }
  }
}
