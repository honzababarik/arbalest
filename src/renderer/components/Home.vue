<template>
  <div id="wrapper">
    <main>
      <div class="navbar">
        <button @click="onClickClear" v-if="isRunning">Clear</button>
        <button class="btn-danger" @click="onClickStop" v-if="isRunning">Stop</button>
        <button class="btn-success" @click="onClickRun">Run</button>

      </div>
      <div class="content">
        <div class="panel panel-terminal">
          <div class="panel-header">Terminal</div>
          <div class="panel-body">
            <div v-for="(log, i) in logs" :key="i" :class="log.css">{{getDisplayLog(log)}}</div>
          </div>
        </div>
        <div class="panel panel-responses">
          <div class="panel-header">Responses</div>
          <div class="panel-body">
            <ResponseListItem v-for="(response, i) in responses" :key="i" :response="response"></ResponseListItem>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

  import router from '@/router/';
  import ResponseListItem from './ResponseListItem'

  class FileStorage {

    createTempYaml(content, callback) {
      const fs = require('fs');
      const fileName = Math.floor(Math.random() * 100000);
      const filePath = `/tmp/${fileName}.yaml`
      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, function(err) {
            if (err) {
              reject(err)
            }
            else {
              resolve(filePath)
            }
        })
      })
    }

  }

  class YamlBuilder {

    constructor() {
      this.lines = []
    }

    add(line) {
      this.lines.push(line)
    }

    toFileContent() {
      return this.lines.join('\n')
    }

  }

  class Observable {

    constructor() {
      this.listeners = {}
    }

    removeAllListeners() {
      this.listeners = {}
    }

    getListenerIndex(eventName, fn) {
      if (!this.listeners[eventName]) {
        return -1
      }
      for (let i = 0; i < this.listeners[eventName].length; i++) {
        if (this.listeners[eventName][i] === fn) {
          return i
        }
      }
      return -1
    }

    removeListener(eventName, fn) {
      const index = this.getListenerIndex(eventName, fn)
      if (index !== -1) {
        this.listeners.splice(index, 1)
      }
    }

    on(eventName, fn) {
      const index = this.getListenerIndex(eventName, fn)
      if (index === -1) {
        this.addEventListener(eventName, fn)
      }
      return this
    }

    addEventListener(eventName, fn) {
      if (!fn) {
        return console.error(`Cannot add listener to ${eventName}, function is nil.`)
      }

      if (!this.listeners[eventName]) {
        this.listeners[eventName] = []
      }
      this.listeners[eventName].push(fn)
    }

    emit(eventName, data) {
      if (this.listeners[eventName]) {
        for (let i = 0; i < this.listeners[eventName].length; i++) {
          this.listeners[eventName][i](data)
        }
      }
    }

  }

  class Artillery extends Observable {

    // TODO this should run the terminal for file
    // TODO should store and restore configurations
    constructor() {
      super()
      this.terminal = new Terminal()
      this.pid = null
    }

    run(filePath) {
      this.pid = this.terminal.run('artillery', ['run', `${process.cwd()}/${filePath}`], this.onLog, this.onError, this.onExit)
    }

    parseLog(text) {
      let json = {}
      let str = `${text}`.trim()
      try {
        let data = JSON.parse(str)
        json = data
      }
      catch (err) {
        json = {
          type: 'text',
          data: str.split('\n')
        }
      }
      console.log(json)
      return json
    }

    onLog = (text) => {
      let data = this.parseLog(text)
      if (data.type === 'response') {
        this.emit('response', data.data)
      }
    }

    onError = (err) => {
      this.emit('error', data)
    }

    onExit = (exitCode) => {
      this.pid = null
      this.emit('exit', exitCode)
    }

    stop() {
      this.terminal.forceQuit()
      this.pid = null
    }

    isRunning() {
      return this.pid !== null
    }

  }

  class Terminal {

    constructor() {
      this.pid = null
      this.subprocess = null
    }

    log(message, ...args) {
      console.info(`[TERMINAL] ${message}`, ...args)
    }

    logError(message, ...args) {
      console.error(`[TERMINAL] ${message}`, ...args)
    }

    forceQuit() {
      if (this.subprocess) {
        this.subprocess.kill('SIGINT')
      }
      this.pid = null
      this.subprocess = null
    }

    run(command, args, onOut, onErr, onExit) {
      if (this.pid) {
        if (onErr) {
          onErr('Command already running!')
        }
        return null
      }

      const { spawn } = require('child_process')

      this.subprocess = spawn(command, args)
      this.pid = this.subprocess.pid

      this.log(`Running ${command}, PID: ${this.pid}`)
      this.subprocess.stdout.on('data', onOut)
      this.subprocess.stderr.on('data', onErr)

      this.subprocess.on('error', (err) => {
        this.pid = null
        this.subprocess = null
        this.logError(err)
        onErr(err)
      })

      this.subprocess.on('close', (code) => {
        this.pid = null
        this.subprocess = null
        onExit(code)
      })

      return this.pid
    }

  }

  export default {
    name: 'home',
    components: {
      ResponseListItem
    },
    data() {
      return {
        responses: [],
        logs: [],
        report: {},
        artillery: null
      };
    },
    methods: {
      onClickClear() {
        this.clear()
      },
      clear() {
        console.clear()
        this.responses = []
        this.logs = []
        this.report = {}
      },
      onClickStop() {
        this.artillery.stop()
      },
      onResponse(response) {
        this.responses.push(response)
      },
      onError(data) {
        this.addLogLine(`Err: ${err}`, 'danger')
      },
      onExit(exitCode) {
        this.addLogLine(`Command finished with code: ${exitCode}`, exitCode === 0 ? 'success' : 'danger')
      },
      onClickRun() {
        this.clear()
        this.addLogLine('Command start...')

        if (!this.artillery) {
          this.artillery = new Artillery()
            .on('response', this.onResponse)
            .on('error', this.onError)
            .on('exit', this.onExit)
        }

        // this.artillery.run('static/yml')
      },
      addLogLine(text, cssClass = 'info') {
        this.logs.push({ text, time: new Date(), css: cssClass })
      },
      getDisplayLog(log) {
        return `[${log.time}] ${log.text}`
      }
    },
    computed: {
      isRunning() {
        return this.artillery && this.artillery.isRunning()
      }
    },
    beforeDestroy() {
      if (this.artillery) {
        this.artillery.stop()
        this.artillery.removeAllListeners()
      }
    }
  };

