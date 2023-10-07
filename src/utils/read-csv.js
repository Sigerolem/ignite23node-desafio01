import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse';

const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/fs_read.csv`)
    .pipe(parse({
      from_line: 2
    }));
  for await (const record of parser) {
    const [title, description] = record.toString().split(';')
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
    records.push(record);
  }
  return records;
};

async function readCsv() {
  const records = await processFile();
};

readCsv()