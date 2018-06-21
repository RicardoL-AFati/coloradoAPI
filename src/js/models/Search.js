import axios from 'axios';

export default class Search {
  
  constructor(query) {
    this.query = query;
    this.endpoint = 'https://data.colorado.gov/resource/6pd5-jdur.json?';
    this.appToken = '$$app_token=qlafHdIIyB5VrY2RvdpmlJ53K';
    this.select = '&$query=SELECT ';
    this.limit = 'LIMIT 10000';
  }
  
  async searchForStudents() {
    try {     
      const res = await axios(`${this.endpoint}${this.appToken}${this.select}${this.query}${this.limit}`);
      this.result = res.data;
    } catch (error) {
      console.log(error);
    }
  }
}
