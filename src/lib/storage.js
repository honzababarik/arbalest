import hash from 'object-hash';

class Storage {

  createFile(filePath, content) {
    const fs = require('fs');
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

  readFile(filePath) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, contents) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(contents);
        }
      });
    });
  }

  getJSONContent(o) {
    return JSON.stringify(o, null, 2);
  }

  async createTempJSON(o) {
    const content = this.getJSONContent(o);
    const fileName = hash(content);
    const basePath = 'tmp/';
    const filePath = `${basePath}${fileName}.json`;
    return {
      filePath: await this.createFile(filePath, content),
      dirPath: basePath,
      name: fileName,
    };
  }

  exportTests(filePath, tests) {
    const content = this.getJSONContent(tests);
    return this.createFile(filePath, content);
  }

  async getJSONFromFile(filePath) {
    const content = await this.readFile(filePath);
    return content ? JSON.parse(content) : null;
  }

  importTests(filePath) {
    return this.getJSONFromFile(filePath);
  }

}

export default Storage;
