document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-button");
    const overlay = document.getElementById("modal-overlay");
    const movieName = document.getElementById("movie-name");
    const movieYear = document.getElementById("movie-year");
    const movieListContainer = document.getElementById("movie-list");
  
    // Sua chave da API
    const key = "f5c81df4"; 
  
    // Recuperar a lista de filmes armazenada no localStorage (se existir)
    let movieList = JSON.parse(localStorage.getItem("movieList")) || [];
  
    // Função para salvar a lista no localStorage
    function saveMovieList() {
      localStorage.setItem("movieList", JSON.stringify(movieList));
    }
  
    // Atualizar a interface do usuário com a lista de filmes armazenada
    function updateUI() {
      movieListContainer.innerHTML = ""; // Limpar o conteúdo atual
  
      movieList.forEach(movieObject => {
        movieListContainer.innerHTML += `
          <article>
            <img src="${movieObject.Poster}" alt="Poster de ${movieObject.Title}" />
            <button class="remove-button" data-id="${movieObject.Title}">
              <i class="bi bi-trash"></i> Remover
            </button>
          </article>
        `;
      });
  
      // Adicionar os event listeners de "Remover"
      document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", removeMovie);
      });
    }
  
    async function searchButtonClickHandler() {
      try {
        // URL da API com a chave fornecida
        let url = `https://www.omdbapi.com/?apikey=${key}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
        
        console.log("URL gerada:", url);
        const response = await fetch(url);
        const data = await response.json();
        console.log("data: ", data);
  
        if (data.Response === "True") {
          overlay.classList.add("open");
          createModal(data); // Exibe o modal com as informações do filme
  
          // Atualiza o conteúdo do modal com as informações do filme
          document.getElementById("movie-title").innerText = data.Title;
          document.getElementById("movie-plot").innerText = data.Plot;
          document.getElementById("movie-poster").src = data.Poster;
        } else {
          console.error("Filme não encontrado:", data.Error);
          alert("Filme não encontrado!");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  
    function movieNameParameterGenerator() {
      if (movieName.value === '') {
        throw new Error('O nome do filme deve ser informado');
      }
      return movieName.value.split(' ').join('+');
    }
  
    function movieYearParameterGenerator() {
      if (movieYear.value === '') {
        return '';
      }
      if (movieYear.value.length !== 4 || Number.isNaN(Number(movieYear.value))) {
        throw new Error('Ano inválido.');
      }
      return `&y=${movieYear.value}`;
    }
  
    function addToList(movieObject) {
      movieList.push(movieObject); // Adiciona o filme à lista
      saveMovieList(); // Salva a lista no localStorage
      updateUI(); // Atualiza a UI
    }
  
    // Função para remover um filme da lista
    function removeMovie(event) {
      const movieTitle = event.target.closest(".remove-button").getAttribute("data-id");
  
      // Confirmação de remoção
      if (confirm("Tem certeza que deseja remover este filme da sua lista?")) {
        movieList = movieList.filter(movie => movie.Title !== movieTitle); // Remove o filme da lista
        saveMovieList(); // Atualiza o localStorage
        updateUI(); // Atualiza a UI
      } else {
        console.log("Remoção cancelada");
      }
    }
  
    // Adiciona o event listener para o botão de pesquisa
    searchButton.addEventListener("click", searchButtonClickHandler);
  
    // Função para criar o modal com as informações do filme
    function createModal(data) {
      const modalContainer = document.getElementById("modal-container");
      modalContainer.innerHTML = `
        <h2 id="movie-title">${data.Title}</h2>
        <img id="movie-poster" src="${data.Poster}" alt="Poster do Filme" />
        <p id="movie-plot"><strong>Sinopse:</strong> ${data.Plot}</p>
        <p id="movie-year"><strong>Ano:</strong> ${data.Year}</p>
        <p id="movie-director"><strong>Diretor:</strong> ${data.Director}</p>
        <p id="movie-actors"><strong>Elenco:</strong> ${data.Actors}</p>
        <p id="movie-genre"><strong>Gênero:</strong> ${data.Genre}</p>
        <p id="movie-runtime"><strong>Duração:</strong> ${data.Runtime}</p>
        <button id="add-to-list">Adicionar à Lista</button>
      `;
  
      // Adiciona o evento para adicionar o filme à lista
      document.getElementById("add-to-list").addEventListener("click", function() {
        addToList(data); // Adiciona o filme à lista
        overlay.classList.remove("open"); // Fecha o modal após adicionar
      });
    }
  
    // Inicializa a UI com os filmes salvos (se houver)
    updateUI();
  });
  