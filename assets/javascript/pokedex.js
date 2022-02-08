document.addEventListener('DOMContentLoaded', function() {
   // listado inicial
  function ApiRequest(url){
    fetch(url)
    .then((response) => response.json())
    .then(data => {
      var n = 1
      let element = document.getElementById("info")
      var img
      var url_next = data.next
      var btn_next = document.getElementById("btn_more")

      var url_previus = data.previous
      console.log(url_previus)
      if (url_previus != null){
        let btn_previus = document.getElementById("btn_previus")
        btn_previus.classList.remove("d-none");
        btn_previus.setAttribute("href", url_previus)
      }else{
        btn_previus.classList.add("d-none");
      }
      btn_next.setAttribute("href", url_next)
      data.results.forEach(function(info){
        fetch(info.url)
        .then((response) => response.json())
        .then(datapoke => {
          img = datapoke.sprites.other.dream_world.front_default
          let div = document.createElement('div');
          div.className = "col-md-4 pokemon mt-2 mb-2"
          let new_element =  `
          <div class="card">
            <img src="${img}" class="card-img-top mt-2 p-4" alt="${img}" height="200px" width="200px">
            <div class="card-body">
              <h1 class="card-title">${info.name}</h1>
              <button type="button" id='enlace-${n}' url="${info.url}" class="btn btn-primary pokemodal" onclick="ModalUp('enlace-${n}')">¡Quiero ver más de este pokémon!</button>
            </div>
          </div>`
          n = n + 1
          div.innerHTML = new_element
          element.appendChild(div)
        })
      })
    })
  }

  function fn_btn_more(url){
    ApiRequest(url)
  }

  document.querySelector('#btn_more').addEventListener('click', (e) => {
    e.preventDefault();
    $(".pokemon").remove()
    fn_btn_more($("#btn_more").attr('href'))
  })

  document.querySelector('.btn__more').addEventListener('click', (e) => {
    e.preventDefault();
    $(".pokemon").remove()
    ApiRequest($("#btn_more").attr('href'))
  })

  document.querySelector('#btn_previus').addEventListener('click', (e) => {
    e.preventDefault();
    $(".pokemon").remove()
    ApiRequest($("#btn_previus").attr('href'))
  })

  const url = "https://pokeapi.co/api/v2/pokemon/"
  ApiRequest(url)

});

function ModalUp(IdBtn){
  let btn_clic = document.getElementById(IdBtn)
  let url = btn_clic.getAttribute('url')
  fetch(url)
    .then((response) => response.json())
    .then(data => {
      // NOMBRE
      let name = document.querySelector(".modal-title")
      name.innerHTML = data.name.toUpperCase()

      // HABILIDADES
      let abilitie = document.querySelector('#abilityPokemon')
      var habi_txt = ""
      data.abilities.forEach(abilitie => habi_txt += abilitie.ability.name + " / " )
      abilitie.innerHTML = habi_txt

      // TIPOS
      let type = document.querySelector("#typePokemon")
      var type_txt = ""
      data.types.forEach(type => type_txt += type.type.name + " / ")
      type.innerHTML = type_txt

      // MOVIMIENTOS
      document.querySelector('#movePokemon').innerHTML = getMoves(data);

      // generaciones
      let gen = document.querySelector("#generationPokemon")
      var gen_txt = ""
      data.game_indices.forEach(gen => gen_txt += " / "+gen.version.name)
      gen.innerHTML = gen_txt
    })
    .then( () => {
      $('#myModal').modal('show') 
    })

    function getMoves(pokemon) {
			let move = ""
			pokemon.moves.forEach(function(moves, index){
        if (index < 5) {
          move += ` ${moves.move.name}`
        }
			})
			return move;
    }
}