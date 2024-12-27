const modalOverlay = document.getElementById("modal-overlay");
const background = document.getElementById("modal-background");
const modalContainer = document.getElementById('modal-container');
const movieList = document.getElementById("movie-list");

let currentMovie = {};
let favoriteMovies = []; // Lista de filmes favoritos

// Referências aos inputs de pesquisa
const movieNameInput = document.getElementById('movie-name');
const movieYearInput = document.getElementById('movie-year');
const searchButton = document.getElementById('search-button');

// Função para adicionar o filme à lista de favoritos
function addCurrentMovieToList() {
  if (!favoriteMovies.some(movie => movie.Title === currentMovie.Title)) {
    favoriteMovies.push(currentMovie); // Adiciona o filme à lista de favoritos
    updateMovieList(); // Atualiza a exibição da lista de favoritos
    closeModal(); // Fecha o modal após adicionar à lista
  } else {
    alert("Este filme já está na lista!");
  }
}

// Função para remover o filme da lista de favoritos
function removeFromFavorites(title) {
  favoriteMovies = favoriteMovies.filter(movie => movie.Title !== title); // Remove o filme
  updateMovieList(); // Atualiza a exibição da lista de favoritos

}


// Função para abrir o modal
function openModal(data) {
  modalOverlay.classList.add("open");
  createModal(data); // Chama a função para preencher o modal com conteúdo
}

// Função para fechar o modal quando o fundo for clicado
function backgroundClickHandler() {
  closeModal(); // Aqui chamamos a função para fechar o modal
}

// Função que cria o conteúdo do modal
function createModal(data) {
  currentMovie = data;
  modalContainer.innerHTML = `
    <h2 id="movie-title">${data.Title} - ${data.Year}</h2>
    <section id="modal-body">
      <img
        id="movie-poster"
        src="${data.Poster}"
        alt="Poster do Filme."
      />
      <div id="movie-info">
        <h3 id="movie-plot">${data.Plot}</h3>
        <div id="movie-cast">
          <h4>Elenco:</h4>
          <h5>${data.Actors}</h5>
        </div>
        <div id="movie-genre">
          <h4>Gênero:</h4>
          <h5>${data.Genre}</h5>
        </div>
      </div>
    </section>
    <section id="modal-footer">
      <button id="add-to-list" onclick="addCurrentMovieToList()">Adicionar à Lista</button>
    </section>`;
}

// Função para atualizar a lista de filmes favoritos
function updateMovieList() {
  movieList.innerHTML = ''; // Limpa a lista atual
  favoriteMovies.forEach(movie => {
    const movieItem = document.createElement("article");
    movieItem.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <button class="remove-button" onclick="removeFromFavorites('${movie.Title}')">Remover</button>
    `;
    movieList.appendChild(movieItem);
  });
}
updateLocalStorage.seItem('movieList', JSON.stringify(movieList));
// Função de busca para pesquisar o filme
async function searchMovie() {
  const movieName = movieNameInput.value;
  const movieYear = movieYearInput.value;
  if (!movieName) {
    alert("Por favor, insira o nome do filme.");
    return;
  }
  



  // Construindo a URL da API com os parâmetros de pesquisa
  const url = `https://www.omdbapi.com/?apikey=f5c81df4&t=${movieName.replace(" ", "+")}&y=${movieYear}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "True") {
      openModal(data); // Abre o modal com os dados do filme
    } else {
      alert("Filme não encontrado!");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao buscar o filme.");
  }
}

// Função para fechar o modal
function closeModal() {
  modalOverlay.classList.remove("open"); 
  
  // Agora está correto! Fecha o modal
}

// Adiciona o evento de clique no botão de pesquisa
searchButton.addEventListener("click", searchMovie);

// Adiciona o evento de clique no fundo do modal
background.addEventListener("click", backgroundClickHandler);
