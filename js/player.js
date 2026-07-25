document.querySelector('.container').addEventListener('click', function (event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;

  if (indicator) {
    indicator.classList.toggle('indicator_color1');
  }

  if (action && !isBusy) {
    isBusy = true;
    fetch(`/${action}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        res.text();
      })
      .then((data) => {
        log.textContent = data;
      })
      .catch((err) => (log.textContent = 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});
