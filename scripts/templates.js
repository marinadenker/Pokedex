function genPokemonCard(pokemon, dataContainer) {
  document.getElementById(dataContainer).innerHTML += `
    <div class="card ${pokemon["types"][0]["type"]["name"]}" onclick="showDialog(${pokemon["id"]})">
      <div class="pokemon-name">
          <h5 class="card-title text-white">${pokemon.name}</h5>
          <span class="show-id">#${pokemon.id}</span>
      </div>
      <div class="show-types">
        ${getTypesOfPokemon(pokemon)}
      </div>
      <img src="${
        pokemon["sprites"]["other"]["official-artwork"]["front_default"]
      }" class="card-img-top" alt="...">
    </div>
    `;
}

function genModalDialog() {
  document.getElementById("pokemon-info-modal").innerHTML = "";
  document.getElementById("pokemon-info-modal").innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header ${currentPokemon["types"][0]["type"]["name"]}">
              <div class="modal-header-content">
                <p class="show-id">#${currentPokemon.id}</p>
                <h4 class="modal-title text-white text-center">${currentPokemon.name}</h4>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
          </div>
          <div class="modal-img-center"><img src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" class="modal-img"></div>
          <div class="modal-body">
          <div class="modal-body-content">
            <div class="nav">
              <i class="bi bi-chevron-left" onclick="previousPokemon()"></i>
              <p class="nav-item active" onclick="genAbout()">About</p>
              <p class="nav-item" onclick="genStatus()">Status</p>
              <p class="nav-item" onclick="showEvolution()">Evolution</p>
              <i class="bi bi-chevron-right" onclick="nextPokemon()"></i>
            </div>
          <div id="modal-info" class="row"></div>
        </div></div>
      </div>
    </div>
    `;

  genAbout();
}

async function genAbout() {
  setActivToNav();
  document.getElementById("modal-info").innerHTML = "";
  document.getElementById("modal-info").innerHTML = `
    <div class="current-pokemon-infos">
      <div class="type-icons">${getTypesOfPokemonIcon(currentPokemon)}</div>
      <div class="vertical-line"></div>
      <div class="pokemon-basics"><span class="color-bold">${currentPokemon.weight} g</span><p class="basic-info">Weight</p></div>
      <div class="vertical-line"></div>
      <div class="pokemon-basics"><span class="color-bold">${currentPokemon.height} cm</span><p class="basic-info">Height</p></div>
    </div>
    <div class="description">
      <h6>Description</h6>
      <p>${getEnglishFlavorText()}</p>
    </div>
    `;
}

function genStatus() {
  document.getElementById("modal-info").innerHTML = "";
  let stats = currentPokemon["stats"];
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    document.getElementById("modal-info").innerHTML += `
    <div class="bar-wrapper">
        <span>${stat["stat"]["name"]}</span>
        <div class="progress" style="height: 14px;">
        <div class="progress-bar ${currentPokemon["types"][0]["type"]["name"]}" role="progressbar" style="width: ${stat["base_stat"]}%;" aria-valuenow="${stat["base_stat"]}" aria-valuemin="0" aria-valuemax="100">${stat["base_stat"]}</div>
        </div>
    </div>
    `;
  }
}

function genPokemonEvolutions(pokemon) {
  document.getElementById("modal-info").innerHTML += `
    <div class="col text-center">
      <img src="${pokemon.img}" class="evolution-img" alt="${pokemon.name}">
      <p class="type">${pokemon.name}</p>
    </div>
  `;
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
