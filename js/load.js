const selectRes = document.getElementById('select_resolutions');

window.addEventListener('load', () => {
  if (!isBusy) {
    isBusy = true;
    const freeBoxSize = boxFree.getBoundingClientRect();
    fetch('/check-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        width: Math.round(freeBoxSize.width),
        height: Math.round(freeBoxSize.height),
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        log.textContent = data.mess;
        const playerForm = document.getElementById('playerForm');
        data.videoPlayers.map((vp, _) => {
          playerForm.insertAdjacentHTML(
            'beforeEnd',
            `<label class="player_text-radio"><input type="radio" ${
              vp.isChecked ? 'checked' : ''
            } name="playerType" value="${vp.player}">${vp.player}</label><br>`
          );
        });

        data.resolutions.map((res, _) => {
          const option = document.createElement('option');
          option.value = res.name;
          option.text = res.name;
          option.selected = res.selected;
          selectRes.appendChild(option);
        });

        if (data.img) containerBg.style.backgroundImage = `url('${data.img}')`;
      })
      .catch((err) => {
        console.log(err);
        log.textContent = 'Attention! Server not available!';
      })
      .finally(() => (isBusy = false));
  }
});

selectRes.addEventListener('change', function (event) {
  fetch('/change-resolution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resolution: event.target.value,
    }),
  })
    .then((data) => data.text())
    .then((data) => (log.textContent = data));
});
