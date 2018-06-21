// Importing Search Model, search view, and UI dom element selectors
import Search from './models/Search';
import SearchView from './views/searchView';
import { elements } from './views/base';
// Creating an instance of searchView and declaring variables
const searchView = new SearchView();
const state = {};
let statsList = [];
// Adding event listeners and retrieving from filters and data from local storage (if present)
function init() {
  elements.demDropdown.addEventListener('change', () => searchView.makeOptions());
  elements.filterForm.addEventListener('submit', makeSearch);
  elements.filterBtns.forEach(btn => btn.addEventListener('click', configFilter));
  elements.filterList.addEventListener('click', (e) => searchView.removeFilter(e));
  elements.saveLocal.addEventListener('click', saveToLocal);
  elements.removeLocal.addEventListener('click', () => localStorage.clear());
  elements.clearPastSearch.addEventListener('click', clearPastSearch);
  elements.filterList.innerHTML = localStorage.getItem('filters') || '';
  elements.statsList.innerHTML = localStorage.getItem('stats') || '';
}
// Creates two properties on localStorage and set to html of lists
function saveToLocal() {
  localStorage.setItem('filters', elements.filterList.innerHTML);
  localStorage.setItem('stats', elements.statsList.innerHTML);
}
// Empties statistics and calls searchView to clear UI
function clearPastSearch() {
  statsList = [];
  searchView.clearLists();
}
// Calls different searchView function based on button clicked on form
function configFilter(e) {
  if (e.target.id === 'selectAll') {
    searchView.toggleCheckBoxes();
  } else if (e.target.id === 'addFilter') {
    // Adds to filterList if not already present, and render list on UI
    searchView.addFilter();
  // Year is added or removed from filter list, UI is re-rendered  
  } else if (e.target.id === 'addRange') {
    searchView.addYearRange();
  } else if (e.target.id === 'removeRange') {
    searchView.removeYearRange();
  }
}
// Queries the Socrata API - using generated query string from filters - for each of the data points
function makeSearch(e) { 
  e.preventDefault();
  const dataPoints = ['sumstateaid', 'sumfederalpell', 'sumfederalloans', 'sumotherfederal', 'sumfederalplus', 'sumotherloans', 'sumotherscholarships'];
  const filterQuery = searchView.makeQuery();
  // Different API query for each dataPoint. Retrieves average and max value for the filtered population (if there are filters)
  dataPoints.forEach((dataPoint) => {
    let fullQuery = `avg(${dataPoint}), max(${dataPoint}) `
    if (filterQuery) {
      fullQuery += `WHERE ${filterQuery} `;  
    }
    // Creates a new Search instance on the state. With property name = dataPoint
    state[dataPoint] = new Search(fullQuery);
    // Calling async function to run search
    runSearch(dataPoint);
  });
}
// Waits for API call then pushes onto statsList 
async function runSearch(dataPoint) {
  // Fetching for data using newly created Search instace
  await state[dataPoint].searchForStudents();
  // Average and max data are stored on Search instance [result] - pushed onto statsList
  statsList.push(state[dataPoint].result);
  // If statsList has 7 Search instances - all data has been gathered
  if (statsList.length === 7) getStats();  
}
// Generating HTML for average and max of each dataPoint 
function getStats() {
  let listHTML = '';
  // Data pair is stored as obj. Each obj has two key value pairs - avg: num, max: num
  statsList.forEach(stat => 
    Object.entries(stat[0])
    .forEach(dataPair => listHTML += searchView.makeStatsList(dataPair)));
  elements.statsList.innerHTML = listHTML;
}
// Initialization function - on page load
init();
