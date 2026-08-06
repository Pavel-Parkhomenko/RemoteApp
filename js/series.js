const boxListSeries = document.querySelector('.box_list-series');
const logSeries = document.querySelector('#log_series');
const beg = '> ';

window.addEventListener('load', () => {
  fetch('/get-series-and-poster')
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then((data) => {
      document.getElementById('box_main').style.backgroundImage = `url('${data.img.src}')`;
      document.querySelector('.text_header').textContent = data.img.alt || 'Упс...';
      addItemSeries(data.series);
      logSeries.textContent = beg + 'Success load!';
    })
    .catch((err) => {
      console.log(err);
      logSeries.textContent = beg + 'Error load!';
    });
});

function addItemSeries(series) {
  series.map((lot, ind) => {
    const item = document.createElement('div');
    console.log(lot);

    if (lot.status === 1) {
      item.classList.add('item-series_1');
    } else if (lot.status === 2) {
      item.classList.add('item-series_2');
    }

    item.classList.add('item-series');
    item.setAttribute('data-x_y', `${lot.x},${lot.y}`);
    item.textContent = ind + 1; // Важно, используется для изменения статуса серии
    boxListSeries.appendChild(item);
  });
}

boxListSeries.addEventListener('click', (event) => {
  const item = event.target.closest('.item-series');
  if (!item) return;

  const [x, y] = event.target.dataset.x_y.split(',');
  const ind = event.target.textContent;

  event.target.classList.toggle('item-series_2');

  fetch('change-series', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ x, y, ind: ind - 1 }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then((data) => {
      logSeries.textContent = beg + data;
    })
    .catch((err) => (logSeries.textContent = beg + err));
});
