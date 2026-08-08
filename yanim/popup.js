const posterSel = document.getElementById('input-poster_sel');
const seriesSel = document.getElementById('input-series_sel');
const commonSel = document.getElementById('input-common_sel');

document.addEventListener('DOMContentLoaded', function () {
  const selectors = JSON.parse(localStorage.getItem('selectors'));
  if (selectors) {
    posterSel.value = selectors.poster;
    seriesSel.value = selectors.series;
    commonSel.value = selectors.common;
  }
});

document.getElementById('parseBtn').onclick = async () => {
  const result = document.getElementById('result');
  let poster = '';
  let seriesText = '';
  let commonSeries = '';

  if (!posterSel.value || !seriesSel.value || !commonSel.value) {
    result.textContent = 'Enter selectors';
    return;
  } else {
    poster = posterSel.value || '';
    seriesText = seriesSel.value || '';
    commonSeries = commonSel.value || '';

    localStorage.setItem(
      'selectors',
      JSON.stringify({ poster, series: seriesText, common: commonSeries })
    );
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (
      !tab.url.startsWith('https://ru.yummyani.me/catalog/item/') &&
      !tab.url.startsWith('https://en.yummyani.me/catalog/item/')
    ) {
      result.textContent = 'Go to: yummyani.me/catalog/item/';
      return;
    }

    const response = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (poster, commonSeries, seriesText) => {
        let series = [];
        let resImg = {};

        const posterDiv = document.querySelector(`div.${CSS.escape(poster)}`);
        if (!posterDiv) return { series, resImg: null };
        const img = posterDiv.querySelector('img');
        if (!img) return { series, resImg: null };

        resImg = {
          src: img.src,
          width: img.width,
          height: img.height,
          alt: img.alt,
        };

        const parentCommon = document.querySelector(`div.${CSS.escape(commonSeries)}`);
        if (!parentCommon) return { series: null, resImg };
        const children = parentCommon.querySelectorAll(`div.${CSS.escape(seriesText)}`);
        if (children.length === 0) return { series: null, resImg };

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

        return { series, resImg };
      },

      args: [poster, commonSeries, seriesText],
    });

    const data = response[0].result;

    if (data.series === null) {
      result.textContent = 'Err: series';
      return;
    } else if (data.resImg === null) {
      result.textContent = 'Err: poster';
      return;
    } else if (!data) {
      result.textContent = 'Error!';
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
}
