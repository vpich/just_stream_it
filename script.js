const BASE_URL = "http://localhost:8000/api/v1/titles/"
const genre_filter = "genre="
const SORT_BY_RATING = "sort_by=-imdb_score"
const PAGE_FILTER = "page="

//A améliorer
//  1 - Gestion slides
//  2 - Gestion fenêtre modale

//A faire
// - récupérer des id de films
// - à partir des id récupérés, extraire les infos du film concerné pour l'injecter où il faut

const genre_list = ["best_rated", "Animation", "Comedy", "Sci-Fi"]

//
//Gestion et affichage du meilleur film en haut de page
//

const best_movie_image = document.querySelector("#best_movie > img")
const best_movie_title = document.querySelector("#best_movie > div > a")
const best_movie_description = document.getElementById("description")

function get_best_movie_info() {
    const url = BASE_URL + "?" + SORT_BY_RATING

    fetch(url).then(function(res) {
        return res.json()
    }).then(function(data){
        best_movie_url = data["results"][0]["url"]
        fetch(best_movie_url).then(function(res) {
            return res.json()
        }).then(function(data){
            const db_title = data["title"]
            const db_description = data["description"]
            title.innerHTML = db_title
            description.innerHTML = db_description
        })
    })
}

get_best_movie_info()
replaceImage("", 0, best_movie_image)

//
// Remplacement des images dans chaque catégorie
//

function replaceImage(genre, fetchedFilmIndex, new_image) {

    let page = ""

    if (fetchedFilmIndex < 5) {
        page = "1"
    } else {
        page = Math.ceil((fetchedFilmIndex + 1) / 5)
        fetchedFilmIndex = fetchedFilmIndex % 5
    }
    let genres_url = BASE_URL + "?" + genre_filter + genre + "&" + SORT_BY_RATING + "&" + PAGE_FILTER + page

    fetch(genres_url).then(function(res) {
        return res.json()
    }).then(function(data){
        for (movie in data) {
            const image_url = data["results"][fetchedFilmIndex]["image_url"]
            const image_id = data["results"][fetchedFilmIndex]["id"]
            new_image.src = image_url
            new_image.setAttribute("data-id", image_id)
        }
    })
}

function replace_images_in_categories(genre, html_images) {
    html_images.forEach((image, index) => {
        replaceImage(genre, index, image)
    })
}

genre_list.forEach(function(genre) {
    const html_images = document.querySelectorAll(`#${genre} > .cat-row > .slider > img`)
    if (genre == "best_rated") {
        replace_images_in_categories("", html_images)
    } else {
        replace_images_in_categories(genre, html_images)
    }
})

//
//Slide des meilleurs films
//
const best_movies = document.querySelectorAll(`#best_rated > .cat-row > .slider > img`)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let best_rated_click = 0
let animation_click = 0
let comedy_click = 0
let scifi_click = 0

async function slide_animation(action, genre, genre_str, category_click){
    genre.forEach((image) => {
        image.classList.remove("active")
    })
    action(genre, genre_str, category_click)
    await sleep(150)
    genre.forEach((image) => {
        image.classList.add("active")
    })
}

function previous_movies_selection(genre, genre_str, category_click) {
    if (category_click > 0) {
        category_click -= 1
        genre.forEach((image, index) => {
            replaceImage(genre_str, index+=(7 * category_click), image)
        })
    } else {
    console.log("On est au début")
    }
}

function next_movies_selection(genre, genre_str, category_click) {
    category_click += 1
    genre.forEach((image, index) => {
        replaceImage(genre_str, index+=(7 * category_click), image)
    })
    console.log(category_click)
}

const best_movies_button_previous = document.querySelector("#best_rated > .cat-row > button.previous")
best_movies_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, best_movies, "", best_rated_click)
})

const best_movies_button_next = document.querySelector("#best_rated > .cat-row > button.next")
best_movies_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, best_movies, "", best_rated_click)
})

//
//Slide des films d'animation
//
const animation = document.querySelectorAll("#Animation > .cat-row > .slider > img")

const animation_button_previous = document.querySelector("#Animation > .cat-row > button.previous")
animation_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, animation, "Animation", animation_click)
})

const animation_button_next = document.querySelector("#Animation > .cat-row > button.next")
animation_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, animation, "Animation", animation_click)
})

//
// Slides des comédies
//

const comedy = document.querySelectorAll("#Comedy > .cat-row > .slider > img")

const comedy_button_previous = document.querySelector("#Comedy > .cat-row > button.previous")
comedy_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, comedy, "Comedy", comedy_click)
})

const comedy_button_next = document.querySelector("#Comedy > .cat-row > button.next")
comedy_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, comedy, "Comedy", comedy_click)
})
//
// Slides des Sci-Fi
//

const sci_fi = document.querySelectorAll("#Sci-Fi > .cat-row > .slider > img")

const sci_fi_button_previous = document.querySelector("#Sci-Fi > .cat-row > button.previous")
sci_fi_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, sci_fi, "Sci-Fi", scifi_click)
})

const sci_fi_button_next = document.querySelector("#Sci-Fi > .cat-row > button.next")
sci_fi_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, sci_fi, "Sci-Fi", scifi_click)
})

//let sliders = [{
//    querySelector: "#best_rated > .cat-row",
//    name: ""
//}, {
//    querySelector: "#Animation > .cat-row",
//    name: "Animation"
//}, {
//    querySelector: "#Comedy > .cat-row",
//    name: "Comedy"
//}, {
//    querySelector: "#Sci-Fi > .cat-row",
//    name: "Sci-Fi"
//}]
//
//
//sliders.forEach(function(slider) {
//    const genre = document.querySelectorAll(`#${"querySelector"} > .slider > img`)
//
//    const genre_button_previous = document.querySelector(`${slider["querySelector"]} > button.previous`)
//    genre_button_previous.addEventListener("click", function() {
//        slide_animation(previous_movies_selection, genre, slider["name"], best_rated_click)
//    })
//
//    const genre_button_next = document.querySelector(`${slider["querySelector"]} > button.next`)
//    genre_button_next.addEventListener("click", function() {
//        slide_animation(next_movies_selection, genre, slider["name"], best_rated_click)
//    })
//})

//
// Gestion fenêtre modale
//

const best_movie_button = document.querySelector("#best_movie > div > button")
const modal = document.getElementById("modal")
const modal_button = document.querySelector("#modal-header > div > button")

best_movie_button.addEventListener("click", function() {
    modal.style.display = "block";
})

modal_button.addEventListener("click", function() {
    modal.style.display = "none";
})

const all_images = document.querySelectorAll("img")

all_images.forEach((image) => {
    image.addEventListener("click", function() {
        modal.style.display = "block";
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