const BASE_URL = "http://localhost:8000/api/v1/titles/"
const GENRE_FILTER = "genre="
const SORT_BY_RATING = "sort_by=-imdb_score"
const PAGE_FILTER = "page="
const GENRES_LIST = ["BEST", "Animation", "Comedy", "Sci-Fi"]
const BEST_MOVIE_IMAGE = document.querySelector("#best_movie > img")
const MODAL = document.getElementById("modal")
const MODAL_CLOSE_BUTTON = document.querySelector("#modal-header > div > button")
const MODAL_BACKGROUND = document.getElementById("modal-background")
const ALL_IMAGES = document.querySelectorAll("img")
const INFOS_BUTTON = document.querySelector("#best_movie > div > button")

/*
Gestion et affichage du meilleur film en haut de page
*/

function getBestMovieTitleDescription() {
    /* Va chercher dans l'API le meilleur film et permet d'afficher
    en premier élément de page, le titre et la description associés */

    const moviesByRatingUrl = BASE_URL + "?" + SORT_BY_RATING

    const bestMovieTitle = document.querySelector("#best_movie > div > a")
    const bestMovieDescription = document.getElementById("description")

    fetch(moviesByRatingUrl).then(function(res) {
        return res.json()
    }).then(function(data){
        // Sélection du premier élément qui correspond au meilleur film
        bestMovieUrl = data["results"][0]["url"]
        fetch(bestMovieUrl).then(function(res) {
            return res.json()
        }).then(function(data){
            // Récupération du titre et de la description courte pour l'incorporer au code HTML
            const dbTitle = data["title"]
            const dbDescription = data["description"]
            bestMovieTitle.innerHTML = dbTitle
            bestMovieDescription.innerHTML = dbDescription
        })
    })
}

getBestMovieTitleDescription()

/*
Remplacement des images dans chaque catégorie
*/

function replaceImage(genre, fetchedFilmIndex, newImage) {
    /* Permet d'afficher l'image d'un film sur le site, et d'ajouter en attribut l'identifiant unique du film */

    let page = ""

    // Récupération de la bonne page dans l'API en fonction de l'index du film
    // (l'API ne peut afficher que 5 films par page)
    if (fetchedFilmIndex < 5) {
        page = "1"
    } else {
        page = Math.ceil((fetchedFilmIndex + 1) / 5)
        fetchedFilmIndex = fetchedFilmIndex % 5
    }
    let moviesByGenreUrl = BASE_URL + "?" + SORT_BY_RATING + "&" + PAGE_FILTER + page
    if (genre != "BEST") {
        moviesByGenreUrl += "&"+ GENRE_FILTER + genre
    }

    fetch(moviesByGenreUrl).then(function(res) {
        return res.json()
    }).then(function(data){
        // Récupération de l'image et de l'identifiant unique du film
        const imageUrl = data["results"][fetchedFilmIndex]["image_url"]
        const imageId = data["results"][fetchedFilmIndex]["id"]
        newImage.src = imageUrl
        newImage.setAttribute("data-id", imageId)
    })
}

replaceImage("BEST", 0, BEST_MOVIE_IMAGE)

function replaceImagesInGenre(genre, htmlImagesByGenre) {
    /* Pour chaque film d'une catégorie donnée, permet d'afficher l'image associée sur le site */
    htmlImagesByGenre.forEach((image, index) => {
        // Pour la catégorie des meilleurs films, retire le 1er film qui est déjà affichée en haut de page
        if (genre == "BEST") {
            index += 1
        }
        replaceImage(genre, index, image)
    })
}

GENRES_LIST.forEach(function(genre) {
    /* Applique l'affichage des images de film par catégorie, pour chacune d'entre elle */
    const htmlImagesByGenre = document.querySelectorAll(`#${genre} > .cat-row > .slider > img`)
    replaceImagesInGenre(genre, htmlImagesByGenre)
})

/*
Sliders des meilleurs films pour toutes les catégories
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Définition d'une variable pour chaque compteur de clique en fonction de leur catégorie
let bestRatedClickCount = 0
let animationClickCount = 0
let comedyClickCount = 0
let scifiClickCount = 0

async function slideAnimation(action, imagesListByGenre, genre, clickCount){
    /* Permet d'activer puis de réactiver les images affichés
    pour que l'animation du carroussel puisse se lancer à chaque chargement de nouvelles images */

    imagesListByGenre.forEach((image) => {
        image.classList.remove("active")
    })
    newClickCount = action(imagesListByGenre, genre, clickCount)
    await sleep(150)
    imagesListByGenre.forEach((image) => {
        image.classList.add("active")
    })
    // Renvoie le nombre de clique suite à l'application de la fonction "action" qui l'incrémente ou le décrémente
    return newClickCount
}

