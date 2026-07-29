const mainDisplay = document.getElementById('mainDisplayList');
const sectionHeading = document.getElementById('sectionHeading');
const searchInput = document.getElementById('searchInput');
let currentItems = [];
 
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

    const plusBtn = document.createElement('a');
    plusBtn.href = 'https://t.me/+eQ_pVh9YhS8yZWI9';
    plusBtn.target = '_blank';
    plusBtn.rel = 'noopener noreferrer';
    plusBtn.className = 'card-plus-btn';
    plusBtn.textContent = '+';
    plusBtn.addEventListener('click', (e) => e.stopPropagation());
    card.appendChild(plusBtn);
  });
}
 
function closeDetail(){
  document.getElementById('detailPanel').classList.remove('open');
}
 
// Renders a given list of cards into the main display area
function renderList(items) {
  mainDisplay.innerHTML = '';
  items.forEach(card => {
    mainDisplay.appendChild(card.cloneNode(true));
  });
  attachCardListeners();
}
 
// Filter Categories Strategy
function filterCategory(type, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
 
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
 
  currentItems = itemsToDisplay;
  searchInput.value = '';
  renderList(currentItems);
}
 
// Search within the currently active filter (title or genre match)
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    renderList(currentItems);
    return;
  }
  const filtered = currentItems.filter(card => {
    const title = (card.dataset.title || '').toLowerCase();
    const genre = (card.dataset.genre || '').toLowerCase();
    return title.includes(query) || genre.includes(query);
  });
  renderList(filtered);
});
 
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
 