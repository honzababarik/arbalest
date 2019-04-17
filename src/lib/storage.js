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
    const filePath = `${process.cwd()}/tmp/${fileName}.json`;
    return {
      path: await this.createFile(filePath, content),
      name: fileName,
    };
  }

  exportConfigs(filePath, configs) {
    const content = this.getJSONContent(configs);
    return this.createFile(filePath, content);
  }

  async getJSONFromFile(filePath) {
    const content = await this.readFile(filePath);
    return content ? JSON.parse(content) : null;
  }

  importConfigs(filePath) {
    return this.getJSONFromFile(filePath);
  }

}

export default Storage;
