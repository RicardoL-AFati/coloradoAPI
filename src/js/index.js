import Search from './models/Search';
import SearchView from './views/searchView';
import { elements } from './views/base';
import { debug } from 'util';

const searchView = new SearchView();
const state = {};
let checked = false;
let filterUIList = {};
let statsList = [];
elements.demDropdown.addEventListener('change', () => searchView.makeOptions());
elements.filterForm.addEventListener('submit', makeSearch);
elements.filterBtns.forEach(btn => btn.addEventListener('click', configFilter));
elements.filterList.addEventListener('click', removeFilter);

function configFilter(e) {
  const clickedBtn = e.target.id;  
  if (clickedBtn === 'selectAll') {
    searchView.toggleCheckBoxes();
  } else if (clickedBtn === 'addFilter') {
    addFilter();
  } else if (clickedBtn === 'addRange') {
    addYearRange();
  } else if (clickedBtn === 'removeRange') {
    removeYearRange();
  }
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
}

async function runSearch(dataPoint) {
  await state[dataPoint].searchForStudents();
  statsList.push(state[dataPoint].result);
  if (statsList.length === 7) getStats();  
}
function getStats() {
  let listHTML = '';
  statsList.forEach(stat => 
    Object.entries(stat[0])
    .forEach(dataPair => listHTML+= makeStatsList(dataPair)));
  elements.statsList.innerHTML = listHTML;
}

function makeStatsList(dataPair) {
  let listHTML = '';
  if (dataPair[0].includes('avg')) {
    const title = searchView.getStatTitle(dataPair[0]);
    listHTML += `<li class='filter'>${title}</li>
    <li>Average: ${parseInt(dataPair[1]).toLocaleString()}</li>`;
  } else {
    listHTML += `<li>Max: ${parseInt(dataPair[1]).toLocaleString()}</li>`;
  }
  return listHTML;
}

