window.addEventListener('load', () => {
  if (!isBusy) {
    isBusy = true;
    fetch('/check-server', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        width: window.screen.width,
        height: window.screen.height,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        log.textContent = data.mess;
        const playerForm = document.getElementById('playerForm');
        data.videoPlayers.map((vp, _) => {
          playerForm.insertAdjacentHTML(
            'beforeEnd',
            `<label><input type="radio" ${
              vp.isChecked ? 'checked' : ''
            } name="playerType" value="${vp.player}">${vp.player}</label><br>`
          );
        });

        if (data.img) containerBg.style.backgroundImage = `url('${data.img}')`;
      })
      .catch((err) => {
        log.textContent = 'Attention! Server not available!';
      })
      .finally(() => (isBusy = false));
  }
});
