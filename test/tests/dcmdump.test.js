const { dcmdump } = require('../../')();
const path = require('path');

const genericFileToDump = path.join(__dirname, '../data/dicom-input/space in path/01.dcm');
const newlineFileToDump = path.join(__dirname, '../data/dicom-input/newline series desc/624.dcm');
const directoryToDump = path.join(__dirname, '../data/dicom-input/space in path');
const mixedDirectoryToDump = path.join(__dirname, '../data/dicom-input/mixed non-dicom');
const nonDicomFile = path.join(__dirname, '../data/dicom-input/mixed non-dicom/non-dicom.txt');
const corruptImage = path.join(__dirname, '../data/dicom-input/corrupt mri/1.dcm');

test('dumps a dicom file and returns parsed results', (done) => {
  dcmdump(
    {
      args: [genericFileToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      // check a few headers
      expect(output.parsed['0008,0022'].value).toBe('20150513');
      expect(output.parsed['0008,0050'].value).toBe('b72779a5-bb3e-414e-b75d-584c52e25db6');
      done();
    },
  );
});

test('handles corrupted image with --ignore-errors option', (done) => {
  dcmdump(
    {
      args: ['--ignore-errors', corruptImage],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      expect(output.parsed['0008,0050'].value).toBe('3790276999820844');
      done();
    },
  );
});

test('handles newline in header value appropriately', (done) => {
  dcmdump(
    {
      args: [newlineFileToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      expect(output.parsed['0008,103e'].value).toBe('[CXR with\nnewline]');
      done();
    },
  );
});

test('handles non-dicom file appropriately', (done) => {
  dcmdump(
    {
      args: [nonDicomFile],
    },
    (err, output) => {
      expect(err).toBeTruthy();
      expect(output).toBeFalsy();
      done();
    },
  );
});

test('dumps a directory of files and returns array of results', (done) => {
  dcmdump(
    {
      args: ['--scan-directories', directoryToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      expect(Array.isArray(output.parsed)).toBe(true);
      expect(output.parsed[0].parsed['0008,0022'].value).toBe('20150513');
      expect(output.parsed[0].parsed['0008,0050'].value).toBe('b72779a5-bb3e-414e-b75d-584c52e25db6');
      done();
    },
  );
});

test('dumps a directory of mixed files and appropriately handles errored files', (done) => {
  dcmdump(
    {
      args: ['--scan-directories', mixedDirectoryToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      expect(Array.isArray(output.parsed)).toBe(true);
      const errored = output.parsed.find(f => f.filePath.includes('non-dicom.txt'));
      const parsedFile = output.parsed.find(f => f.filePath.includes('01.dcm'));
      expect(errored).toBeTruthy();
      expect(parsedFile).toBeTruthy();
      expect(parsedFile.parsed['0008,0022'].value).toBe('20150513');
      expect(parsedFile.parsed['0008,0050'].value).toBe('b72779a5-bb3e-414e-b75d-584c52e25db6');
      expect(parsedFile.errors).toBeFalsy();
      expect(Object.keys(errored.parsed).length).toBe(0);
      expect(errored.errors.length).toBeGreaterThan(0);
      done();
    },
  );
});
