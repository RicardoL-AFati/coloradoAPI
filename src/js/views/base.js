export const elements = {
  demDropdown: document.querySelector('[name="filter"]'),
  filterForm: document.getElementById('filters'),
  filterOptions: document.getElementById('filterOptions'),
  filterBtns: [...document.querySelectorAll('button[type="button"]')],
  filterList: document.querySelector('ul.addedFilters'),
  rangeInputs: [...document.querySelectorAll('input[type="number"]')],
  statsList: document.getElementById('statsList'),
};