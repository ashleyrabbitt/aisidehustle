(() => {
  const evidence = document.getElementById('pocket-evidence');
  const batches = document.getElementById('pocket-batches');
  if (batches) {
    const result = batches.querySelector('output');
    const update = () => {
      if (!batches.checkValidity()) {
        result.textContent = 'Enter whole counts of zero or more and a batch size of at least one.';
        return;
      }
      const ordered = batches.elements.ordered.valueAsNumber;
      const ready = batches.elements.ready.valueAsNumber;
      const size = batches.elements.yield.valueAsNumber;
      const count = Math.ceil(Math.max(0, ordered - ready) / size);
      const extra = ready + count * size - ordered;
      result.textContent = 'Bake ' + count + (count === 1 ? ' batch.' : ' batches.') +
        ' After filling orders for ' + ordered + (ordered === 1 ? ' loaf, ' : ' loaves, ') +
        extra + (extra === 1 ? ' loaf remains.' : ' loaves remain.');
    };
    batches.addEventListener('input', update);
    batches.addEventListener('submit', event => event.preventDefault());
    update();
  }
  if (!evidence) return;
  const output = document.getElementById('pocket-next');
  const fields = evidence.elements;
  const tip = () => {
    if (fields.action.value === 'paid') return 'Deliver the agreed version. Check whether the buyer uses it again and record delivery time, fees and support before expanding.';
    if (fields.buyer.value === 'none') return 'Ask a potential buyer to show you the last time they did this task. Capture the workaround in their own words.';
    if (fields.repeat.value !== 'recurs') return 'Find a second occurrence. Compare what triggered it and which part of the workaround repeated.';
    if (fields.action.value === 'none') return 'Invite one buyer to a ten-minute sample test. Agree on a date and one task they will try.';
    return 'Watch the agreed test, revise the first confusing field, then offer the finished version at a specific price and record the decision.';
  };
  evidence.addEventListener('change', () => { output.textContent = tip(); });
  evidence.addEventListener('submit', event => event.preventDefault());
  evidence.querySelector('[data-export-idea]').addEventListener('click', () => {
    const feedback = evidence.querySelector('.pp-feedback');
    if (!fields.idea.value.trim()) {
      feedback.textContent = 'Name your idea before downloading.';
      fields.idea.focus();
      return;
    }
    const answer = select => select.selectedOptions[0].textContent;
    const plan = [fields.idea.value.trim(), 'Buyer evidence: ' + answer(fields.buyer),
      'Frequency: ' + answer(fields.repeat), 'Commitment: ' + answer(fields.action),
      'My notes: ' + (fields.notes.value.trim() || 'To investigate'), 'Next test: ' + tip()].join('\n\n');
    const url = URL.createObjectURL(new Blob([plan+'\n'], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url; link.download = 'my-pocket-product-test.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    feedback.textContent = 'Your test plan is ready.';
    if (typeof window.gtag === 'function') window.gtag('event','pocket_plan_export');
  });
})();
