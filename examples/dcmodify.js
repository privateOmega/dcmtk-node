const path = require('path');
const dcmtk = require('../')({ verbose: true });

dcmtk.dcmodify(
  {
    args: [
      path.join(__dirname, '../test/data/output/pdf-output.dcm'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
  },
);
