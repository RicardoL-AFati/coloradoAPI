import axios from 'axios';

export default class Search {
  
  constructor(query) {
    this.query = query;
    this.endpoint = 'https://data.colorado.gov/resource/6pd5-jdur.json?';
    this.appToken = '$$app_token=qlafHdIIyB5VrY2RvdpmlJ53K';
    this.select = '&$query=SELECT ';
    this.limit = 'LIMIT 10000';
  }
  // Base search query = '&$query=SELECT avg(financialAidData), max(financialAidData) WHERE '
  async searchForStudents() {
    try {     
      const res = await axios(`${this.endpoint}${this.appToken}${this.select}${this.query}${this.limit}`);
      this.result = res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

// Fail
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic', gender WHERE gender = 'Male' OR gender = 'Female' GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic' AND gender WHERE gender = 'Male' OR gender = 'Female' GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' GROUP BY ethnicity AND gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender, ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' GROUP BY ethnicity LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender, ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic', gender GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), gender WHERE gender = 'Male' LIMIT 5000
// &$query=SELECT avg(sumstateaid), gender WHERE gender = 'Male', GROUP BY gender LIMIT 5000
// &$query=SELECT gender,avg(sumstateaid), GROUP BY gender LIMIT 5000`
// &$query=SELECT gender, avg(sumstateaid), gender GROUP BY gender LIMIT 5000

// Success
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), min(sumstateaid), max(sumstateaid) WHERE (gender = 'Female' OR gender = 'Male') AND ethnicity = 'Hispanic' AND (agedesc = '17-20' OR agedesc = '21-24') AND (year between '2006' and '2008') LIMIT 500`
  // Adding year range 

// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid) WHERE (gender = 'Female' OR gender = 'Male') AND ethnicity = 'Hispanic' AND (agedesc = '17-20' OR agedesc = '21-24') LIMIT 500
  // This returns just the average and std dev. No other properties are saved or grouped by so there is only one population those data point are being gathered for. 

// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender WHERE gender = 'Female' OR gender = 'Male' AND ethnicity = 'Hispanic' AND (agedesc = '17-20' OR agedesc = '21-24') GROUP BY gender LIMIT 500
  // Returns male and female. () seem to be required when using an or. When using any OR not just one of them or the one you aren't grouping on. 
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender WHERE gender = 'Female' OR gender = 'Male' AND ethnicity = 'Hispanic' AND agedesc = '17-20' OR agedesc = '21-24' GROUP BY gender LIMIT 500`
  // Returns all four genders 
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender WHERE gender = 'Female' OR gender = 'Male' AND ethnicity = 'Hispanic' AND agedesc = '17-20' GROUP BY gender LIMIT 500
/*  
avg_sumstateaid: "15790.926274784616"
gender: "Female"
stddev_pop_sumstateaid: "92114.93275400"

avg_sumstateaid: "15559.498147167814"
gender: "Male"
stddev_pop_sumstateaid: "50620.95762541"
*/
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' OR gender = 'Female' GROUP BY ethnicity LIMIT 50000
    // Returned all 9 ethnicities, all information except for gender 
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), ethnicity WHERE ethnicity = 'Hispanic' AND gender = 'Male' GROUP BY ethnicity LIMIT 50000
// &$query=SELECT avg(sumstateaid), stddev_pop(sumstateaid), gender GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), gender WHERE gender = 'Female' GROUP BY gender LIMIT 50000
// &$query=SELECT avg(sumstateaid), gender GROUP BY gender LIMIT 5000`
// &$query=SELECT avg(sumstateaid) LIMIT 5000`
// sumfederalpell, sumstateaid, ethnicity, gender WHERE gender = 'Female' OR gender = 'Male' AND ethnicity = 'Hispanic' AND agedesc = '17-20' LIMIT 500`);