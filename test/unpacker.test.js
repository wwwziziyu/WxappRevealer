// test/unpacker.test.js
const { unpack } = require('../src/unpacker');
const path = require('path');
const fs = require('fs-extra');

describe('Unpacker Module', () => {
  const sample = path.resolve(__dirname, 'fixtures/sample.wxapkg');
  const outDir = path.join(__dirname, 'tmp_unpacked');

  beforeAll(async () => {
    await fs.remove(outDir);
  });

  afterAll(async () => {
    await fs.remove(outDir);
  });

  test('unpack creates directory and correct number of files', async () => {
    const resultDir = await unpack(sample, outDir, { verbose: false });
    expect(resultDir).toBe(path.resolve(outDir));

    const exists = await fs.pathExists(outDir);
    expect(exists).toBe(true);

    const files = await fs.readdir(outDir);
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);

    // 验证示例文件存在
    const exampleFile = path.join(outDir, 'app-service.js');
    expect(await fs.pathExists(exampleFile)).toBe(true);
  });
});
