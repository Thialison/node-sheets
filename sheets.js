const { GoogleSpreadsheet } = require('google-spreadsheet')
require('dotenv').config()

const docId = process.env.SHEET_ID
const doc = new GoogleSpreadsheet(docId)

const openSheet = async () => {
  await doc.useServiceAccountAuth(require('./credentials.json'));
  return doc
}

const populateSheet = async (sheetHeaders, data) => {
  if (!Array.isArray(sheetHeaders)) {
    throw 'header is not an Array';
  }

  if (typeof data !== 'object' || data === null) {
    throw 'data is not an Object or is null';
  }

  await openSheet()
    .then(async doc => {
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      await sheet.setHeaderRow(sheetHeaders)

      const sheetRows = await sheet.getRows();

      let idInSheet = false
      for (row of data) {
        idInSheet = false
        for (i = 0; i < sheetRows.length; i++) {
          if (sheetRows[i].id_sha == row.id_sha) {
            idInSheet = true
            break;
          }
        }
        idInSheet ? null : await sheet.addRow(row)
      }
    })
}

module.exports = {
  populateSheet,
}
