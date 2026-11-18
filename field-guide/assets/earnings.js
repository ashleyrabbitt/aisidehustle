const form = document.querySelector('#rate-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const n = key => Number(form.elements[key].value);
  const contribution = n('fee') - n('other');
  const currency = value => value.toLocaleString('en-US',{style:'currency',currency:'USD'});
  form.querySelector('output').textContent = 'Before tax and overhead: ' + currency(contribution/n('before')) + '/hr before AI and ' + currency((contribution-n('cost'))/n('after')) + '/hr with AI. Contribution per job changes from ' + currency(contribution) + ' to ' + currency(contribution-n('cost')) + '.';
});
