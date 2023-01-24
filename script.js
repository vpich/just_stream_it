const BASE_URL = "http://localhost:8000/api/v1/titles/"
const GENRE_FILTER = "genre="
const SORT_BY_RATING = "sort_by=-imdb_score"
const PAGE_FILTER = "page="

const genre_list = ["BEST", "Animation", "Comedy", "Sci-Fi"]

/*
Gestion et affichage du meilleur film en haut de page
*/

const best_movie_image = document.querySelector("#best_movie > img")
const best_movie_title = document.querySelector("#best_movie > div > a")
const best_movie_description = document.getElementById("description")

function getBestMovieInfo() {
    // Va chercher dans l'API, depuis la 1ère page des films triés selon leur score IMDB,
    // et permet d'afficher dans l'HTML en premier élément de page, le meilleur film avec son titre et sa description

    const url = BASE_URL + "?" + SORT_BY_RATING

    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        // Sélection du premier film après l'application du filtre
        best_movie_url = data["results"][0]["url"]
        fetch(best_movie_url).then(function(res) {
            return res.json()
        }).then(function(data){
            // Récupération du titre et de la description courte pour l'incorporer au code HTML
            const db_title = data["title"]
            const db_description = data["description"]
            title.innerHTML = db_title
            description.innerHTML = db_description
        })
    })
}

getBestMovieInfo()

/*
Remplacement des images dans chaque catégorie
*/

function replaceImage(genre, fetchedFilmIndex, new_image) {
    // Permet d'afficher l'image d'un film sur le site, et d'ajouter en attribut l'identifiant unique du film

    let page = ""

    // Permets de récupérer la bonne page dans l'API en fonction de l'index du film
    // (l'API ne peut afficher que 5 films par page)
    if (fetchedFilmIndex < 5) {
        page = "1"
    } else {
        page = Math.ceil((fetchedFilmIndex + 1) / 5)
        fetchedFilmIndex = fetchedFilmIndex % 5
    }
    let genres_url = BASE_URL + "?" + SORT_BY_RATING + "&" + PAGE_FILTER + page
    if (genre != "BEST") {
        genres_url += "&"+ GENRE_FILTER + genre
    }

    fetch(genres_url).then(function(res) {
        return res.json()
    }).then(function(data){
        // Récupération de l'image et de l'identifiant unique du film
        const image_url = data["results"][fetchedFilmIndex]["image_url"]
        const image_id = data["results"][fetchedFilmIndex]["id"]
        new_image.src = image_url
        new_image.setAttribute("data-id", image_id)
    })
}

replaceImage("BEST", 0, best_movie_image)

function replaceImagesInCategories(genre, html_images) {
    // Pour chaque film d'une catégorie donnée, permet d'afficher l'image associée sur le site
    html_images.forEach((image, index) => {
        // Pour la catégorie des meilleurs films, retire le 1er film qui est déjà affichée en haut de page
        if (genre == "BEST") {
            index += 1
        }
        replaceImage(genre, index, image)
    })
}

genre_list.forEach(function(genre) {
    // Applique l'affichage d'image par catégorie pour chacune d'entre elle
    const html_images = document.querySelectorAll(`#${genre} > .cat-row > .slider > img`)
    replaceImagesInCategories(genre, html_images)
})

