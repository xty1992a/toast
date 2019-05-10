import './index.less'

// region types
type ToastOption = string | managerType;

interface managerType {
    message: string,
    type?: string,
    mask?: boolean,
    duration?: number,
    className?: string,
    mountTo?: mountFn,
    seed?: number
}

interface mountFn {
    (): Element
}

interface innerCreator {
    (options: managerType): string
}

interface ToastFn {
    (opt: string | managerType): ToastManager;

    clear: clearFn,
    clearAll: Function,
    loading: aliasFn,
    waring: aliasFn,
    question: aliasFn,
    success: aliasFn,
    error: aliasFn,
}

interface clearFn {
    (seed: number): void
}

interface aliasFn {
    (opt: string | managerType): ToastManager
}

interface extendFn {
    (privateOption: object): aliasFn
}
// endregion

// region vaiables
const instances: ToastManager[] = [];
let instance: null | ToastManager = null;
let seed: number = 0;

const dftOptions: managerType = {
    type: 'text',
    message: '',
    mask: false,
    duration: 2000,
    className: '',
    mountTo: () => document.body,
    seed: 0
};

const iconList = ['success', 'error', 'waring', 'question']

// endregion

// region tool fn
const createText: innerCreator = opt => `<div class="toast-text">${opt.message}</div>`
const createIcon: innerCreator = opt => {
    let iconInclude = iconList.findIndex(it => it === opt.type) !== -1
    let icon = iconInclude ? 'icon-' + opt.type : opt.type;
    return `<div class="toast-with-icon">
				<div class="toast__${opt.type} toast-icon">
					<i class="iconfont ${icon}"></i>
				</div>
				<div class="toast-message">${opt.message}</div>
			</div>`;
}
const createLoading: innerCreator = opt => `<div class="toast-with-icon toast-loading">
    <div class="spinner toast-icon">${createSpinner()}</div>
    <div class="toast-message">${opt.message}</div>
    </div>`
const createSpinner: () => string = () => `<span class="van-loading__spinner van-loading__spinner--circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span>`
const extendAlias: extendFn = privateOption => option => Toast({ ...fmtOpt(option), ...privateOption })
const fmtOpt: (opt: ToastOption) => managerType = opt => typeof opt === 'string' ? { ...dftOptions, message: opt, seed } : { ...dftOptions, ...opt, seed }
const stopFn: (e: Event) => void = e => e.preventDefault()
const stopMove: (el: Element) => void = el => {
    el.addEventListener('mousewheel', stopFn);
    el.addEventListener('touchmove', stopFn);
}
// endregion

// region class ToastManager
class ToastManager {
    $options: managerType;
    $parent: Element;
    $modal: Element;
    $el: Element;
    timer: number;

    constructor(opt: managerType) {
        this.$options = opt;
        const parent = this.$parent = opt.mountTo();
        this.mount(parent, this.getInner())
    }

    getInner(): string {
        switch (this.$options.type) {
            case 'text':
                return createText(this.$options);
            case 'loading':
                return createLoading(this.$options);
            default:
                return createIcon(this.$options);
        }
    }

    catchDom() {
        const el = this.$el;
        this.$modal = this.$options.mask ? el.getElementsByClassName('modal')[0] : null;
        if (this.$modal) {
            stopMove(this.$modal)
        }
    }

    startTime() {
        let duration = this.$options.duration;
        if (!duration) return;
        this.timer = setTimeout(this.clear.bind(this), this.$options.duration);
    }

    mounted() {
        this.show()
    }

    clear() {
        let index = instances.findIndex(i => i.$options.seed === this.$options.seed);
        this.destroy();
        instances.splice(index, 1);
    }

    mount(parent: Element, inner: string) {
        const position = parent === document.body ? 'fixed' : 'absolute'
        const modal = this.$options.mask ? `<div class="modal" style="position:${position}"></div>` : '';
        const el = this.$el = document.createElement('div');
        el.className = this.$options.className + ' x-toast';
        el.id = `toast${this.$options.seed}`;
        el.innerHTML = `${modal}<div class="center" style="position:${position}">${inner}</div>`;

        parent.appendChild(el);
        setTimeout(() => {
            this.catchDom();
            this.startTime();
            this.mounted();
        }, 20)
    }

    show() {
        this.$el.classList.add('toast-show');
    }

    hide(callback: Function) {
        this.$el.classList.remove('toast-show');
        setTimeout(callback, 300)
    }

    destroy() {
        clearTimeout(this.timer);
        this.hide(() => {
            this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
        });
    }

}

// endregion

// region export functions
const Toast: ToastFn = function (opt) {
    instance = new ToastManager(fmtOpt(opt));
    instances.push(instance);
    seed++;
    return instance;
};

const clearAll = function (): void {
    while (instances.length) {
        instances[0].clear();
    }
};

const clear: clearFn = seed => {
    let index = instances.findIndex(i => i.$options.seed === seed);
    if (index < 0) return;
    instances[index].clear();
};

// endregion

// region Toast method
Toast.clearAll = clearAll;
Toast.clear = clear;

// loading 时,duration默认为0
Toast.loading = extendAlias({ type: 'loading', duration: 0 });
Toast.success = extendAlias({ type: 'success' });
Toast.error = extendAlias({ type: 'error' });
Toast.question = extendAlias({ type: 'question' });
Toast.waring = extendAlias({ type: 'waring' });

// endregion

export default Toast
