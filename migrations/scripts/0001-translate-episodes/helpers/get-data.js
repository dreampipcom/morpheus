const { configDotenv } = require("dotenv");
const { params } = require("../params");
const { writeFileSync } = require("fs");

async function getData({ fieldName, isLocalized = true, locale }) {
  try {
    configDotenv();
    let url

    if(isLocalized) {
      if(!params.slug) {
        url = `https://preview.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${params?.sourceEnv}/entries?access_token=${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}&content_type=${params.type}&fields.${fieldName}[exists]=true&select=fields.${fieldName},sys.id&limit=1000`;
      } else {
        url = `https://preview.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${params?.sourceEnv}/entries?access_token=${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}&content_type=${params.type}&fields.${fieldName}[exists]=true&fields.${params.slugField}=${params.slug}&select=fields.${fieldName},sys.id`
      }
      if (locale == 'it') {
        url += '&locale=it-IT'
      }
      console.log({ url, fieldName })
      const response = await fetch(url);
      const parsed = await response.json();

      console.log({ response, parsed })

      console.log(`${parsed.total} ENTRIES WILL BE UPDATED`)
      
      if (parsed.total > 0) {
        writeFileSync('./migrations/data/export.json', JSON.stringify(parsed, null, 4), 'utf-8');
      }
      return Promise.resolve(parsed);
    }
  } catch(e) {
    return Promise.reject(e);
  }
}

module.exports = {
  getData
};
