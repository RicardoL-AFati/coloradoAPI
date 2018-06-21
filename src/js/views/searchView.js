import { elements } from './base';

export default class SearchView {
  constructor() {
    this.filters = {
      agedesc: ['Under 17', '17-20', '21-24', '25-40', 'Over 40', 'Unknown'],
      enrollmentclassification: ['Full-time', 'Half-time', 'Less-than-half-time'],
      ethnicity: ['White, non-Hispanic', 'Hispanic', 'Black or African American, non-Hispanic', 'Asian or Pacific Islander', 'Native American or Alaskan Native', 'More than one race/ethnicity (non-hispanic)', 'Non-Resident Alien', 'Hawaiian or Pacific Islander', 'Unknown'],
      gender: ['Female', 'Male', 'No Gender Data', 'Unknown'],
      institutionlevel: ['University', 'College'],
      institutionname: ["Adams State University", "Aims Community College", "Arapahoe Community College", "Colorado Mesa University", "Colorado School of Mines", "Colorado State University", "Colorado State University - Pueblo", "Community College of Aurora", "Fort Lewis College", "Front Range Community College", "Metropolitan State University of Denver", "Pikes Peak Community College", "Pueblo Community College", "Red Rocks Community College", "Trinidad State Junior College", "University of Colorado Boulder", "University of Colorado Colorado Springs", "University of Colorado Denver"],
      residency: ['In-State', 'Out-Of-State', 'Unclassified', 'Other'],
      studentlevel: ['Undergraduate', 'Graduate'],
      year: ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
    };
    this.UIValues = {
      'Age Range': 'agedesc',
      'Enrollment Status': 'enrollmentclassification',
      Ethnicity: 'ethnicity',
      Gender: 'gender',
      'Institution Type': 'institutionlevel',
      'Institution Name': 'institutionname',
      Residency: 'residency',
      'Student Level': 'studentlevel',
      'Year(s)': 'year',
    };
    this.statUITitles = {
      avg_sumstateaid: 'Sum of State Aid',
      avg_sumfederalpell: 'Sum of Federal Pell Grants',
      avg_sumfederalloans: 'Sum of Federal Loans',
      avg_sumotherfederal: 'Sum of Other Federal Loans',
      avg_sumfederalplus: 'Sum of Federal Plus Loans', 
      avg_sumotherloans: 'Sum of Other Loans',
      avg_sumotherscholarships: 'Sum of Other Scholarships',
    };
    this.checked = false;
    this.filterList = {};    
  }
  getFilter(value) { return this.UIValues[value]; }
  getOptions(filter) { return this.filters[filter]; }
  getStatTitle(stat) { return this.statUITitles[stat]; }

  getBoxesChecked() {
    const optionsToAdd = [];  
    [...elements.filterOptions.children].forEach((element) => {
      if (element.children[0].checked) {
        optionsToAdd.push(element.children[0].value);
      }
    });
    return optionsToAdd;
  }
  
  getYearRange() {
    let [fromYear, toYear] = [elements.rangeInputs[0].value, elements.rangeInputs[1].value];
    elements.rangeInputs.forEach(input => input.value = '');
    if (fromYear === '' || fromYear < 2004 || fromYear > 2016) fromYear = 2004;
    if (toYear === '' || toYear < 2004 || toYear > 2016) toYear = 2016;
    if (fromYear > toYear) fromYear = 2004;
    if (toYear < fromYear) toYear = 2016;
    return [fromYear, toYear];
  }
  makeOptions() {
    if (!elements.demDropdown.value) {
      elements.filterOptions.classList.remove('show');
      elements.filterBtns.forEach(button => button.classList.remove('showBtn'));
      return;
    }
    const filter = this.getFilter(elements.demDropdown.value);
    const options = this.getOptions(filter);
    elements.filterOptions.innerHTML = options.map((option) => {  
      return `
      <li>
      <input type='checkbox' name='${filter}' id='${option}' value='${option}'>
      <label for='${option}'>${option}</label>
      </li>
      `;
    }).join('');
    elements.filterOptions.classList.add('show');
    elements.filterBtns.forEach(button => button.classList.add('showBtn'));
  }
  toggleCheckBoxes() { 
    [...elements.filterOptions.children].forEach((element) => {
      element.children[0].checked = (this.checked) ? false : true;
    });
    this.checked = !this.checked;
  }
  unCheckBoxes() {
    [...elements.filterOptions.children]
      .forEach(element => element.children[0].checked = false);
  }
  addFilter() {
    const demographic = elements.demDropdown.value;
    const options = this.getBoxesChecked();
    if (filterUIList.hasOwnProperty(demographic)) {
      options.forEach((option) => {
        if (!filterUIList[demographic].includes(option)) {
          filterUIList[demographic].push(option);
        }
      });
    } else if (options.length > 0) {
      filterUIList[demographic] = options;
    }
    this.updateFilterList();
  }

  addYearRange() {
    this.filterList['Year(s)'] = this.getYearRange();
    this.updateFilterList();
  }

  updateFilterList() {
    elements.filterList.innerHTML = '';
    elements.filterList.innerHTML += '<p>Click to Remove</p>';
    Object.entries(this.filterList).forEach((demographic) => {
      elements.filterList.innerHTML += `
        <li class='filter'>${demographic[0]}</li>`;
      if (demographic[1].length > 0) {
        if (demographic[1].length > 1) {
          elements.filterList.innerHTML += demographic[1]
            .map(option => `<li class='option' data-filter='${demographic[0]}'>${option}</li>`).join('');   
        } else {
          elements.filterList.innerHTML +=
          `<li class='option' data-filter='${demographic[0]}'>${demographic[1]}</li>`;    
        }    
      }  
    });
  }
}
