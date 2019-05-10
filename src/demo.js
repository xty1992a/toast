// import Toast from '../lib/toast'
// import '../lib/toast.css'
import Toast from './package/main.ts'

window.Toast = Toast

const $ = e => document.querySelector(e);

$('#btn').addEventListener('click', function () {
  Toast('hello world')
});
$('#delay').addEventListener('click', function () {
  Toast({
	message: 'hello world',
	duration: 4000,
  });
});
$('#modal').addEventListener('click', function () {
  Toast({
	message: 'hello world',
	mask: true,
  });
});
$('#type').addEventListener('click', function () {
  Toast({
	type: 'icon-music',
	message: 'hello world',
  });
});
$('#mount').addEventListener('click', function () {
  Toast({
	message: 'hello world',
	mask: true,
	mountTo: () => document.getElementById('box'),
  });
});

$('#success').addEventListener('click', function () {
  Toast.success('hello world')
});
$('#error').addEventListener('click', function () {
  Toast.error('hello world')
});
$('#loading').addEventListener('click', function () {
  const t = Toast.loading('hello world');
  setTimeout(() => {
	t.clear();
  }, 1000)
});

$('#clearAll').addEventListener('click', function () {
  Toast.clearAll();
});
 
