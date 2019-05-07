import './index.less'

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

interface ToastFn {
    (opt: string | managerType): ToastManager;

    clear: clearFn,
    clearAll: Function,
    loading: aliasFn,
    success: aliasFn,
    error: aliasFn,
}

interface clearFn {
    (seed: number): void
}

interface aliasFn {
    (opt: ToastOption): ToastManager
}

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
        const modal = this.$options.mask ? '<div class="modal"></div>' : '';
        const el = this.$el = document.createElement('div');
        el.className = this.$options.className + ' x-toast';
        el.id = `toast${this.$options.seed}`;
        el.innerHTML = `${modal}<div class="center">${inner}</div>`;

        parent.appendChild(el);
        setTimeout(() => {
            this.catchDom();
            this.startTime();
            this.mounted();
        }, 20)
    }

    show() {
        this.$el.classList.add('toast-show')
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

// region createHtmlStr
function createText(opt: managerType): string {
    return `<div class="toast-text">${opt.message}</div>`
}

function createLoading(opt: managerType): string {
    return `<div class="toast-with-icon toast-loading">
				<div class="spinner toast-icon">${createSpinner()}</div>
				<div class="toast-message">${opt.message}</div>
			</div>
`
}

function createIcon(opt: managerType): string {
    let icon = 'icon-' + opt.type;
    return `<div class="toast-with-icon">
				<div class="${opt.type} toast-icon">
					<i class="iconfont ${icon}"></i>
				</div>
				<div class="toast-message">${opt.message}</div>
			</div>`;
}

function createSpinner(): string {
    return `<span class="van-loading__spinner van-loading__spinner--circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span>`

}

// endregion

const Toast: ToastFn = function (opt: ToastOption): ToastManager {
    instance = new ToastManager(fmtOpt(opt));
    instances.push(instance);
    seed++;
    return instance;
};

function fmtOpt(opt: ToastOption): managerType {
    if (typeof opt === 'string') {
        opt = {...dftOptions, message: opt, seed}
    } else {
        opt = {...dftOptions, ...opt, seed}
    }
    return opt
}

const clear: clearFn = function (seed: number): void {
    let index = instances.findIndex(i => i.$options.seed === seed);
    if (index < 0) return;
    instances[index].clear();
};
const success: aliasFn = function (opt: ToastOption): ToastManager {
    return Toast({...fmtOpt(opt), type: 'success'})
};
const error: aliasFn = function (opt: ToastOption): ToastManager {
    return Toast({...fmtOpt(opt), type: 'error'})
};
const loading: aliasFn = function (opt: ToastOption): ToastManager {
    const duration: number = typeof opt === 'string' ? 0 : opt.hasOwnProperty('duration') ? opt.duration : 0;
    return Toast({...fmtOpt(opt), type: 'loading', duration})
};
const clearAll = function (): void {
    while (instances.length) {
        instances[0].clear();
    }
};

Toast.clear = clear;
Toast.clearAll = clearAll;
Toast.success = success;
Toast.error = error;
Toast.loading = loading;

export default Toast