function previousMoviesSelection(imagesListByGenre, genre, clickCount) {
    /* Permet d'appliquer le changement des images et de récupérer les identifiants des 7 films précédents
    et de décrémenter le compteur de clique de -1 */
    if (clickCount > 0) {
        clickCount -= 1
        imagesListByGenre.forEach((image, index) => {
            if (genre === "BEST") {
                index += 1;
            }
            replaceImage(genre, index+=(7 * clickCount), image)

        })
    } else {
    // Si le compteur de clique est à zéro, aucun changement d'image n'est effectué
    console.log("On est au début")
    }
    return clickCount
}

function nextMoviesSelection(imagesListByGenre, genre, clickCount) {
    /* Permet d'appliquer le changement des images ,de récupérer les identifiants des 7 films suivants
    et d'incrémenter le compteur de clique de +1 */
    clickCount += 1
    imagesListByGenre.forEach((image, index) => {
        index += (7 * clickCount)
        if (genre === "BEST") {
            index += 1;
        }
        replaceImage(genre, index, image)
    })
    return clickCount
}

// Définition de variable appartenant à chaque catégorie/carroussel
let sliders = [{
    querySelector: "#BEST > .cat-row",
    genre: "BEST",
    clickCount: bestRatedClickCount
}, {
    querySelector: "#Animation > .cat-row",
    genre: "Animation",
    clickCount: animationClickCount
}, {
    querySelector: "#Comedy > .cat-row",
    genre: "Comedy",
    clickCount: comedyClickCount
}, {
    querySelector: "#Sci-Fi > .cat-row",
    genre: "Sci-Fi",
    clickCount: scifiClickCount
}]


sliders.forEach(function(slider) {
    /* Permet d'appliquer le changement des images du carroussel à chaque clique sur les boutons flèches */

    const imagesListByGenre = document.querySelectorAll(`${slider["querySelector"]} > .slider > img`)

    const genreButtonPrevious = document.querySelector(`${slider["querySelector"]} > button.previous`)
    genreButtonPrevious.addEventListener("click", function() {
        slideAnimation(previousMoviesSelection, imagesListByGenre, slider["genre"], slider["clickCount"]).then(response => {
            slider["clickCount"] = response;
            console.log(slider["clickCount"]);
        })
    })

    const genreButtonNext = document.querySelector(`${slider["querySelector"]} > button.next`)
    genreButtonNext.addEventListener("click", function() {
        slideAnimation(nextMoviesSelection, imagesListByGenre, slider["genre"], slider["clickCount"]).then(response => {
            slider["clickCount"] = response;
            console.log(slider["clickCount"]);
        })
    })
})

/*
Gestion fenêtre modale
*/


MODAL_CLOSE_BUTTON.addEventListener("click", function() {
    /* Permet de fermer la fenêtre modale en cliquant sur la croix */
    MODAL.style.display = "none";
    MODAL_BACKGROUND.style.display = "none";
})

function getMovieInfosModal(data) {
    /* Permet de récupérer toutes les informations nécessaires pour l'inclure dans la fenêtre modale */
    const title = document.getElementById("modal-title")
    title.innerHTML = data["title"]
    const image = document.querySelector("#modal-image > img")
    image.src = data["image_url"]
    const genre = document.getElementById("genre")
    genre.innerHTML = "Genres: " + data["genres"]
    const release = document.getElementById("release")
    release.innerHTML = "Date de sortie: " + data["date_published"]
    const rated = document.getElementById("rate")
    rated.innerHTML = "Rated: " + data["rated"]
    const score = document.getElementById("imdb-score")
    score.innerHTML = "Score IMBD: " + data["imdb_score"]
    const directors = document.getElementById("director")
    director.innerHTML = "Réalisateur: " + data["directors"]
    const actors = document.getElementById("actors")
    actors.innerHTML = "Liste des acteurs: " + data["actors"]
    const duration = document.getElementById("duration")
    duration.innerHTML = "Durée du film: " + data["duration"]
    const origin = document.getElementById("origin")
    origin.innerHTML = "Pays d'origine: " + data["countries"]
    const boxOffice = document.getElementById("box-office")
    boxOffice.innerHTML = "Résultat au Box Office: " + data["avg_vote"]
    const description = document.getElementById("long_description")
    description.innerHTML = "Description:<br/>" + data["long_description"]
}

ALL_IMAGES.forEach((image) => {
    /* Active la fenêtre modale et applique la récupération des informations du film qui corresponds
    à l'image sur laquelle l'utilisateur a cliqué */
    image.addEventListener("click", function() {
        MODAL.style.display = "block";
        MODAL_BACKGROUND.style.display = "block";
        const id = image.getAttribute("data-id")
        fetch(`${BASE_URL}${id}`).then(function(res) {
            return res.json()
        }).then(function(data){
            getMovieInfosModal(data)
        })
    })
})

INFOS_BUTTON.addEventListener("click", function() {
    /* Active la fenêtre modale et applique la récupération des informations du meilleur film */
    MODAL.style.display = "block";
    MODAL_BACKGROUND.style.display = "block";
    const id = BEST_MOVIE_IMAGE.getAttribute("data-id")
    fetch(`${BASE_URL}${id}`).then(function(res) {
        return res.json()
    }).then(function(data){
        getMovieInfosModal(data)
    })
})
