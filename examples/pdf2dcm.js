const path = require('path');
const dcmtk = require('../')({ verbose: true });

dcmtk.pdf2dcm(
  {
    args: [
      path.join(__dirname, '../test/data/pdf-input/sample.pdf'),
      path.join(__dirname, '../test/data/output/pdf-output.dcm'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);
