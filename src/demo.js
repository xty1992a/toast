// import Toast from '../lib/toast'
// import '../lib/toast.css'
import Toast from './package/main.ts'

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
