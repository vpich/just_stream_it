// Récupération des miniatures pour film

//const best_movie_miniature = document.getElementById("")
//const category_1_miniature = document.querySelector("")

// Gestion slides

// Gestion bouton play

// Gestion fenêtre modale


async function callApi(url){
    let res = await fetch(url)
    let data = await res.json()
    return data
}

const bouton = document.getElementById("toto")
const para = document.getElementById("tata")
console.log(para)

bouton.addEventListener("click", function(){
    para.innerHTML = "Chargement en cours..."
    console.log("click")
    let data = null
    callApi("https://api.publicapis.org/entries").then(function(data){
//        result = null
//        for (entry of entries) {
//            if (entry["Description"] commence par "collection") {
//                result = entry
//                break
//            }
//        }
        para.innerHTML = data["entries"][0]["Description"]
    })

//    fetch("https://api.publicapis.org/entries").then(function(res){
//        return res.json()
//    }).then(function(data){
//        console.log("salut")
//        console.log(data)
//        const toto = data["entries"][0]
//        console.log(toto)
//        para.innerHTML = toto["Description"]
//    })
})


