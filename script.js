// Récupération des miniatures pour film

const BASE_URL = "http://localhost:8000/api/v1/titles/"
const genre_filter = "genre="
const SORT_BY_RATING = "sort_by=-imdb_score"
const PAGE_FILTER = "page="

//A améliorer
//  1 - Gestion slides
//  2 - Gestion fenêtre modale

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
            new_image.src = image_url
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

async function slide_animation(action, genre, genre_str){
    genre.forEach((image) => {
        image.classList.remove("active")
    })
    action(genre, genre_str)
    await sleep(250)
    genre.forEach((image) => {
        image.classList.add("active")
    })
}

let number_click = 0

function previous_movies_selection(genre, genre_str) {
    if (number_click > 0) {
        number_click -= 1
        genre.forEach((image, index) => {
            replaceImage(genre_str, index+=(7 * number_click), image)
        })
    } else {
    console.log("On est au début")
    }
}

function next_movies_selection(genre, genre_str) {
    number_click += 1
    genre.forEach((image, index) => {
        replaceImage(genre_str, index+=(7 * number_click), image)
    })
    console.log(number_click)
}

const best_movies_button_previous = document.querySelector("#best_rated > .cat-row > button.previous")
best_movies_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, best_movies, "")
})

const best_movies_button_next = document.querySelector("#best_rated > .cat-row > button.next")
best_movies_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, best_movies, "")
})

//
//Slide des films d'animation
//
const best_animation = document.querySelectorAll("#Animation > .cat-row > .slider > img")

const best_animation_button_previous = document.querySelector("#Animation > .cat-row > button.previous")
best_animation_button_previous.addEventListener("click", function() {
    slide_animation(previous_movies_selection, best_animation, "Animation")
})

const best_animation_button_next = document.querySelector("#Animation > .cat-row > button.next")
best_animation_button_next.addEventListener("click", function() {
    slide_animation(next_movies_selection, best_animation, "Animation")
})

//let animation_page = 1
//let animation_films = []
//const films = fetch...
//animation_films.push(films)
//bouton_suivant.addEventListener(click, function() {
//    animation_page += 1
//    next_films = fetch... en utilisant animation_page
//    animation_films.push(next_films)
//    replace_images() : à partir de animation_films et animation_page, savoir lesquels mettre
//})

//
// Gestion fenêtre modale
//

const best_movie_button = document.querySelector("#best_movie > div > button")
const modal = document.getElementById("modal")
const modal_button = document.querySelector("#modal > button")

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
    })
})
