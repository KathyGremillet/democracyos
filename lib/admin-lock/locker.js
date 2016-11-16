import Loading from 'democracyos-loading-lock';
import bus from 'bus';
import o from 'component-dom';

class Locker {
  constructor () {
    this.locked = false;
    this.locker = null ;
  }

  lock () {
    if(!this.locker) this.locker = new Loading(o('#admin-content')[0], { size: 80 });
    this.locked = true;
    this.locker.lock();
  }

  unlock () {
    if (this.locked) this.locker.unlock();
    this.locked = false;
  }
}

let locker = new Locker();

export default locker;
