'use client';
import View from '@/views/Loading.view';
import { Screen } from '@/ui/dc';
import { waxPath } from '@/ui/kit';

/** Shown while a page loads: the seal first, a reassuring line after 4 seconds, and a way out after 12. */
export default class Loading extends Screen {
  static View = View;

  constructor(p) {
    super(p);
    this.state = { st: p.stuck ? 2 : 0 };
  }

  componentDidMount() {
    this.on = () => this.setState({ st: navigator.onLine ? 0 : 3 });
    window.addEventListener('offline', this.on);
    window.addEventListener('online', this.on);
    if (!navigator.onLine) this.setState({ st: 3 });
    if (this.props.stuck) return;
    this.t1 = setTimeout(() => this.setState((s) => (s.st === 0 ? { st: 1 } : null)), 4000);
    this.t2 = setTimeout(() => this.setState((s) => (s.st < 2 ? { st: 2 } : null)), 12000);
  }

  componentWillUnmount() {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
    window.removeEventListener('offline', this.on);
    window.removeEventListener('online', this.on);
  }

  renderVals() {
    const st = this.state.st;
    return { wax: waxPath(1.3), isLoad: st === 0, isSlow: st === 1, isStuck: st === 2, isOff: st === 3, sealCls: st >= 2 ? 'ls still' : 'ls', retry: () => (this.props.reset ? this.props.reset() : window.location.reload()) };
  }
}
