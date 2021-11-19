let newServiceWorker;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("service-worker.js", {scope: 'cristina-hernandez'})
      .then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;

          newServiceWorker.addEventListener("statechange", () => {
            /* if (newServiveWorker.state === 'installed') {

            } */

            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
                break;
            }
          });
        });
      });
  });
}

function showSnackbarUpdate() {
  let x = document.getElementById("snackbar");

  x.className = "show";
}

let launchUpdate = document.getElementById("launchUpdate");
launchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.reload();
});

let d, $form, $loader, $err, $main, $pelicula, $error, $recomendaciones;

d = document;
($form = d.getElementById("movie-search")),
  ($error = d.querySelector(".error")),
  ($main = d.querySelector("main")),
  ($pelicula = d.querySelector(".pelicula")),
  ($recomendaciones = d.querySelector(".recomendaciones"));

$form.addEventListener("load", (e) => {
  e.preventDefault();
  try {
    let $movieTemplate = "",
      movieApi = `https://api.themoviedb.org/3/discover/movie?api_key=febc14d2716b230c191591b003084059&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`,
      movieFetch = fetch(movieApi),
      movieRes = await Promise.resolve(movieFetch),
      movieData = await movieRes.json();

    console.log(movieData.results);

    if (movieData.results !== null) {
      for (let i = 0; i < movieData.results.length; i++) {
        let mov = movieData.results[i];
        $movieTemplate =
          $movieTemplate +
          `

          <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="https://image.tmdb.org/t/p/w500/${mov.poster_path}" class="img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${mov.title}</h5>
                  <p class="card-text">${mov.overview}</p>
                  <p class="card-text"><small class="text-muted">Votos: ${mov.vote_average} - ${mov.vote_count}</small></p>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <br>
      `;
      }
      $recomendaciones.innerHTML = $movieTemplate;
    }
  } catch (error) {
    console.log(error);
    let message = error.statusText || "Ocurrio un error";
    $error.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
    $loader.style.display = "none";
  }
});

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let movie = e.target.movie.value.toLowerCase(),
      $movieTemplate = "",
      movieApi = `https://api.themoviedb.org/3/search/movie?api_key=febc14d2716b230c191591b003084059&language=en-US&query=${movie}&page=1&include_adult=false`,
      movieFetch = fetch(movieApi),
      movieRes = await Promise.resolve(movieFetch),
      movieData = await movieRes.json();

    let peli = movieData.results[0];

    console.log(movieData.results);

    if (movieData.results !== null) {
      $movieTemplate = `
                <div class='jumbotron jumbotron-fluid text-center'>
                <div class='container'>
                <h1 class='display-4'>${peli.original_title}</h1>
                <div class='container-sm'>
                <img style="width:300px; height:auto;" class='container-fluid' src="https://image.tmdb.org/t/p/w200${peli.poster_path}" alt="${peli.original_title}">
                </div>
                <p class='lead'>
                    Popularidad: ${peli.popularity}
                </p>
                <p class='lead'>
                    Lancamiento: ${peli.release_date}
                </p>
                <p>
                  Votos: ${peli.vote_average} - ${peli.vote_count}
                </p>
                <p class='lead'>
                   ${peli.original_language} - ${peli.overview} 
                </p></div></div><br><br><br><br>
            `;
    } else {
      $movieTemplate = "<h2>Archivo no encontrado en la bd</h2>";
    }

    $pelicula.innerHTML = $movieTemplate;
  } catch (error) {
    console.log(error);
    let message = error.statusText || "Ocurrio un error";
    $error.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
    $loader.style.display = "none";
  }
});
