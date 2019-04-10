import hash from 'object-hash';

class Storage {

  createTempJson(json) {
    const fs = require('fs');
    const content = JSON.stringify(json, null, 2);
    const fileName = hash(content);
    const filePath = `${process.cwd()}/tmp/${fileName}.json`;
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(filePath);
        }
      });
    });
  }

}

export default Storage;
