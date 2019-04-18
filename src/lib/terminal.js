import fixPath from 'fix-path';
import { remote } from 'electron';

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

  getPackageExecPath(command) {
    let path = '';
    if (process.env.NODE_ENV === 'production') {
      path = remote.app.getAppPath().replace('app.asar', 'app.asar.unpacked');
    }
    else {
      path = process.cwd();
    }
    return `${path}/node_modules/${command}/bin/${command}`;
  }

  runNode(packageName, args, onStart, onOut, onErr, onExit) {
    args.unshift(this.getPackageExecPath(packageName));
    return this.run('node', args, onStart, onOut, onErr, onExit);
  }

  run(command, args, onStart, onOut, onErr, onExit) {
    fixPath();
    if (this.pid) {
      if (onErr) {
        onErr('Command already running!');
      }
      return null;
    }

    const { spawn } = require('child_process');

    this.subprocess = spawn(command, args);
    this.pid = this.subprocess.pid;

    onStart(this.pid);

    this.log(`Running ${command}, PID: ${this.pid}, args: ${args.join(' ')}`);
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
