import { setInterval, clearInterval } from 'timers';
import Observable from './observable';


class Timer extends Observable {

  constructor() {
    super();
    this.minutes = 0;
    this.seconds = 0;
    this.timer = 0;
    this.timeoutId = null;
  }

  start() {
    this.reset();
    this.timeoutId = setInterval(() => {
      this.timer++;
      this.minutes = parseInt(this.timer / 60, 10);
      this.seconds = parseInt(this.timer % 60, 10);
      this.emit('tick', {
        minutes: this.minutes,
        seconds: this.seconds,
      });
    }, 1000);
  }

  stop() {
    clearInterval(this.timeoutId);
  }

  reset() {
    this.timer = 0;
    this.minutes = 0;
    this.seconds = 0;
    clearInterval(this.timeoutId);
    this.emit('tick', {
      minutes: 0,
      seconds: 0,
    });
  }

}

export default Timer;
