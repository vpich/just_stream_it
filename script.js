const BASE_URL = "http://localhost:8000/api/v1/titles/"
const GENRE_FILTER = "genre="
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
//        console.log(page, fetchedFilmIndex)
        fetchedFilmIndex = fetchedFilmIndex % 5
    }
    let genres_url = BASE_URL + "?" + GENRE_FILTER + genre + "&" + SORT_BY_RATING + "&" + PAGE_FILTER + page

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
//Sliders des meilleurs films pour toutes les catégories
//

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
//        image.src = "images/film-1.jpg"
    })
    number_click = action(genre, genre_str, category_click)
    await sleep(150)
    genre.forEach((image) => {
        image.classList.add("active")
    })
    return number_click
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
    return category_click
}

function next_movies_selection(genre, genre_str, category_click) {
    category_click += 1
    genre.forEach((image, index) => {
        replaceImage(genre_str, index+=(7 * category_click), image)
    })
    return category_click
}

let sliders = [{
    querySelector: "#best_rated > .cat-row",
    name: "",
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
    const genre = document.querySelectorAll(`${slider["querySelector"]} > .slider > img`)

    const genre_button_previous = document.querySelector(`${slider["querySelector"]} > button.previous`)
    genre_button_previous.addEventListener("click", function() {
        slide_animation(previous_movies_selection, genre, slider["name"], slider["category_click"]).then(response => {
            slider["category_click"] = response
            console.log(slider["category_click"])
        })
    })

    const genre_button_next = document.querySelector(`${slider["querySelector"]} > button.next`)
    genre_button_next.addEventListener("click", function() {
        slide_animation(next_movies_selection, genre, slider["name"], slider["category_click"]).then(response => {
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

dictionnaire_pour_modale = [
    "title",
    "image_url",
    "genres",
    "date_published",
    "rated",
    "imdb_score",
    "directors",
    "actors",
    "duration",
    "countries",
    "avg_vote",
    "long_description"
]