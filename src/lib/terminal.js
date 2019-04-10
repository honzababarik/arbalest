class Terminal {

  constructor() {
    this.pid = null;
    this.subprocess = null;
  }

  log(message, ...args) {
    console.info(`[TERMINAL] ${message}`, ...args);
  }

  logError(message, ...args) {
    console.error(`[TERMINAL] ${message}`, ...args);
  }

  forceQuit() {
    if (this.subprocess) {
      this.subprocess.kill('SIGINT');
    }
    this.pid = null;
    this.subprocess = null;
  }

  run(command, args, onOut, onErr, onExit) {
    if (this.pid) {
      if (onErr) {
        onErr('Command already running!');
      }
      return null;
    }

    const { spawn } = require('child_process');

    this.subprocess = spawn(command, args);
    this.pid = this.subprocess.pid;

    this.log(`Running ${command}, PID: ${this.pid}`);
    this.subprocess.stdout.on('data', onOut);
    this.subprocess.stderr.on('data', onErr);

    this.subprocess.on('error', (err) => {
      this.pid = null;
      this.subprocess = null;
      this.logError(err);
      onErr(err);
    });

    this.subprocess.on('close', (code) => {
      this.pid = null;
      this.subprocess = null;
      onExit(code);
    });

    return this.pid;
  }

}

export default Terminal;
