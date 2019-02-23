/**
 * Created by TY-xie on 2019/2/23.
 */
import './index.less'

const instances = [];
let instance = null;
let seed = 0;

const ToastOptions = {
  type: 'text',
  message: '',
  mask: false,
  duration: 2000,
  className: '',
  mountTo: () => document.body,
};

const fmtOpt = function (opt) {
  if (typeof opt === 'string') {
	opt = {...ToastOptions, message: opt}
  }
  else {
	opt = {...ToastOptions, ...opt}
  }
  return opt
};

// region class ToastManager

function ToastManager(opt) {
  this.$options = opt;
  let parent = this.$parent = opt.mountTo();
  this.mount(parent, this.getInner())
}

ToastManager.prototype.mount = function (parent, inner) {
  const modal = this.$options.mask ? '<div class="modal"></div>' : '';
  const el = this.$el = document.createElement('div');
  el.className = this.$options.className + ' x-toast';
  el.id = `toast${this.$options.seed}`;
  el.innerHTML = `${modal}
 	<div class="center">${inner}</div>
  `;

  parent.appendChild(el);
  setTimeout(() => {
	this.catchDom();
	this.startTime();
	this.mounted();
  }, 20)
};

ToastManager.prototype.getInner = function () {
  switch (this.$options.type) {
	case 'text':
	  return createText(this.$options);
	case 'loading':
	  return createLoading(this.$options);
	default:
	  return createIcon(this.$options);
  }
};

ToastManager.prototype.catchDom = function () {
  const el = this.$el;
  this.$modal = this.$options.mask ? el.getElementsByClassName('modal')[0] : null;
};

ToastManager.prototype.mounted = function () {
  this.show();
};

ToastManager.prototype.show = function () {
  this.$el.classList.add('toast-show')
};

ToastManager.prototype.hide = function (callback) {
  this.$el.classList.remove('toast-show');
  setTimeout(callback, 300)
};

ToastManager.prototype.clear = function () {
  let index = instances.findIndex(i => i.seed === this.$options.seed);
  this.destroy();
  instances.splice(index, 1)
};

ToastManager.prototype.startTime = function () {
  let duration = this.$options.duration;
  duration ? this.timer = setTimeout(this.clear.bind(this), this.$options.duration) : null;
};

ToastManager.prototype.destroy = function () {
  clearTimeout(this.timer);
  let self = this;
  this.hide(function () {
	self.$parent.removeChild(self.$el);
  });
};

// endregion

// region createHtmlStr
function createText(opt) {
  return `<div class="toast-text">${opt.message}</div>`
}

function createLoading(opt) {
  return `<div class="toast-with-icon toast-loading">
				<div class="spinner toast-icon">${createSpinner()}</div>
				<div class="toast-message">${opt.message}</div>
			</div>
`
}

function createIcon(opt) {
  let icon = 'icon-' + opt.type;
  return `<div class="toast-with-icon">
				<div class="${opt.type} toast-icon">
					<i class="iconfont ${icon}"></i>
				</div>
				<div class="toast-message">${opt.message}</div>
			</div>`;
}

function createSpinner() {

  return `<span class="van-loading__spinner van-loading__spinner--circular"><svg viewBox="25 25 50 50" class="van-loading__circular"><circle cx="50" cy="50" r="20" fill="none"></circle></svg></span>`

}

// endregion

// region Toast
function Toast(opt) {
  if (typeof opt === 'string') {
	opt = {...ToastOptions, message: opt, seed}
  }
  else {
	opt = {...ToastOptions, ...opt, seed}
  }
  console.log(opt);
  instance = new ToastManager(opt);
  instances.push(instance);
  seed++;
  return instance;
}

Toast.clear = function (seed) {
  let index = instances.findIndex(i => i.seed === seed);
  if (index < 0) return;
  instances[index].clear();
};

Toast.clearAll = function () {
  instances.forEach(i => i.clear());
};

Toast.success = function (opt) {
  return Toast({...fmtOpt(opt), type: 'success'})
};

Toast.error = function (opt) {
  return Toast({...fmtOpt(opt), type: 'error'})
};

Toast.loading = function (opt) {
  return Toast({...fmtOpt(opt), type: 'loading'})
};

// endregion

export default Toast
