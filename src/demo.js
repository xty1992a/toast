// import Toast from './package/main'

const $ = e => document.querySelector(e);

$('#btn').addEventListener('click', function () {
  window.Toast('hello world')
});
$('#delay').addEventListener('click', function () {
  let t = Toast.loading({
	message: 'hello world',
	duration: 0,
	mask: true,
  });

  setTimeout(() => {
	// t.clear();
  }, 1000)
});
$('#success').addEventListener('click', function () {
  Toast.success('hello world')
});
$('#error').addEventListener('click', function () {
  Toast.error('hello world')
});
$('#loading').addEventListener('click', function () {
  Toast.loading('hello world')
});
$('#modal').addEventListener('click', function () {
  Toast.loading({
	type: 'hello world',
	mask: true,
  })
});
// $('#loading').addEventListener('click', function () {});

