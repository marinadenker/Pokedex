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
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`;
    let response = await fetch(url); // get data from the url
    let respJson = await response.json(); // answer from API in JSON -> convert into JavaScript-Object
    allLoadedPokemon = respJson["results"];
    await renderPokemonCard(); // call of the function
  } catch (error) {
    console.error("Error loading data. Error details:" + error);
  } finally {
    document.getElementById("loadingspinner").classList.add("d-none");
  }
}

async function fetchPokemon(url) {
  let resp = await fetch(url);
  let respJSON = await resp.json();
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
    let pokemonUrl = allPokemon[index]["url"];
    let pokemon = await fetchPokemon(pokemonUrl);
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
  const evoResponse = await fetch(url);
  const pokemonEvolution = await evoResponse.json();
  pokemonSpecies = pokemonEvolution;
  await fetchPokemonEvolution();
}

async function fetchPokemonEvolution() {
  const evoResponse = await fetch(pokemonSpecies.evolution_chain.url);
  pokemonEvolution = await evoResponse.json();
}

async function getPokemonEvolutions() {
  let allEvolutions = [];
  let evolution1 = pokemonEvolution.chain.evolves_to[0].species.name;
  let evolution0 = pokemonEvolution.chain.species.name;
  allEvolutions.push(evolution0, evolution1);
  if (pokemonEvolution.chain.evolves_to[0].evolves_to[0]) {
    let evolution2 =
      pokemonEvolution.chain.evolves_to[0].evolves_to[0].species.name;
    allEvolutions.push(evolution2);
  }
  return allEvolutions;
}

let evolutionData = [];

async function getEvolutionData() {
  setActivToNav();
  let pokemonEvolutions = await getPokemonEvolutions();
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
  let myModal = new bootstrap.Modal(
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
    let searchString = allLoadedPokemon.filter((pokemon) =>
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
