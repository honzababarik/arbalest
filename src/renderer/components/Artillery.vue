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
        const test = Object.assign({}, this.test)
        test.duration = this.job.duration;
        test.rate = this.job.rate;
        this.artillery.run(test, this.settings, this.environment);
      },
      stop() {
        this.artillery.stop();
      },
      addLog(text, cssClass = '') {
        console.log(text);
        this.$store.dispatch('Job/addLog', {
          testId: this.test.id,
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
        this.$store.dispatch('Job/addResponse', { testId: this.test.id, response });
      },
      onLine(line) {
        this.addLog(line);
      },
      onError(err) {
        this.addLog(`Err: ${err}`, 'danger');
      },
      onReport(report) {
        this.addLog('Report is available!', 'warning');
        this.$store.dispatch('Job/addReport', {
          testId: this.job.test_id,
          data: report,
        });
      },
      onExit(exitCode) {
        if (exitCode === 0) {
          this.addLog('Test finished!', 'success');
          this.$dvlt.notify('Test finished!', 'success', {
            title: this.test.name,
          });
        }
        else {
          this.addLog(`Test failed with code: ${exitCode}`, 'danger');
          this.$dvlt.notify(`Test failed with code ${exitCode}...`, 'danger', {
            title: this.test.name,
          });
        }
        this.$store.dispatch('Job/stopJob', this.test.id);
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
      test() {
        return this.$store.getters['Test/getTest'](this.job.test_id);
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