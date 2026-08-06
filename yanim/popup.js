document.getElementById('parseBtn').onclick = async () => {
  const result = document.getElementById('result');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log(tab.url);
    if (
      !tab.url.startsWith('https://ru.yummyani.me/catalog/item/') &&
      !tab.url.startsWith('https://en.yummyani.me/catalog/item/')
    ) {
      result.textContent = 'Go to: yummyani.me/catalog/item/';
      return;
    }

    const response = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const img = document.querySelector('div.n3').querySelector('img');
        if (!img) return null;
        let resImg = {};

        resImg = {
          src: img.src,
          width: img.width,
          height: img.height,
          alt: img.alt,
        };

        const parents = document.querySelectorAll('div.xI');
        if (parents.length === 0) return null;
        const series = [];

        parents.forEach((parent) => {
          const children = parent.querySelectorAll('div._-8');
          children.forEach((child) => {
            const rect = child.getBoundingClientRect();
            series.push({
              x: rect.x,
              y: rect.y,
              status: 0, // 0 не смотрел, 1 просмотрено, 2 смотрю
              // top: rect.top,
              // left: rect.left,
              // width: rect.width,
              // height: rect.height,
            });
          });
        });

        return { series, resImg };
      },
    });

    const data = response[0].result;

    if (!data) {
      result.textContent = 'Ничего не найдено';
      return;
    }

    result.textContent = 'Найдено ' + data.series.length + ' серий';
    sendToServer(data);
  } catch (error) {
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
