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

  async run(test, settings, environment = null) {
    const artilleryConfig = new ConfigBuilder(test, settings, environment);
    const file = await new Storage().createTempJSON(artilleryConfig.toJSON());
    this.emit('line', `Configuration stored under: ${file.filePath}`);

    this.configPath = file.filePath;
    this.reportPath = `${file.dirPath}${file.name}-${Date.now()}-report.json`;

    const args = ['run', this.configPath, '-o', this.reportPath];

    if (!settings.request.does_verify_SSL) {
      args.push('-k');
    }
    if (!settings.request.does_log_progress) {
      args.push('-q');
    }

    this.pid = this.terminal.runNode(
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
      this.parseReport(this.reportPath);
    }
    this.pid = null;
    this.configPath = null;
    this.reportPath = null;
  }

  async parseReport(reportPath) {
    const report = await new Storage().getJSONFromFile(reportPath);
    if (report) {
      this.emit('report', report);
    }
  }

  stop() {
    this.terminal.forceQuit();
  }

  isRunning() {
    return this.pid !== null;
  }

}

export default Artillery;
