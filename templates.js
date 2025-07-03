function genPokemonCard(pokemon) {
  document.getElementById("content").innerHTML += `
    <div class="card ${pokemon["types"][0]["type"]["name"]}" onclick="showDialog(${pokemon["id"]})">
            <div class="pokemon-name">
                <h5 class="card-title text-white">${pokemon.name}</h5><span class="show-id">#${pokemon.id}</span>
            </div>
            <div class="show-types">
                ${getTypesOfPokemon(pokemon)}
            </div>
        <img src="${pokemon["sprites"]["other"]["official-artwork"]["front_default"]}" class="card-img-top" alt="...">
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
                    <img src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" class="modal-img">
                </div>
                <div class="modal-body">
                    <div class="nav">
                        <i class="bi bi-chevron-left" onclick="previousPokemon()"></i>
                        <p class="nav-item active" onclick="genAbout()">About</p>
                        <p class="nav-item" onclick="genStatus()">Status</p>
                        <p class="nav-item" onclick="genMoves()">Moves</p>
                        <i class="bi bi-chevron-right" onclick="nextPokemon()"></i>
                     </div>
                <div id="modal-info"></div>
                </div>
            </div>
        </div>
    `;
   
    genAbout();
}

async function genAbout() {
    setActivToNav();
    let pokemonCharacteristics = await fetchPokemonCharacteristics(currentPokemon.id);
    console.log(pokemonCharacteristics.descriptions[4].description);
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
        <p>${pokemonCharacteristics.descriptions[4].description}</p>
        </div>
    `;
}

function genStatus() {
    setActivToNav();
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

function genMoves() {
    setActivToNav();
  document.getElementById("modal-info").innerHTML = "";
}
