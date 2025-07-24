let firstLoad = 20;
let lastFirstLoad = 0;
let currentPokemon;
let allLoadedPokemon;
let pokemonEvolution;
let pokemonSpecies;

async function onloadFunc() {
  loadPokemon();
}

async function loadPokemon() {
  document.getElementById("loadingspinner").classList.remove("d-none");
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`;
    const response = await fetch(url); // get data from the url
    const respJson = await response.json(); // answer from API in JSON -> convert into JavaScript-Object
    allLoadedPokemon = respJson["results"];
    await renderPokemonCard(); // call of the function
  } catch (error) {
    console.error("Error loading data. Error details:" + error);
  } finally {
    document.getElementById("loadingspinner").classList.add("d-none");
  }
}

async function fetchPokemon(url) {
  const resp = await fetch(url);
  const respJSON = await resp.json();
  return respJSON;
}

async function renderPokemonCard() {
  for (let index = lastFirstLoad; index < firstLoad; index++) {
    if (!allLoadedPokemon[index]["url"]) return;
    let pokemon = await fetchPokemon(allLoadedPokemon[index]["url"]);
    genPokemonCard(pokemon, "content");
  }
}

async function renderPokemonCardSearch(allPokemon) {
  for (let index = 0; index < allPokemon.length; index++) {
    const pokemonUrl = allPokemon[index]["url"];
    const pokemon = await fetchPokemon(pokemonUrl);
    genPokemonCard(pokemon, "search-content");
  }
}

async function showDialog(id) {
  await getPokemonDetailData(id);
  await getEvolutionChainUrl(id);
  await getEvolutionData();
  genModalDialog();
  showModal();
}

function nextPokemon() {
  let id = currentPokemon.id + 1;
  if (id > firstLoad) {
    id = 1;
  }
  renderDialogNew(id);
}

function previousPokemon() {
  let id = currentPokemon.id - 1;
  if (id == 0) {
    id = firstLoad;
  }
  renderDialogNew(id);
}

async function loadMore() {
  document.getElementById("loadingspinner").classList.remove("d-none");
  lastFirstLoad = firstLoad;
  firstLoad = firstLoad + 20;
  await renderPokemonCard();
  document.getElementById("loadingspinner").classList.add("d-none");
}

async function renderDialogNew(id) {
  await getPokemonDetailData(id);
  await getEvolutionChainUrl(id);
  await getEvolutionData();
  genModalDialog();
}

async function getPokemonDetailData(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  currentPokemon = await fetchPokemon(url);
}

function getEnglishFlavorText() {
  let englishText = "";
  const flavorTextEntries = pokemonSpecies.flavor_text_entries;
  flavorTextEntries.forEach((entry) => {
    if (entry.language.name !== "en") return;
    englishText = entry.flavor_text;
  });
  return englishText;
}

async function getEvolutionChainUrl(id) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  const pokemonSpeciesResponse = await fetch(url);
  const pokemonSpeciesJson = await pokemonSpeciesResponse.json();
  pokemonSpecies = pokemonSpeciesJson;
  await fetchPokemonEvolution();
}

async function fetchPokemonEvolution() {
  const evolutionResponse = await fetch(pokemonSpecies.evolution_chain.url);
  pokemonEvolution = await evolutionResponse.json();
}

async function getPokemonEvolutions() {
  const allEvolutions = [];
  const firstEvolution = pokemonEvolution.chain.evolves_to[0].species.name;
  const baseEvolution = pokemonEvolution.chain.species.name;
  allEvolutions.push(baseEvolution, firstEvolution);
  if (pokemonEvolution.chain.evolves_to[0].evolves_to[0]) {
    const secondEvolution =
      pokemonEvolution.chain.evolves_to[0].evolves_to[0].species.name;
    allEvolutions.push(secondEvolution);
  }
  return allEvolutions;
}

let evolutionData = [];

async function getEvolutionData() {
  setActivToNav();
  const pokemonEvolutions = await getPokemonEvolutions();
  evolutionData = [];
  for (let i = 0; i < pokemonEvolutions.length; i++) {
    const evolutionName = pokemonEvolutions[i];
    const url = `https://pokeapi.co/api/v2/pokemon/${evolutionName}`;
    const respJSON = await fetchPokemon(url);
    evolutionData.push({
      img: respJSON["sprites"]["other"]["official-artwork"]["front_default"],
      name: respJSON.name,
    });
  }
}

function showEvolution() {
  document.getElementById("modal-info").innerHTML = "";
  evolutionData.forEach((data) => genPokemonEvolutions(data));
}

function showModal() {
  const myModal = new bootstrap.Modal(
    document.getElementById("pokemon-info-modal"),
    {}
  );
  myModal.show();
}

function setActivToNav() {
  document.querySelectorAll(".nav-item").forEach((element) =>
    element.addEventListener("click", function (event) {
      event.preventDefault();
      document
        .querySelectorAll(".nav-item")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    })
  );
}

// Search Function
function searchOnEnter() {
  if (event.key === "Enter") {
    event.preventDefault();
    searchPokemon();
  }
}

function searchPokemon() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value;
  filterPokemon(searchTerm);
}

async function filterPokemon(inputValue) {
  document.getElementById("search-content").innerHTML = "";
  if (inputValue.length > 2) {
    showSearchContainer();
    const searchString = allLoadedPokemon.filter((pokemon) =>
      pokemon.name.includes(inputValue.toLowerCase())
    );
    renderPokemonCardSearch(searchString);
  } else if (inputValue.length <= 2) {
    document.getElementById('alert-container').classList.remove("d-none");
    removeSearchContainer();
    setTimeout(() => {
      document.getElementById("alert-container").classList.add("d-none");  
    }, 3000);
  }
}

async function filterPokemon(inputValue) {
  document.getElementById("search-content").innerHTML = "";
  if (inputValue.length <= 2) {
    removeSearchContainer();
    if (inputValue.length === 0) return;
      showUserNotification();
      return;
  }
  showSearchContainer();
  const searchString = allLoadedPokemon.filter((pokemon) =>
    pokemon.name.includes(inputValue.toLowerCase())
  );
  renderPokemonCardSearch(searchString);
}

function showUserNotification(){
    document.getElementById("alert-container").classList.remove("d-none");
    setTimeout(() => {
      document.getElementById("alert-container").classList.add("d-none");
    }, 3000);
}

function showSearchContainer() {
  document.getElementById("content").classList.add("d-none");
  document.getElementById("search-content").classList.remove("d-none");
  document.getElementById("load-more-btn").classList.add("d-none");
}

function removeSearchContainer() {
  document.getElementById("content").classList.remove("d-none");
  document.getElementById("search-content").classList.add("d-none");
  document.getElementById("load-more-btn").classList.remove("d-none");
}
