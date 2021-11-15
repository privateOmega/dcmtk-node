const path = require('path');
const dcmtk = require('../')({ verbose: true });

dcmtk.storescu(
  {
    args: [
      '+sd',
      '+r',
      '-aet',
      'DCMTK',
      '-aec',
      'warmachine-2',
      'localhost',
      11112,
      path.join(__dirname, '../test/data/dicom-input/first'),
      // path.join(__dirname, 'dicom/first/notvalid'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);
