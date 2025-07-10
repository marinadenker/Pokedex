let firstLoad = 20;
let currentPokemon;

async function onloadFunc() {
  loadPokemon();
}

async function loadPokemon() {
  document.getElementById("content").innerHTML = "";
  document.getElementById("loadingspinner").classList.remove("d-none");
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${firstLoad}`;
    let response = await fetch(url); // Hole Daten von der angegebenen URL
    let respJson = await response.json(); // Antwort der API ist im JSON-Format -> wandelt diese in ein JavaScript-Objekt
    await renderPokemonCard(respJson["results"]); // Aufruf der Funktion mit results-Array aus JSON-Objekt
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

async function renderPokemonCard(allPokemon) {
  allPokemon.forEach(async (element) => {
    let pokemon = await fetchPokemon(element.url);
    genPokemonCard(pokemon);
  });
}


// Dialog
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
  for (let index = 0; index < pokemonEvolutions.length; index++) {
    const evolutionName = pokemonEvolutions[index];
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








