// Récupération des miniatures pour film

//const best_movie_miniature = document.getElementById("")
//const category_1_miniature = document.querySelector("")

//http://localhost:8000/api/v1/titles/?genre=animation
//http://localhost:8000/api/v1/titles/?imdb_score=&genre=animation

//A faire
//  1 - Gestion slides
//  2 - Gestion bouton play
//  3 - Gestion fenêtre modale

const image_test = document.getElementById("image-test")

//Permets de récupérer les id de toutes les sections de la page HTML
const all_genres = document.getElementsByTagName("section")
console.log(all_genres)
for (var i = 0; i < all_genres.length; i++) {
    console.log(all_genres[i].id)
}

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

let num_incr = 0

//for (movie in movies_by_category) {
//    num_incr += 1
//    let str_num = num_incr.toString()
//    let new_image = "image-test" + str_num
////    let genre =
//}



function get_genre(url) {

}

function get_movies_by_category(api_url_by_categories) {
    fetch(api_url_by_categories).then(function(res) {
        return res.json()
    })
}

function get_movie_image(movie) {
    image_url = movie["results"][i]["image_url"]
    console.log(image_url)
    new_image.src = image_url
}

//function replace_images(api_url_by_categories, i, new_image) {
//    fetch(api_url_by_categories).then(function(res) {
//        return res.json()
//    }).then(function(movie){
//        image_url = movie["results"][i]["image_url"]
//        console.log(image_url)
//        new_image.src = image_url
//    })
//}

fetch("http://localhost:8000/api/v1/titles/?imdb_score=&genre=animation").then(function(res) {
    return res.json()
}).then(function(data){
    for (movie in data) {

    }
})