/*
Sliders des meilleurs films pour toutes les catégories
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Définition d'une variable pour chaque compteur de clique en fonction de leur catégorie
let best_rated_click = 0
let animation_click = 0
let comedy_click = 0
let scifi_click = 0

async function slideAnimation(action, images_list, genre_str, category_click){
    // Permet d'activer puis de réactiver les images affichés
    // pour que l'animation du carroussel puisse se lancer à chaque chargement de nouvelles images

    images_list.forEach((image) => {
        image.classList.remove("active")
//        image.src = "images/film-1.jpg"
    })
    number_click = action(images_list, genre_str, category_click)
    await sleep(150)
    images_list.forEach((image) => {
        image.classList.add("active")
    })
    // Renvoie le nombre de clique suite à l'application de la fonction "action" qui l'incrémente ou le décrémente
    return number_click
}

function previousMoviesSelection(genre, genre_str, category_click) {
    // Permet d'appliquer le changement des images et de récupérer les identifiants des 7 films précédents
    // et de décrémenter le compteur de clique de -1
    if (category_click > 0) {
        category_click -= 1
        genre.forEach((image, index) => {
            if (genre_str === "BEST") {
                index += 1;
            }
            replaceImage(genre_str, index+=(7 * category_click), image)

        })
    } else {
    // Si le compteur de clique est à zéro, aucun changement d'image n'est effectué
    console.log("On est au début")
    }
    return category_click
}

function nextMoviesSelection(images_list, genre_str, category_click) {
    // Permet d'appliquer le changement des images et de récupérer les identifiants des 7 films suivants
    // et d'incrémenter le compteur de clique de +1
    category_click += 1
    images_list.forEach((image, index) => {
        index += (7 * category_click)
        if (genre_str === "BEST") {
            index += 1;
        }
        replaceImage(genre_str, index, image)
    })
    return category_click
}

// Définition de variable appartenant à chaque catégorie/carroussel
let sliders = [{
    querySelector: "#BEST > .cat-row",
    name: "BEST",
    category_click: best_rated_click
}, {
    querySelector: "#Animation > .cat-row",
    name: "Animation",
    category_click: animation_click
}, {
    querySelector: "#Comedy > .cat-row",
    name: "Comedy",
    category_click: comedy_click
}, {
    querySelector: "#Sci-Fi > .cat-row",
    name: "Sci-Fi",
    category_click: scifi_click
}]


sliders.forEach(function(slider) {
    const images_list = document.querySelectorAll(`${slider["querySelector"]} > .slider > img`)

    const genre_button_previous = document.querySelector(`${slider["querySelector"]} > button.previous`)
    genre_button_previous.addEventListener("click", function() {
        slideAnimation(previousMoviesSelection, images_list, slider["name"], slider["category_click"]).then(response => {
            slider["category_click"] = response
            console.log(slider["category_click"])
        })
    })

    const genre_button_next = document.querySelector(`${slider["querySelector"]} > button.next`)
    genre_button_next.addEventListener("click", function() {
        slideAnimation(nextMoviesSelection, images_list, slider["name"], slider["category_click"]).then(response => {
            slider["category_click"] = response;
            console.log(slider["category_click"]);
        })
    })
})

//
// Gestion fenêtre modale
//

const best_movie_button = document.querySelector("#best_movie > div > button")
const modal = document.getElementById("modal")
const modal_button = document.querySelector("#modal-header > div > button")
const modal_background = document.getElementById("modal-background")

best_movie_button.addEventListener("click", function() {
    modal.style.display = "block";
    modal_background.style.display = "block";
})

modal_button.addEventListener("click", function() {modal_background.display = "block";
    modal.style.display = "none";
    modal_background.style.display = "none";
})

const all_images = document.querySelectorAll("img")

all_images.forEach((image) => {
    image.addEventListener("click", function() {
        modal.style.display = "block";
        modal_background.style.display = "block";
        const id = image.getAttribute("data-id")
        fetch(`${BASE_URL}${id}`).then(function(res) {
            return res.json()
        }).then(function(data){
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
            const box_office = document.getElementById("box-office")
            box_office.innerHTML = "Résultat au Box Office: " + data["avg_vote"]
            const description = document.getElementById("long_description")
            description.innerHTML = "Description:<br/>" + data["long_description"]

        })
    })
})

//dictionnaire_pour_modale = [
//    "title",
//    "image_url",
//    "genres",
//    "date_published",
//    "rated",
//    "imdb_score",
//    "directors",
//    "actors",
//    "duration",
//    "countries",
//    "avg_vote",
//    "long_description"
//]

const infos_button = document.querySelector("#best_movie > div > button")

infos_button.addEventListener("click", function() {
    modal.style.display = "block";
    modal_background.style.display = "block";
    const id = best_movie_image.getAttribute("data-id")
    fetch(`${BASE_URL}${id}`).then(function(res) {
        return res.json()
    }).then(function(data){
        const title = document.getElementById("modal-title")
        title.innerHTML = data["title"]
        const best_movie_image = document.querySelector("#modal-image > img")
        best_movie_image.src = data["image_url"]
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
        const box_office = document.getElementById("box-office")
        box_office.innerHTML = "Résultat au Box Office: " + data["avg_vote"]
        const description = document.getElementById("long_description")
        description.innerHTML = "Description:<br/>" + data["long_description"]
    })
})