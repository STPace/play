import lifecycleInstance from 'page-lifecycle';

const log = ms => {
  if (ms < 10) {
    return;
  }
  console.log('page active ms', ms);
  window.fetch(`http://localhost:3000/json?ms=${ms}`);
};

class PageLifeCycleWatcher {
  constructor() {
    this.startTime = Date.now();
    this.pageIsActive = true;
    this.listen();
  }

  handleActive = () => {
    this.pageIsActive = true;
    this.startTime = Date.now();
  };

  handleInactive = () => {
    if (!this.pageIsActive) {
      return;
    }
    this.pageIsActive = false;
    log(Date.now() - this.startTime);
  };

  handleStateChange = event => {
    console.log(event.newState);
    switch (event.newState) {
      // 在 Active 阶段，网页处于可见状态，且拥有输入焦点
      case 'active':
        this.handleActive();
        break;
      // 在 Passive 阶段，网页可见，但没有输入焦点，无法接受输入。UI 更新（比如动画）仍然在执行。该阶段只可能发生在桌面同时有多个窗口的情况
      case 'passive':
        this.handleActive();
        break;
      // 在 Hidden 阶段，用户的桌面被其他窗口占据，网页不可见，但尚未冻结。UI 更新不再执行
      case 'hidden':
        this.handleInactive();
        break;
      // 在 Terminated 阶段，由于用户主动关闭窗口，或者在同一个窗口前往其他页面，导致当前页面开始被浏览器卸载并从内存中清除。注意，这个阶段总是在 Hidden 阶段之后发生，也就是说，用户主动离开当前页面，总是先进入 Hidden 阶段，再进入 Terminated 阶段
      // 这个阶段会导致网页卸载，任何新任务都不会在这个阶段启动，并且如果运行时间太长，正在进行的任务可能会被终止
      case 'terminated':
        this.handleInactive();
        break;
      // 如果网页处于 Hidden 阶段的时间过久，用户又不关闭网页，浏览器就有可能冻结网页，使其进入 Frozen 阶段。不过，也有可能，处于可见状态的页面长时间没有操作，也会进入 Frozen 阶段。
      // 这个阶段的特征是，网页不会再被分配 CPU 计算资源。定时器、回调函数、网络请求、DOM 操作都不会执行，不过正在运行的任务会执行完。浏览器可能会允许 Frozen 阶段的页面，周期性复苏一小段时间，短暂变回 Hidden 状态，允许一小部分任务执行
      case 'frozen':
        this.handleInactive();
        break;
    }
  };

  listen = () => {
    lifecycleInstance.addEventListener('statechange', this.handleStateChange);
  };

  unListen = () => {
    lifecycleInstance.removeEventListener('statechange', this.handleStateChange);
  };
}

const pageLifeCycleWatcher = new PageLifeCycleWatcher();
