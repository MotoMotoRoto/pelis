const movies = [
  { id: "dark", title: "Dark", year: "2017", type: "Serie", shot: 2, y: 1154 },
  { id: "lotr-fellowship", title: "The Lord of the Rings: The Fellowship of the Ring", year: "2001", type: "Película", shot: 3, y: 876 },
  { id: "lotr-two-towers", title: "The Lord of the Rings: The Two Towers", year: "2002", type: "Película", shot: 3, y: 1157 },
  { id: "the-office", title: "The Office", year: "2026", type: "Serie", shot: 4, y: 295 },
  { id: "lotr-return", title: "The Lord of the Rings: The Return of the King", year: "2003", type: "Película", shot: 4, y: 577 },
  { id: "hobbit-journey", title: "The Hobbit: An Unexpected Journey", year: "2012", type: "Película", shot: 4, y: 858 },
  { id: "hobbit-battle", title: "The Hobbit: The Battle of the Five Armies", year: "2014", type: "Película", shot: 4, y: 1140 },
  { id: "mandalorian-grogu", title: "Star Wars: The Mandalorian and Grogu", year: "2026", type: "Película", shot: 5, y: 328 },
  { id: "star-wars-episode-1", title: "Star Wars: Episodio I – La amenaza fantasma", year: "1999", type: "Película", poster: "star-wars-episode-1.webp" },
  { id: "star-wars-episode-2", title: "Star Wars: Episodio II – El ataque de los clones", year: "2002", type: "Película", poster: "star-wars-episode-2.webp", posterFit: "contain" },
  { id: "star-wars-episode-3", title: "Star Wars: Episodio III – La venganza de los Sith", year: "2005", type: "Película", poster: "star-wars-episode-3.webp" },
  { id: "hill-house", title: "The Haunting of Hill House", year: "2018", type: "Miniserie", shot: 5, y: 609 },
  { id: "the-boys", title: "The Boys", year: "2019", type: "Serie", shot: 5, y: 891 },
  { id: "project-hail-mary", title: "Project Hail Mary", year: "2026", type: "Película", shot: 5, y: 1172 },
  { id: "eternal-sunshine", title: "Eternal Sunshine of the Spotless Mind", year: "2004", type: "Película", shot: 6, y: 338 },
  { id: "about-time", title: "About Time", year: "2013", type: "Película", shot: 6, y: 619 },
  { id: "hobbit-desolation", title: "The Hobbit: The Desolation of Smaug", year: "2013", type: "Película", shot: 1, y: 249 },
  { id: "invincible", title: "Invincible", year: "2021", type: "Serie", shot: 0, y: 338 },
  { id: "10-things", title: "10 Things I Hate About You", year: "1999", type: "Película", shot: 0, y: 619 },
  { id: "the-notebook", title: "The Notebook", year: "2004", type: "Película", shot: 0, y: 900 },
  { id: "la-la-land", title: "La La Land", year: "2016", type: "Película", shot: 0, y: 1182 },
  { id: "happy-feet", title: "Happy Feet", year: "2006", type: "Película", poster: "happy-feet.jpg" },
  { id: "rec", title: "[REC]", year: "2007", type: "Película", poster: "rec.jpg" }
];

const favoriteIds = new Set([
  "la-la-land", "the-notebook", "10-things", "invincible",
  "hobbit-journey", "hobbit-desolation", "hobbit-battle",
  "lotr-fellowship", "lotr-two-towers", "lotr-return",
  "eternal-sunshine", "about-time", "project-hail-mary",
  "mandalorian-grogu", "star-wars-episode-1", "star-wars-episode-2", "star-wars-episode-3",
  "happy-feet", "rec"
]);

const STORAGE_KEY = "mary-elena-movie-status-v1";
const validStatuses = new Set(["new", "pending", "seen"]);
let saved = {};
try {
  const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  if (value && typeof value === "object" && !Array.isArray(value)) saved = value;
} catch { /* The list still works if browser storage is unavailable. */ }

let activeFilter = "all";
const content = document.getElementById("list-content");
const search = document.getElementById("search");
const groups = [
  { id: "new", kicker: "01 / DESCUBRE", title: "Por elegir", note: "Todas las recomendaciones que todavía no has clasificado." },
  { id: "pending", kicker: "02 / PARA DESPUÉS", title: "Pendientes para ver", note: "Las que te llamaron la atención y todavía no has visto." },
  { id: "seen", kicker: "03 / YA CONOCIDAS", title: "Ya vistas", note: "Las historias que ya forman parte de tus recuerdos." }
];

