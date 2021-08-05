class MonitorTracer {
  static isHiddend = (el = {}) => {
    const { style = {} } = el;
    const { display, opacity, visibility } = style;
    return display === 'none' || opacity === '0' || visibility === 'hidden';
  };

  constructor() {
    this.visibilityWatchingTargets = new Set();
    this.clickWatchingTargets = new Set();
    this.clickObserver = this.createClickObserver();
    this.intersectionObserver = this.createIntersectionObserver();
    this.mutationObserver = this.createMutationObserver();

    this.updateWatchingTargets();
    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  createClickObserver = () => {
    if (this.clickObserver) {
      this.clickObserver.disconnect();
    }
    const cb = e => {
      if (this.clickWatchingTargets.has(e.target)) {
        const { monitorClick } = e.target.dataset;
        console.log(monitorClick, 'clicked');
      }
    };
    document.addEventListener('click', cb);
    return {
      disconnect() {
        document.removeEventListener('click', cb);
      },
    };
  };

  createIntersectionObserver = () => {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // entry.boundingClientRect, // 目标元素的矩形区域的信息
        // entry.intersectionRatio, // 目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0
        // entry.intersectionRect, // 目标元素与视口（或根元素）的交叉区域的信息
        // entry.isIntersecting, // 标示元素是已转换为相交状态 (true) 还是已脱离相交状态 (false)
        // entry.rootBounds, // 根元素的矩形区域的信息, getBoundingClientRect 方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
        // entry.target, // 被观察的目标元素，是一个 DOM 节点对象
        // entry.time // 可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
        if (entry.isIntersecting && !entry.target.$visible) {
          entry.target.$visible = true;
          const { monitorShow } = entry.target.dataset;
          console.log(monitorShow, 'showed');
        } else if (!entry.isIntersecting) {
          entry.target.$visible = false;
        }
      });
    });
  };

  createMutationObserver = () => {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    return new MutationObserver(() => {
      this.updateWatchingTargets();
    });
  };

  updateWatchingTargets = () => {
    this.visibilityWatchingTargets.clear();
    this.clickWatchingTargets.clear();

    document.querySelectorAll('[data-monitor-show]').forEach(el => {
      if (!MonitorTracer.isHiddend(el) && !this.visibilityWatchingTargets.has(el)) {
        this.visibilityWatchingTargets.add(el);
      }
    });

    document.querySelectorAll('[data-monitor-click]').forEach(el => {
      if (!this.clickWatchingTargets.has(el)) {
        this.clickWatchingTargets.add(el);
      }
    });

    this.intersectionObserver.disconnect();
    this.visibilityWatchingTargets.forEach(el => this.intersectionObserver.observe(el));
  };

  disconnect = () => {
    this.clickObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
  };
}

const monitorTracer = new MonitorTracer();

window.addEventListener('beforeunload', () => {
  monitorTracer.disconnect();
});
