import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
import { debug } from 'util';

const state = {};
let checked = false;
let filterUIList = {};
elements.demDropdown.addEventListener('change', showConfig);
elements.filterForm.addEventListener('submit', makeSearch);
elements.filterBtns.forEach(btn => btn.addEventListener('click', configFilter));
elements.filterList.addEventListener('click', removeFilter);

function showConfig(e) {
  if (!this.value) {
    elements.filterOptions.classList.remove('show');
    elements.filterBtns.forEach(button => button.classList.remove('showBtn'));
    return;
  }
  const filter = searchView.getFilter(this.value);
  const options = searchView.getOptions(filter);
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

function configFilter(e) {
  const clickedBtn = e.target.id;  
  if (clickedBtn === 'selectAll') {
    toggleCheckBoxes();
  } else if (clickedBtn === 'addFilter') {
    addFilter();
  } else if (clickedBtn === 'addRange') {
    addYearRange();
  } else if (clickedBtn === 'removeRange') {
    removeYearRange();
  }
}

function toggleCheckBoxes() { 
  [...elements.filterOptions.children].forEach((element) => {
    element.children[0].checked = (checked) ? false : true;
  });
  checked = !checked;
} 

function unCheckBoxes() {
  [...elements.filterOptions.children]
    .forEach(element => element.children[0].checked = false);
}

function getBoxesChecked() {
  const optionsToAdd = [];  
  [...elements.filterOptions.children].forEach((element) => {
    if (element.children[0].checked) {
      optionsToAdd.push(element.children[0].value);
    }
  });
  return optionsToAdd;
}

function getYearRange() {
  let [fromYear, toYear] = [elements.rangeInputs[0].value, elements.rangeInputs[1].value];
  elements.rangeInputs.forEach(input => input.value = '');
  if (fromYear === '' || fromYear < 2004 || fromYear > 2016) fromYear = 2004;
  if (toYear === '' || toYear < 2004 || toYear > 2016) toYear = 2016;
  if (fromYear > toYear) fromYear = 2004;
  if (toYear < fromYear) toYear = 2016;
  return [fromYear, toYear];
}
function addFilter() {
  const demographic = elements.demDropdown.value;
  const options = getBoxesChecked();
  if (filterUIList.hasOwnProperty(demographic)) {
    options.forEach((option) => {
      if (!filterUIList[demographic].includes(option)) {
        filterUIList[demographic].push(option);
      }
    });
  } else if (options.length > 0) {
    filterUIList[demographic] = options;
  }
  updateList();
}

function addYearRange() {
  filterUIList['Year(s)'] = getYearRange();
  updateList();
}

function removeFilter(e) {
  if (e.target.matches('li')) {
    if (e.target.classList.contains('filter')) {
      delete filterUIList[e.target.textContent];
    } else {
      const optionIndex = filterUIList[e.target.dataset.filter]
        .indexOf(e.target.textContent);
      filterUIList[e.target.dataset.filter].splice(optionIndex, 1);
      if (filterUIList[e.target.dataset.filter].length <= 0) {
        delete filterUIList[e.target.dataset.filter];
      }
    }
  }
  updateList();
}

function removeYearRange() {
  delete filterUIList['Year(s)'];
  updateList();
}
function updateList() {
  elements.filterList.innerHTML = '';
  elements.filterList.innerHTML += '<p>Click to Remove</p>';
  Object.entries(filterUIList).forEach(demographic => {
    elements.filterList.innerHTML += `
      <li class='filter'>${demographic[0]}</li>`;
    if (demographic[1].length > 0) {
      if (demographic[1].length > 1) {
        elements.filterList.innerHTML += demographic[1]
          .map(option => `<li class='option' data-filter='${demographic[0]}'>${option}</li>`).join('');   
      } else {
        elements.filterList.innerHTML += demographic[1] = 
        `<li class='option' data-filter='${demographic[0]}'>${demographic[1]}</li>`;    
      }    
    }  
  });
}

function makeQuery() {
  let query = '';
  const filtersAndOptions = Object.entries(filterUIList);
  filtersAndOptions.forEach((pair, index) => {
    const filter = searchView.getFilter(pair[0]);
    if (filter === 'year') {
      query += makeYearQuery(pair);
    } else if (pair[1].length !== searchView.getOptions(filter).length) {
      if (pair[1].length === 1) {
        query += `${filter} = '${pair[1]}' `;
      } else {
        query += pair[1].reduce((string, option, index, options) => string += 
          `${filter} = '${option}'${index === options.length - 1 ? ') ' : ' OR '}`, '(');
      }
      query += (index === filtersAndOptions.length - 1) ? '' : 'AND '; 
    } 
  });
  return query;
}

function makeYearQuery(yearPair) {
  return (yearPair[1].length === 1) ? `year = ${yearPair[1]}` :
    `(year between '${yearPair[1][0]--}' and '${yearPair[1][1]++}')`;
}

// Base search query = '&$query=SELECT avg(financialAidData), max(financialAidData) WHERE -query- LIMIT 10000*/
function makeSearch(e) {   
  e.preventDefault();
  const dataPoints = ['sumstateaid', 'sumfederalpell', 'sumfederalloans', 'sumotherfederal', 'sumfederalplus', 'sumotherloans', 'sumotherscholarships'];
  const filterQuery = makeQuery();
  dataPoints.forEach(dataPoint => {
    let fullQuery = `avg(${dataPoint}), max(${dataPoint}) `
    if (filterQuery) {
      fullQuery += `WHERE ${filterQuery} `;  
    }
    state[dataPoint] = new Search(fullQuery);
    runSearch(dataPoint);
  });
  // runSearch();
}

async function runSearch(dataPoint) {
  await state[dataPoint].searchForStudents();
  show(state[dataPoint].result);
  // await Object.entries(state)
  //   .forEach(search => search[1].searchForStudents());
  // showStats();   
}
const resultss = [];
function show(result) {
  resultss.push(result);
  console.log(resultss);
}
// function showStats() {
//   console.log(state);
//   console.log(Object.keys(state.sumstateaid));
//   // const html = Object.entries(state).reduce((listHTML, dataPoint) => {
//   //   const title = searchView.getStatTitle(dataPoint[0]);
//   //   listHTML += `<li class = 'filter'>${title}</li>
//   //   <li>Average: ${dataPoint[1][result][0][0]}</li>`;
//   // },'');
//   // elements.statsList.innerHTML = html; 
// }
  // await state[dataPoint].searchForStudents();
  // console.log(state);
  // if (filterQuery) {
    
  //   const fullQuery = `WHERE ${filterQuery}`
  // }
  // console.log(query);
  // if (query) {
  //   state.search = new Search(query);
  //   await state.search.searchForStudents();
  //   console.log(state.search.result);
  // }

/** Global State of the app
 * - Search object
 * - Current statistics
 * - Saved statistics
 */