function getStatus(movie) {
  return validStatuses.has(saved[movie.id]) ? saved[movie.id] : "new";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function action(label, status, movie) {
  const primary = (status === "pending" && getStatus(movie) === "new") || (status === "seen" && getStatus(movie) === "pending");
  return `<button class="action${primary ? " primary" : ""}" type="button" data-id="${movie.id}" data-status="${status}" aria-label="${escapeHtml(label)}: ${escapeHtml(movie.title)}">${label}</button>`;
}

function movieCard(movie) {
  const status = getStatus(movie);
  const posterY = Math.round((movie.y || 0) * .71);
  const poster = movie.poster
    ? `<div class="poster poster-image${movie.posterFit === "contain" ? " is-contain" : ""}"><img src="assets/${movie.poster}" alt="Póster de ${escapeHtml(movie.title)}" loading="lazy" /></div>`
    : `<div class="poster" style="background-image:url('assets/shot-${movie.shot}.jpeg');background-position:-13px -${posterY}px" role="img" aria-label="Póster de ${escapeHtml(movie.title)}"></div>`;
  let actions;
  if (status === "new") actions = action("No la he visto", "pending", movie) + action("Ya la vi", "seen", movie);
  else if (status === "pending") actions = action("Ya la vi", "seen", movie) + action("Regresar", "new", movie);
  else actions = action("Quiero verla", "pending", movie) + action("Regresar", "new", movie);
  const badge = status === "pending" ? '<span class="status-pill">✦ En mi lista</span>' : status === "seen" ? '<span class="status-pill seen">✓ Ya la vi</span>' : '';
  return `<article class="movie-card">${poster}<div class="card-details"><p class="card-meta">${movie.type} <span aria-hidden="true">·</span> ${movie.year}</p><h4 class="card-title">${escapeHtml(movie.title)}</h4>${favoriteIds.has(movie.id) ? '<span class="favorite-tag">✳ De mis favoritas</span>' : ''}${badge}<p class="card-subtitle">${status === "new" ? "¿Ya conoces esta historia?" : status === "pending" ? "Lista para tu próxima noche de cine" : "Una historia que ya conoces"}</p><div class="card-actions">${actions}</div></div></article>`;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("es");
  const counts = { all: movies.length, new: 0, pending: 0, seen: 0, favorites: favoriteIds.size };
  movies.forEach(movie => counts[getStatus(movie)]++);
  document.getElementById("total-count").textContent = movies.length;
  Object.keys(counts).forEach(key => document.getElementById(`count-${key}`).textContent = counts[key]);
  const visibleGroups = groups.filter(group => activeFilter === "all" || activeFilter === "favorites" || activeFilter === group.id);
  const html = visibleGroups.map(group => {
    const entries = movies.filter(movie => getStatus(movie) === group.id && (activeFilter !== "favorites" || favoriteIds.has(movie.id)) && movie.title.toLocaleLowerCase("es").includes(query));
    if (!entries.length && (activeFilter === "all" || activeFilter === "favorites")) return "";
    const body = entries.length ? `<div class="cards">${entries.map(movieCard).join("")}</div>` : `<div class="empty"><div class="empty-symbol">✧</div><h3>${query ? "Sin coincidencias" : "Aquí todavía no hay títulos"}</h3><p>${query ? "Prueba con otro título o borra la búsqueda." : "Elige una película o serie de las recomendaciones y aparecerá aquí."}</p></div>`;
    return `<section class="group" aria-labelledby="group-${group.id}"><div class="group-header"><div><div class="group-kicker">${group.kicker}</div><h3 id="group-${group.id}">${group.title}</h3></div><p>${group.note}</p></div>${body}</section>`;
  }).join("");
  content.innerHTML = html || '<div class="empty"><div class="empty-symbol">✧</div><h3>Sin coincidencias</h3><p>Prueba con otro título o borra la búsqueda.</p></div>';
}

function selectFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".tab").forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  render();
}

document.getElementById("favorites-list").innerHTML = movies.filter(movie => favoriteIds.has(movie.id)).map((movie, index) =>
  `<button class="favorite-item" type="button" data-favorite-id="${movie.id}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(movie.title)}</strong><b aria-hidden="true">↗</b></button>`
).join("");
document.getElementById("favorites-list").addEventListener("click", event => {
  const button = event.target.closest("button[data-favorite-id]");
  if (!button) return;
  const movie = movies.find(item => item.id === button.dataset.favoriteId);
  if (!movie) return;
  search.value = movie.title;
  selectFilter("favorites");
  document.getElementById("coleccion").scrollIntoView({ behavior: "smooth" });
});
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => {
  search.value = "";
  selectFilter(tab.dataset.filter);
}));
search.addEventListener("input", render);
content.addEventListener("click", event => {
  const button = event.target.closest("button[data-id][data-status]");
  if (!button) return;
  const id = button.dataset.id;
  const status = button.dataset.status;
  if (!movies.some(movie => movie.id === id) || !validStatuses.has(status)) return;
  if (status === "new") delete saved[id]; else saved[id] = status;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch { /* Browsers in private mode may block persistence. */ }
  render();
});
render();
