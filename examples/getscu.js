const path = require('path');
const dcmtk = require('../')({ verbose: true });

const outputdir = path.join(__dirname, '../test/data/output');

dcmtk.getscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'Pacsbin',
      '-aec',
      'Horos',
      '-k',
      'AccessionNumber=21254202',
      '-k',
      'PatientName',
      '-k',
      'ModalitiesInStudy', // STUDY level only
      '-k',
      '(0020,1208)',
      '-k',
      'StudyInstanceUID=1.2.840.114350.2.331.2.798268.2.27600021.1',
      '-od',
      outputdir,
      'localhost',
      '4444',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);