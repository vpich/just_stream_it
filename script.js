console.log("coucou")

// Récupération des miniatures pour film

//const best_movie_miniature = document.getElementById("")
//const category_1_miniature = document.querySelector("")

// Gestion slides

// Gestion bouton play

// Gestion fenêtre modale

const bouton = document.getElementById("toto")
const para = document.getElementById("tata")
console.log(para)

bouton.addEventListener("click", function(){
    para.innerHTML = "Virginie le retour"
    console.log("click")
})

fetch("https://api.publicapis.org/entries").then(function(res){
    console.log(res.json());
})
