const { movescu, storescp } = require('../../')();
const { onListenerUp } = require('./util');
const harness = require('../external-pacs-harness');
const path = require('path');
const fs = require('fs-extra');

let storeServer;
const storeServerPort = '4002';
const localOutputDir = path.join(__dirname, '../data/output');

beforeAll(async (done) => {
  await fs.ensureDir(localOutputDir);

  // start storescp server
  storeServer = storescp({
    args: ['-od', localOutputDir, '-su', 'PB', '-aet', 'TESTLISTENER', '--fork', storeServerPort],
  });
  storeServer.on('close', () => {
    // console.log(`Closed storescu server with code ${code} and signal ${signal}`);
  });
  storeServer.on('error', (err) => {
    console.log('Error on storescu server:', err);
  });

  await onListenerUp(storeServerPort);
  await harness.start();
  await fs.emptyDir(localOutputDir);
  done();
});

afterAll(async (done) => {
  await harness.stop();
  await new Promise((resolve) => {
    storeServer.on('close', resolve);
    storeServer.kill();
  });
  await fs.emptyDir(localOutputDir);
  done();
});

test('moves a series of images from pacs to local', (done) => {
  const responses = [];

  const mover = movescu({
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'TESTLISTENER',
      '--call',
      'TEST',
      '-k',
      'AccessionNumber=7777777',
      '-k',
      'PatientID',
      '-k',
      'PatientName',
      '--move',
      'TESTLISTENER',
      'localhost',
      '4141',
    ],
  });

  mover.parsed.on('response', (response) => {
    responses.push(response);
  });

  mover.on('close', async () => {
    // console.log(`Closed movescu with code ${code} and signal ${signal}`);

    expect(responses.length).toBe(4);

    expect(await fs.pathExists(path.join(
      localOutputDir,
      'PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.1563480613904460876041307875247925092',
    ))).toBe(true);
    expect(await fs.pathExists(path.join(
      localOutputDir,
      'PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.3086950219072753190511793613081870134',
    ))).toBe(true);
    expect(await fs.pathExists(path.join(
      localOutputDir,
      'PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.4391742151522474134629769548169430042',
    ))).toBe(true);
    done();
  });

  mover.on('error', (err) => {
    expect(err).toBeUndefined();
    throw new Error(`Error on movescu: ${err}`);
  });

  // mover.parsed.stderr.on('response', (response) => {
  //   console.log('RESPONSE:', response);
  // });
});
