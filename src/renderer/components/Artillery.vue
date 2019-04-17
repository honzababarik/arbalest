<template></template>
<script>

  import Artillery from '@/../lib/artillery';

  export default {
    name: 'artillery',
    props: ['job', 'settings', 'environment'],
    data() {
      return {
        artillery: null,
      };
    },
    methods: {
      run() {
        this.artillery.run(this.config, this.settings, this.environment);
      },
      stop() {
        this.artillery.stop();
      },
      addLog(text, cssClass = '') {
        console.log(text);
        this.$store.dispatch('Job/addLog', {
          configId: this.config.id,
          log: {
            text,
            time: new Date(),
            css: `${cssClass}-color`,
          },
        });
      },
      onRun(pid) {
        this.addLog(`Job started: ${pid}`);
      },
      onResponse(response) {
        this.$store.dispatch('Job/addResponse', { configId: this.config.id, response });
      },
      onLine(line) {
        this.addLog(line);
      },
      onError(err) {
        this.addLog(`Err: ${err}`, 'danger');
      },
      onReport(report) {
        this.addLog(`Report is available!`, 'warning');
        this.$store.dispatch('Job/addReport', {
          configId: this.job.config_id,
          data: report
        })
      },
      onExit(exitCode) {
        if (exitCode === 0) {
          this.addLog('Test finished!', 'success');
          this.$dvlt.notify('Test finished!', 'success', {
            title: this.config.name,
          });
        }
        else {
          this.addLog(`Test failed with code: ${exitCode}`, 'danger');
          this.$dvlt.notify(`Test failed with code ${exitCode}...`, 'danger', {
            title: this.config.name,
          });
        }
        this.$store.dispatch('Job/stopJob', this.config.id);
      },
      onJobStatusChanged(isRunning, wasRunning) {
        if (!wasRunning && isRunning) {
          this.run();
        }
        if (wasRunning && !isRunning) {
          this.stop();
        }
      },
    },
    computed: {
      config() {
        return this.$store.getters['Config/getConfig'](this.job.config_id);
      },
    },
    beforeDestroy() {
      this.stop();
      this.artillery.removeAllListeners();
    },
    mounted() {
    },
    created() {
      this.artillery = new Artillery()
        .on('run', this.onRun)
        .on('response', this.onResponse)
        .on('line', this.onLine)
        .on('report', this.onReport)
        .on('error', this.onError)
        .on('exit', this.onExit);

      this.$watch('job.is_running', this.onJobStatusChanged, {
        immediate: true,
      });
    },
  };

</script>