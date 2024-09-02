const { flatResults } = require("./helpers/compress-field-values");
const { extractField } = require("./helpers/extract-field");
const { extractRichField } = require("./helpers/extract-rich-field");
const { getData } = require("./helpers/get-data");
const { params } = require("./params");


const prepareToTranslate = ({ isRichText, fieldName, locale }) => {
  if (isRichText) {
    extractRichField({ fieldName, locale });
    flatResults();
  } else {
    extractField({ fieldName, locale });
  }
}

module.exports = {
  prepareToTranslate
}
