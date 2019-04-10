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
    const lines = str.split('\n');
    return lines.map(line => line.trim());
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
    const data = this.parseLog(text);
    if (data.type === 'response') {
      this.emit('response', data.data);
    }
    else if (data.type === 'text') {
      for (let i = 0; i < data.data.length; i++) {
        this.emit('line', data.data[i]);
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
