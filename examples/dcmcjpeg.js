const path = require('path');
const dcmtk = require('../')({ verbose: true });

dcmtk.dcmcjpeg(
  {
    args: [
      path.join(__dirname, '../test/data/dicom-input/first/01.dcm'),
      path.join(__dirname, '../test/data/output/01.dcm'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);
