document.getElementById('parseBtn').onclick = async () => {
  const result = document.getElementById('result');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const parents = document.querySelectorAll('div.xI');

        const series = [];
        let resImg = {};

        const img = document.querySelector('div.n3').querySelector('img');
        if (img) {
          resImg = {
            src: img.src,
            width: img.width,
            height: img.height,
            alt: img.alt,
          };
        }

        parents.forEach((parent) => {
          const children = parent.querySelectorAll('div._-8');
          children.forEach((child) => {
            const rect = child.getBoundingClientRect();
            series.push({
              x: rect.x,
              y: rect.y,
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            });
          });
        });

        return { series, resImg };
      },
    });

    const data = response[0].result;

    if (data.length === 0) {
      result.textContent = 'Ничего не найдено';
    } else {
      result.textContent = 'Найдено ' + data.series.length;
      sendToServer(data);
    }
  } catch (error) {
    console.log(error);
    result.textContent = 'Ошибка: ' + error.message;
  }
};

async function sendToServer(data) {
  const res = await fetch('http://localhost:3000/list-serries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ series: data.series, resImg: data.resImg }),
  });

  const result = await res.json();
  // console.log(result);
}
