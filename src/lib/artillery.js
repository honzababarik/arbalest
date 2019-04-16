import Terminal from './terminal';
import Observable from './observable';
import ConfigBuilder from './builder';
import Storage from './storage';

class Artillery extends Observable {

  constructor() {
    super();
    this.terminal = new Terminal();
    this.pid = null;
    this.configPath = null;
    this.reportPath = null;
  }

  async run(config, settings, environment = null) {
    const artilleryConfig = new ConfigBuilder(config, settings, environment);
    const configPath = await new Storage().createTempJSON(artilleryConfig.toJSON());
    this.emit('line', `Configuration stored under: ${configPath}`);

    this.configPath = configPath;
    this.reportPath = `${configPath}-report.json`;

    const args = ['run', this.configPath, '-o', this.reportPath];

    if (!settings.request.does_verify_SSL) {
      args.push('-k');
    }
    if (!settings.request.does_log_progress) {
      args.push('-q');
    }

    this.pid = this.terminal.run(
      'artillery',
      args,
      this.onStart,
      this.onLog,
      this.onError,
      this.onExit,
    );
  }

  getLines(text) {
    return `${text}`.trim().split('\n');
  }

  parseText(str) {
    return str.split('\n');
  }

  parseLine(text) {
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
    const lines = this.getLines(text);
    for (let i = 0; i < lines.length; i++) {
      const json = this.parseLine(lines[i]);
      if (json.type === 'response') {
        this.emit('response', json.data);
      }
      else if (json.type === 'text') {
        for (let i = 0; i < json.data.length; i++) {
          this.emit('line', json.data[i]);
        }
      }
    }
  }

  onStart = (pid) => {
    this.emit('run', pid);
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
  }

  isRunning() {
    return this.pid !== null;
  }

}

export default Artillery;
