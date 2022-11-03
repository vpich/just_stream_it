// Récupération des miniatures pour film

const BASE_URL = "http://localhost:8000/api/v1/titles/"
const genre_filter = "genre="
const rating_filter = "imdb_score="
const SORT_BY_RATING = "sort_by=-imdb_score"
const PAGE_FILTER = "page="

//A faire
//  1 - Gestion slides
//  2 - Gestion fenêtre modale

const genre_list = ["animation", "comedy", "fantasy"]

//for (movie in movies_by_category) {
//    num_incr += 1
//    let str_num = num_incr.toString()
//    let new_image = "image-test" + str_num
////    let genre =
//}

function replaceImages(genre, fetchedFilmIndex, new_image) {

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
        replaceImages(genre, index, image)
    })
}

genre_list.forEach(function(genre) {
    const html_images = document.querySelectorAll(`#${genre} > .cat-row > .slider > img`)
    replace_images_in_categories(genre, html_images)
})

const best_movies = document.querySelectorAll(`#best_rated > .cat-row > .slider > img`)
replace_images_in_categories("", best_movies)

const best_movies_button = document.querySelector("#best_rated > .cat-row > button.next")

best_movies_button.addEventListener("click", function() {
    best_movies.forEach((image, index) => {
        replaceImages("", index+=7, image)
    })
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