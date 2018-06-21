import { elements } from './base';


export const filters = {
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

const UIValues = {
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

const statUITitles = {
  sumstateaid: 'Sum of State Aid',
  sumfederalpell: 'Sum of Federal Pell Grants',
  sumfederalloans: 'Sum of Federal Loans',
  sumotherfederal: 'Sum of Other Federal Loans',
  sumfederalplus: 'Sum of Federal Plus Loans', 
  sumotherloans: 'Sum of Other Loans',
  sumotherscholarships: 'Sum of Other Scholarships',
}

export const getFilter = value => UIValues[value];
export const getOptions = filter => filters[filter];
export const getStatTitle = stat => statUITitles[stat];
// export const get