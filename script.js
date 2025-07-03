let firstLoad = 10;

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

function getTypesOfPokemon(pokemon) {
  let allTypes = "";
  let types = pokemon["types"];
  for (let i = 0; i < types.length; i++) {
    const element = types[i];
    allTypes += `<span class="badge badge-pill badge-secondary">${element["type"]["name"]}</span>`;
  }
  return allTypes;
}

function getTypesOfPokemonIcon(pokemon) {
  let allTypes = "";
  let types = pokemon["types"];
  for (let i = 0; i < types.length; i++) {
    const element = types[i];
    allTypes += ` 
            <div class="type-icon-container">
            <div class="type-icon ${element["type"]["name"]}" style="border-radius: 20px;">
              <img src="images/${element["type"]["name"]}.svg" alt="${element["type"]["name"]}" class="type-svg">
            </div>
            <p class="type basic-info">${element["type"]["name"]}</p>
            </div>
    `;
  }
  return allTypes;
}

// Dialog
let currentPokemon;
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
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  currentPokemon = await fetchPokemon(url);
}

async function fetchPokemonCharacteristics(id) {
  const url = `https://pokeapi.co/api/v2/characteristic/${id}/`;
  const charResponse = await fetch(url);
  const pokemonCharacteristics = await charResponse.json();
  return pokemonCharacteristics;
}


  // <p>${pokemonCharacteristics["descriptions"][4]["description"]}</p>


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








