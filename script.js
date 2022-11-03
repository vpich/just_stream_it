// Récupération des miniatures pour film

//const best_movie_miniature = document.getElementById("")
//const category_1_miniature = document.querySelector("")
const BASE_URL = "http://localhost:8000/api/v1/titles/"
const genre_filter = "genre="
const rating_filter = "imdb_score="
const SORT_BY_RATING = "sort_by=-imdb_score"

//http://localhost:8000/api/v1/titles/?genre=animation
//http://localhost:8000/api/v1/titles/?imdb_score=&genre=animation

//A faire
//  1 - Gestion slides
//  2 - Gestion fenêtre modale

const image_test = document.getElementById("image-test")

const all_sections = document.getElementsByTagName("section")

//Permets de récupérer les id de toutes les sections de la page HTML pour avoir le genre
//function getGenreInHtml(all_sections) {
//    let sections = []
//    for (var i = 0; i < all_sections.length; i++) {
//        let add_section_id = sections.push(all_sections[i].id)
//    }
//    let genres = []
//    sections.forEach(function(item) {
//        if (item.startsWith("best")) {
//            console.log("rien")
//        } else {
//            let add_genre = genres.push(item)
//        }
//    })
//    return genres
//}

const genre_list = ["animation", "comedy", "fantasy"]

//Remplace la première image de la section "meilleurs films" par une image test depuis l'API
fetch("http://localhost:8000/api/v1/titles/").then(function(res){
    return res.json()
}).then(function(image){
    const image_url = image["results"][2]["image_url"]
    image_test.src=image_url
})

//Pour chaque block image dans la div class slider
//    let num_incr = 1
//    let image_a_rendre = "image-test" + num_incr
//    let genre = récupérer le genre de la partie concernée
//    fetch(lien qui trie selon le genre défini).then(function(blop) {
//        return blop.json()
//    }).then(function(blip){
//        image_url = blip[results][]["image_url"]
//        image_a_rendre.src=image_url
//    })

//for (movie in movies_by_category) {
//    num_incr += 1
//    let str_num = num_incr.toString()
//    let new_image = "image-test" + str_num
////    let genre =
//}

function replaceImages(genre, fetchedFilmIndex, new_image) {
    let genres_url = BASE_URL + "?" + genre_filter + genre + "&" + SORT_BY_RATING

    fetch(genres_url).then(function(res) {
        return res.json()
    }).then(function(data){
        for (movie in data) {
            const image_url = data["results"][fetchedFilmIndex]["image_url"]
            new_image.src = image_url
        }
    })
}


let html_images = document.querySelectorAll("#animation > .cat-row > .slider > img")
console.log(html_images)

function replace_images_in_categories(genre, html_images) {
    html_images.forEach((image, index) => {
        console.log(image)
        const image_to_replace = image
        replaceImages(genre, index, image_to_replace)
    })
}

//replace_images_in_categories(html_images)

//let genre_list = getGenreInHtml(all_sections)
genre_list.forEach(function(genre) {
//    let genre = genre_in_list
    const html_images = document.querySelectorAll(`#${genre} > .cat-row > .slider > img`)
    replace_images_in_categories(genre, html_images)
})

for (let pas = 0; pas < 5; pas++) {
    let genre = genre_list[0]
//    let html_image = document.querySelectorAll("img.slider")
//    console.log(html_image)
//    replace_images(genre, pas, )
}

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