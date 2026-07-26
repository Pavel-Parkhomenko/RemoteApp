let twoFingerTimer = null;
let isTwoFingerExitEnabled = false;

const freeLog = document.querySelector('.free_log');

let timer = null;

freeCursor.addEventListener('click', () => {
  boxFree.style.visibility = 'visible';
  const freeBoxSize = boxFree.getBoundingClientRect();
  document.getElementById('box_free').classList.add('active');
  freeLog.textContent = `${Math.round(freeBoxSize.width)}, ${Math.round(freeBoxSize.height)}`;
});

function hideFreePage() {
  document.getElementById('box_free').classList.remove('active');
  boxFree.style.visibility = 'hidden';
}

function sendFreePosition(clientX, clientY) {
  fetch('/free-cursor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      x: clientX,
      y: clientY,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then((data) => {
      createCircleTouch(clientX, clientY);
      log.textContent = data;
    })
    .catch((err) => (log.textContent = 'Attention! Server not available!'));

  freeLog.textContent = `${clientX}, ${clientY}`;
}

function createCircleTouch(x, y) {
  const el = document.createElement('div');
  el.classList.add('circle_touch');
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  boxFree.appendChild(el);
}

boxFree.addEventListener('touchstart', (e) => {
  if (boxFree.style.display === 'none') return;

  if (e.touches.length === 1) {
    e.preventDefault();

    timer = setTimeout(() => {
      const touch = e.touches[0];
      const clientX = Math.round(touch.clientX);
      const clientY = Math.round(touch.clientY);
      sendFreePosition(clientX, clientY);
      timer = null;
    }, 400);
  } else if (e.touches.length === 2) {
    e.preventDefault();
    clearTimeout(timer);
    isTwoFingerExitEnabled = true;
  }
});

boxFree.addEventListener('touchmove', (e) => {
  if (e.touches.length !== 2 && isTwoFingerExitEnabled) {
    isTwoFingerExitEnabled = false;
  }
});

boxFree.addEventListener('touchend', (e) => {
  if (isTwoFingerExitEnabled) {
    hideFreePage();
    isTwoFingerExitEnabled = false;
  }
});

boxFree.addEventListener('touchcancel', () => {
  isTwoFingerExitEnabled = false;
});
