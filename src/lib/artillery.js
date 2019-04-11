import Terminal from './terminal';
import Observable from './observable';


class Artillery extends Observable {

  constructor() {
    super();
    this.terminal = new Terminal();
    this.pid = null;
    this.configPath = null;
    this.reportPath = null;
  }

  run(configPath) {
    this.configPath = configPath;
    this.reportPath = `${configPath}-report.json`;
    this.pid = this.terminal.run(
      'artillery',
      ['run', this.configPath, '-o', this.reportPath],
      this.onLog,
      this.onError,
      this.onExit,
    );
  }

  parseText(str) {
    return str.split('\n');
  }

  parseLog(text) {
    let json = {};
    const str = `${text}`.trim();
    try {
      json = JSON.parse(str);
    }
    catch (err) {
      json = {
        type: 'text',
        data: this.parseText(str),
      };
    }
    return json;
  }

  onLog = (text) => {
    const json = this.parseLog(text);
    if (json.type === 'response') {
      console.log(json)
      this.emit('response', json.data);
    }
    else if (json.type === 'text') {
      for (let i = 0; i < json.data.length; i++) {
        this.emit('line', json.data[i]);
      }
    }
  }

  onError = (err) => {
    this.emit('error', err);
  }

  onExit = (exitCode) => {
    this.emit('exit', exitCode);
    if (exitCode === 0) {
      this.emit('report', this.reportPath);
    }
    this.pid = null;
    this.configPath = null;
    this.reportPath = null;
  }

  stop() {
    this.terminal.forceQuit();
    this.pid = null;
  }

  isRunning() {
    return this.pid !== null;
  }

}

export default Artillery;
