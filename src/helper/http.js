const axios = require('axios').default;
const json = require('../../data/data.json');

const fetchCategories = (callback) => {

  callback(json);

}
export default fetchCategories;