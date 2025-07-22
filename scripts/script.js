let firstLoad = 20;
let currentPokemon;
let allLoadedPokemon;

async function onloadFunc() {
  loadPokemon();
}

async function loadPokemon() {
  document.getElementById("content").innerHTML = "";
  document.getElementById("loadingspinner").classList.remove("d-none");
  try {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0`;
    let response = await fetch(url); // get data from the url
    let respJson = await response.json(); // answer from API in JSON -> convert into JavaScript-Object
    allLoadedPokemon = respJson["results"];
    await renderPokemonCard(respJson["results"]); // call of the function with results-array
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

async function renderPokemonCard(allPokemon, dataContainer = 'content') {
  for (let index = 0; index < firstLoad; index++) {
    console.log(allPokemon[index]);
    if(!allPokemon[index]['url']) return;
  let pokemonUrl = allPokemon[index]['url'];
    let pokemon = await fetchPokemon(pokemonUrl);
    genPokemonCard(pokemon, dataContainer);
  }
}

async function renderPokemonCardSearch(allPokemon) {
  for (let index = 0; index < allPokemon.length; index++) {
    console.log(allPokemon[index]);
    let pokemonUrl = allPokemon[index]['url'];
    let pokemon = await fetchPokemon(pokemonUrl);
    genPokemonCard(pokemon, 'search-content');
  }
}

async function showDialog(id) {
  await getPokemonDetailData(id);
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

function loadMore(){
  firstLoad = firstLoad + 10;
  loadPokemon();
}

async function renderDialogNew(id) {
  await getPokemonDetailData(id);
  genModalDialog();
}

async function getPokemonDetailData(id){
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  currentPokemon = await fetchPokemon(url);
}

async function fetchPokemonCharacteristics(id) {
  const url = `https://pokeapi.co/api/v2/characteristic/${id}/`;
  const charResponse = await fetch(url);
  const pokemonCharacteristics = await charResponse.json();
  return pokemonCharacteristics;
}

async function getEvolutionChainUrl(id){
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
  const evoResponse = await fetch(url);
  const pokemonEvolution = await evoResponse.json();
  return pokemonEvolution.evolution_chain.url;
}

async function fetchPokemonEvolution(id) {
  const url = await getEvolutionChainUrl(id);
  const evoResponse = await fetch(url);
  const pokemonEvolution = await evoResponse.json();
  return pokemonEvolution;
}

async function getPokemonEvolutions(){
  console.log(currentPokemon);
  let currentEvolution = await fetchPokemonEvolution(currentPokemon.id);
  let allEvolutions = [];
  let evolution1 = currentEvolution.chain.evolves_to[0].species.name;
  let evolution0 = currentEvolution.chain.species.name;
  allEvolutions.push(evolution0, evolution1);
  if(currentEvolution.chain.evolves_to[0].evolves_to[0]){
    let evolution2 = currentEvolution.chain.evolves_to[0].evolves_to[0].species.name;
    allEvolutions.push(evolution2);
  }
  console.log(allEvolutions);
  return allEvolutions;
}

async function getEvolutionData(){
  setActivToNav();
  document.getElementById("modal-info").innerHTML = "";
  let pokemonEvolutions = await getPokemonEvolutions();
  for (let i = 0; i < pokemonEvolutions.length; i++) {
    const evolutionName = pokemonEvolutions[i];
    const url = `https://pokeapi.co/api/v2/pokemon/${evolutionName}`;
    const respJSON = await fetchPokemon(url);
    console.log(respJSON);
    genPokemonEvolutions(respJSON);
  }
}

function showModal() {
  let myModal = new bootstrap.Modal(document.getElementById("pokemon-info-modal"), {});
  myModal.show();
}

function setActivToNav() {
  document.querySelectorAll(".nav-item").forEach((element) =>
    element.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    })
  );
}

// Search Function
function searchPokemon(){
  const searchInput = document.getElementById('search-input');
  const searchTerm = searchInput.value; // get the search input value
  filterPokemon(searchTerm);
};

async function filterPokemon(inputValue) {
  document.getElementById('search-content').innerHTML = '';
  if (inputValue.length > 2) { // check if input is bigger than 2
    showSearchContainer(); // show the container in which the searched pokemon will be displayed
    let searchString = allLoadedPokemon.filter(pokemon => pokemon.name.includes(inputValue.toLowerCase())); // filter the search input and be sure it includes parts of a pokemon name
    console.log(searchString);
    renderPokemonCardSearch(searchString);  
  }
  else if (inputValue.length == 0) {
    removeSearchContainer();
    } 
}

function showSearchContainer() {
    document.getElementById('content').classList.add('d-none');
    document.getElementById('search-content').classList.remove('d-none');
    document.getElementById('load-more-btn').classList.add('d-none');
}

function removeSearchContainer() {
    document.getElementById('content').classList.remove('d-none');
    document.getElementById('search-content').classList.add('d-none');
    document.getElementById('load-more-btn').classList.remove('d-none');
}










