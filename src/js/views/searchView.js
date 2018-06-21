import { elements } from './base';
// UI Controller
export default class SearchView {
  // Constructor has three object with data properties (for API) and their corresponding UI values
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
    /* checked is used for checking all boxes
    filterList to update UI, store filters and construct query from filters */
    this.checked = false;
    this.filterList = {};    
  }
  // Used to get UI values from constructor objects
  getFilter(value) { return this.UIValues[value]; }
  getOptions(filter) { return this.filters[filter]; }
  getStatTitle(stat) { return this.statUITitles[stat]; }
  /* Returns the values of all label element corresponding to each checked box
  from options list beneath dropdown. Called when filter is added */
  getBoxesChecked() {
    const optionsToAdd = [];  
    [...elements.filterOptions.children].forEach((element) => {
      if (element.children[0].checked) {
        optionsToAdd.push(element.children[0].value);
      }
    });
    return optionsToAdd;
  }
  /* Gets value from year inputs, returns default values if:
     either value is - empty, out of range, or < or > the other (depending on if from or to year) 
     Called on submit or addRange click. Clears fields also */
  getYearRange() {
    let [fromYear, toYear] = [elements.rangeInputs[0].value, elements.rangeInputs[1].value];
    elements.rangeInputs.forEach(input => input.value = '');
    if (fromYear === '' || fromYear < 2004 || fromYear > 2016) fromYear = 2004;
    if (toYear === '' || toYear < 2004 || toYear > 2016) toYear = 2016;
    if (fromYear > toYear) fromYear = 2004;
    if (toYear < fromYear) toYear = 2016;
    return [fromYear, toYear];
  }
  // Generates checkboxes for each dropdown value. Called on change event for dropdown.
  makeOptions() {
    // If the dropdown has no value ('Select a value' option) - sets display to none for list and buttons
    if (!elements.demDropdown.value) {
      elements.filterOptions.classList.remove('show');
      elements.filterBtns.forEach(button => button.classList.remove('showBtn'));
      return;
    }
    /* Generating HTML for options checkboxes. filter is used for name attribute 
       Getting list of options for the corresponding filter */
    const filter = this.getFilter(elements.demDropdown.value);
    const options = this.getOptions(filter);
    // Iterating over returned array of options - reducing to HTML string and setting filterOptions to that
    elements.filterOptions.innerHTML = options.map((option) => {  
      return `
      <li>
      <input type='checkbox' name='${filter}' id='${option}' value='${option}'>
      <label for='${option}'>${option}</label>
      </li>
      `;
    }).join('');
    // Setting display to 'block' for list and buttons
    elements.filterOptions.classList.add('show');
    elements.filterBtns.forEach(button => button.classList.add('showBtn'));
  }
  // Creating query based on filters of demographics with options
  makeQuery() {
    let query = '';
    // Entries from filterList is assigned to array (to access index easily)
    const filtersAndOptions = Object.entries(this.filterList);
    // Iterating over entries of demographic and selected options
    filtersAndOptions.forEach((pair, index) => {
      // Getting data property that corresponds to demographic string
      const filter = this.getFilter(pair[0]);
      // year is constructed differently
      if (filter === 'year') {
        query += this.makeYearQuery(pair);
      /* if demographic has only one option -- 'gender = "female"'
         else -- '(gender = "Male" OR gender = "Female")' */   
      } else if (pair[1].length !== this.getOptions(filter).length) {
        if (pair[1].length === 1) {
          query += `${filter} = '${pair[1]}' `;
        } else {
          query += pair[1].reduce((string, option, index, options) => string += 
            `${filter} = '${option}'${index === options.length - 1 ? ') ' : ' OR '}`, '(');
        }
      }
      // If current pair isn't last pair -- add 'AND ' to query else - nothing
      query += (index === filtersAndOptions.length - 1) ? '' : 'AND '; 
    });
    return query;
  }
  // If only one year -- 'year = "2010"' else -- '(year between "2008" and "2013")'
   // UI states (from and to) but Socrata states 'between' so years and decremented and incremented respectively
  makeYearQuery(yearPair) {
    return (yearPair[1].length === 1) ? `year = '${yearPair[1]}'` :
      `(year between '${yearPair[1][0] - 1}' and '${yearPair[1][1] + 1}')`;
  }
  // Clears filterList and UI
  clearLists() {
    this.filterList = {};
    elements.filterList.innerHTML = '';
    elements.statsList.innerHTML = '';
  }
  // checked is set to false when searchView is created. Set to true when function is called
   // Toggled from then on
  toggleCheckBoxes() { 
    [...elements.filterOptions.children].forEach((element) => {
      element.children[0].checked = (this.checked) ? false : true;
    });
    this.checked = !this.checked;
  }
  // Called when filter is added
  unCheckBoxes() {
    [...elements.filterOptions.children]
      .forEach(element => 
      element.children[0].checked = false);
  }
  // Called for addRange click. Get values, updates filterList and UI
  addYearRange() {
    this.filterList['Year(s)'] = this.getYearRange();
    this.updateFilterList();
  }
  // Deletes year filter from filterList. Updates UI
  removeYearRange() {
    delete this.filterList['Year(s)'];
    this.updateFilterList();
  }
  // Adds filter with selected options and updates UI
  addFilter() {
    // demographic is currently selected option in dropdown
    const demographic = elements.demDropdown.value;
    // options is values of checked boxes
    const options = this.getBoxesChecked();
    this.unCheckBoxes();
    // If filterList already has demographic
    if (this.filterList.hasOwnProperty(demographic)) {
      // Iterating over options (checked boxes)
      options.forEach((option) => {
        /* If filterList (for this demographic) doesn't already
           have option -- add it */
        if (!filterUIList[demographic].includes(option)) {
          filterUIList[demographic].push(option);
        }
      });
    /* filterList does not have demographic
       add it (with options) only if at least one option was selected */
    } else if (options.length > 0) {
      this.filterList[demographic] = options;
    }
    // Update UI with new filterList
    this.updateFilterList();
  }
  /* removes a demographic option (or entire demographic with options) 
     from FilterList. Called on click event on UI filter list */
  removeFilter(e) {
    // If click was on li
    if (e.target.matches('li')) {
      // if li has filter class (is demographic not option)
      if (e.target.classList.contains('filter')) {
        // deleted demographic property from filterList
        delete this.filterList[e.target.textContent];
      } else {
        /* Each option li has data-filter property = demographic 
           finding index of that option in demographic - in filterList */
        const optionIndex = this.filterList[e.target.dataset.filter]
          .indexOf(e.target.textContent);
        // removing option element from demographic from filterList  
        this.filterList[e.target.dataset.filter].splice(optionIndex, 1);
        // If after splice - demographic has no options - remove demographic
        if (this.filterList[e.target.dataset.filter].length <= 0) {
          delete this.filterUIList[e.target.dataset.filter];
        }
      }
    }
    // Update UI with new filterList
    this.updateFilterList();
  }
  // Constructs UL with li's using filterList. Demographic li's have special styling
   // option li's have data-filter attribute to identify which demographic they are option of
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
  /* Called once averages and max data is retrieved
     Creates three li's for each dataPoint: 
     title li, average, and max */
  makeStatsList(dataPair) {
    let listHTML = '';
    if (dataPair[0].includes('avg')) {
      const title = this.getStatTitle(dataPair[0]);
      listHTML += `<li class='filter'>${title}</li>
      <li>Average: ${parseInt(dataPair[1]).toLocaleString()}</li>`;
    } else {
      listHTML += `<li>Max: ${parseInt(dataPair[1]).toLocaleString()}</li>`;
    }
    // Clearing filterList for any new searches
    this.filterList = {};
    return listHTML;
  }
}