</script>

<style lang="scss">

   $border-color: rgba(64, 64, 64, 1);
   $background-color: rgba(40, 40, 40, 1);
   $gray-color: rgba(48, 48, 48, 1);
   $text-color-dark: rgba(150, 150, 150, 1);
   $navbar-height: 70px;
   $success-color: green;
   $warning-color: orange;
   $danger-color: red;
   $info-color: blue;

   .label {
     padding: 4px 8px;
     text-transform: uppercase;
     border-radius: 4px;
     font-size: 14px;
     font-weight: bold;
     background-color: $text-color-dark;
     &.success {
       background-color: $success-color;
     }
     &.warning {
       background-color: $warning-color;
     }
     &.danger {
       background-color: $danger-color;
     }
     &.info {
       background-color: $info-color;
     }
   }

   main {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $gray-color;
    color: white;
  }

  .navbar {
    height: $navbar-height;
  }

  .content {
    display: flex;
    flex-direction: row;
  }

  .panel {
    flex: 1;
    width: 100%;
    background-color: $background-color;
    height: calc(100vh - #{$navbar-height});
    .panel-header {
      border-top: 1px solid $border-color;
      border-bottom: 1px solid $border-color;
      padding: 15px 10px 15px 10px;
      text-transform: uppercase;
    }
    & + .panel {
      border-left: 1px solid $border-color;
    }
  }

  .panel-terminal {
    .panel-body {
      font-family: Consolas, monospace;
      white-space: pre-wrap;
      font-size: 14px;
      padding: 15px 10px;
      overflow: scroll;
    }
    .danger {
      color: red;
    }
    .success {
      color: green;
    }
    .warning {
      color: orange;
    }
  }

  input {
    border: 0;
    border-radius: 4px;
    box-shadow: none;
    padding:12px 8px;
    font-size: 16px;
  }

  button {
    border: 0;
    padding:12px 8px;
    font-size: 16px;
    color: white;
    border-radius: 4px;
    background-color: #0782C5;
  }

</style>
