const mainDisplay = document.getElementById('mainDisplayList');
const sectionHeading = document.getElementById('sectionHeading');

// Random Shuffle Function (Fisher-Yates Algorithm)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Bind popup click events on the cards currently shown
function attachCardListeners() {
  document.querySelectorAll('#mainDisplayList .drama-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('detailImg').src = card.dataset.img || '';
      document.getElementById('detailTitle').textContent = card.dataset.title || '';
      document.getElementById('detailDesc').textContent = card.dataset.desc || '';
      document.getElementById('detailTags').innerHTML =
        '<span class="tag genre">' + (card.dataset.genre || '') + '</span>' +
        '<span class="tag status">' + (card.dataset.status || '') + '</span>';
      document.getElementById('detailPanel').classList.add('open');
    });
  });
}

function closeDetail(){
  document.getElementById('detailPanel').classList.remove('open');
}

// Filter Categories Strategy
function filterCategory(type, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  mainDisplay.innerHTML = '';

  const koreanCards = Array.from(document.querySelectorAll('#korean-container .drama-card'));
  const movieCards = Array.from(document.querySelectorAll('#movie-container .drama-card'));

  let itemsToDisplay = [];

  if (type === 'korean') {
    sectionHeading.textContent = 'K-Drama Picks';
    itemsToDisplay = koreanCards;
  } else if (type === 'movie') {
    sectionHeading.textContent = 'Movies';
    itemsToDisplay = movieCards;
  } else {
    sectionHeading.textContent = 'All Recommendation';
    itemsToDisplay = shuffle([...koreanCards, ...movieCards]);
  }

  itemsToDisplay.forEach(card => {
    mainDisplay.appendChild(card.cloneNode(true));
  });

  attachCardListeners();
}

// Load the K-drama and Movie card partials, then do initial render
async function loadData() {
  try {
    const [koreanHTML, movieHTML] = await Promise.all([
     fetch('korean-dramas.html').then(res => res.text()),
fetch('movies.html').then(res => res.text())
    ]);
    document.getElementById('korean-container').innerHTML = koreanHTML;
    document.getElementById('movie-container').innerHTML = movieHTML;
  } catch (err) {
    console.error('Data load failed:', err);
  }
  filterCategory('all', document.querySelector('.filter-btn.active'));
}

window.addEventListener('DOMContentLoaded', loadData);
