playerForm.addEventListener('change', function (e) {
  if (!isBusy) {
    isBusy = true;
    if (e.target.name === 'playerType') {
      fetch('/change-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player: e.target.value,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.text();
        })
        .then((data) => (log.textContent = data))
        .catch((err) => (log.textContent = 'Err: change v-player'))
        .finally(() => (isBusy = false));
    }
  }
});

document.getElementById('btnF').addEventListener('click', () => {
  if (!isBusy) {
    isBusy = true;
    fetch(`/click-f`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((data) => {
        log.textContent = data;
      })
      .catch((err) => (log.textContent = 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});

document.getElementById('btnNotCursor').addEventListener('click', () => {
  if (!isBusy) {
    isBusy = true;
    fetch(`/not-cursor`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((data) => {
        log.textContent = data;
      })
      .catch((err) => (log.textContent = 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});

document.getElementById('btnClickLkm').addEventListener('click', () => {
  if (!isBusy) {
    isBusy = true;
    fetch(`/click-lkm`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((data) => {
        log.textContent = data;
      })
      .catch((err) => (log.textContent = 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});

document.getElementById('centerCursor').addEventListener('click', () => {
  if (!isBusy) {
    isBusy = true;
    fetch(`/center-cursor`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.text();
      })
      .then((data) => {
        log.textContent = data;
      })
      .catch((err) => (log.textContent = 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});

getBgImgBtn.addEventListener('click', () => {
  if (!isBusy) {
    fetch('/get-bg')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        containerBg.style.backgroundImage = `url('${data.img}')`;
        log.textContent = data.message;
      })
      .catch((err) => (log.textContent = err.message || 'Attention! Server not available!'))
      .finally(() => (isBusy = false));
  }
});
