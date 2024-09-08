const { configDotenv } = require("dotenv");
const { params } = require("../params");
const { writeFileSync } = require("fs");
const _ = require("lodash");

async function getData({ fieldName, isLocalized = false, locale, isRichText = false, memo = {} }) {
  try {
    configDotenv();
    let url

    if(isLocalized) {
      if(!params.slug) {
        url = `https://preview.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${params?.sourceEnv}/entries?access_token=${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}&content_type=${params.type}&fields.${fieldName}[exists]=true&select=fields.superData,fields.${fieldName},sys.id&limit=1000`;
      } else {
        url = `https://preview.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${params?.sourceEnv}/entries?access_token=${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}&content_type=${params.type}&fields.${fieldName}[exists]=true&fields.${params.slugField}=${params.slug}&select=fields.superData,fields.${fieldName},sys.id`
      }
      if (locale == 'it') {
        url += '&locale=it-IT'
      }
      const response = await fetch(url);
      const parsed = await response.json();

      if (isLocalized) {
        const newField = locale == 'it' || locale == 'en' ? fieldName : fieldName..slice(0, -2)
        const nextItems = _.map(parsed.items, (item) => {
          const nextData =  _.merge({}, item.fields.superData, { [locale]: { [fieldName.slice(0,-2)]: item.fields[fieldName] } });
          item.fields = { superData: { 'en-US' : nextData } }
          return item
        })
        const nextQuery = parsed
        nextQuery.items = nextItems
        writeFileSync(`./migrations/data/destination-${locale}.json`, JSON.stringify(nextQuery, null, 4), 'utf-8');
      }
      console.log(`${parsed.total} ENTRIES WILL BE UPDATED`)
      
      if (parsed.total > 0) {
        writeFileSync('./migrations/data/export.json', JSON.stringify(parsed, null, 4), 'utf-8');
      }
      return Promise.resolve(memo);
    }
  } catch(e) {
    return Promise.reject(e);
  }
}

module.exports = {
  getData
};
