const BASE_URL = 'http://localhost:3000'

window.addEventListener('load', () => {
    getRecipes()
    attachClickToRecipes()
})

function getRecipes(){
    let main = document.querySelector('#container')
    main.innerHTML=''
    let ul= document.createElement('ul')
    main.appendChild(ul)
    fetch(BASE_URL+'/recipes')
    .then(resp => resp.json())
    .then(recipes => {
        ul.innerHTML += recipes.map(recipe => {
            let newRecipe = new RecipeItem(recipe)
            return newRecipe.renderRecipeItem()
        }).join('')
        attachClickToRecipes()
    })  
}

function clearForm(){
    let formDiv = document.querySelector('form')
    formDiv.remove()
}

function attachClickToRecipes(){
    let recipes = document.querySelectorAll('ul a')
    recipes.forEach(recipe => recipe.addEventListener('click', displayRecipe))
}

function displayCreateForm(){
    let recipeFormDiv = document.getElementById('recipe-form')
    let html = `
        <form onsubmit='createRecipe();return false;'>
        <label>Description</label>
        <input type='text' id='description'></input></br>
        <label>Cook Time</label>
        <input type='text' id='time'></input></br>
        <label>Directions</label>
        <input type='text' id='directions'></input></br>
        <input type='submit' value='Create Recipe'></input>
        </form>
    `
    recipeFormDiv.innerHTML = html
}

function createRecipe(){
    event.preventDefault()
    const recipe = {
        description: event.target.description.value,
        time: event.target.time.value,
        directions: event.target.directions.value
    }
    fetch(BASE_URL+'/recipes',{
        method:'POST',
        body: JSON.stringify(recipe),
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    })
    .then(resp => resp.json())
    .then(recipe => {
        let newRecipe = new RecipeItem(recipe)
        document.querySelector('#container ul').innerHTML += newRecipe.renderRecipeItem()
        attachClickToRecipes() 
        clearForm()
    })
}
 
function displayRecipe(){
    event.preventDefault()
    let id = event.target.dataset.id
    let main = document.querySelector('#container')
    main.innerHTML = ''
    fetch(BASE_URL+'/recipes/'+id)
    .then(resp => resp.json())
    .then(recipe => {
        let newRecipe = new RecipeItem(recipe)
        newRecipe.displaySingleRecipe()
    })
}

function displayIngredientForm(){
    event.preventDefault()
    let id = event.target.dataset.id 
    let ingredientFormDiv = document.getElementById('ingredient-form')
    let html = `
        <form onsubmit='addIngredient(${id});return false;'>
        <label>Ingredient</label>
        <input type='text' id='name'></input></br>
        <input type='submit' value='Add Ingredient'></input>
        </form>
    `
    ingredientFormDiv.innerHTML = html
}

function addIngredient(id){
    event.preventDefault()
    const ingredient = {
        description: document.getElementById('name').value,
        }
    fetch(BASE_URL+`/recipes/${id}/ingredients`, {
        method:'POST',
        body: JSON.stringify(ingredient),
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    })
    .then(resp => resp.json())
    .then(ingredient => {
        document.querySelector('#container ul').innerHTML += `
        <li id='${ingredient.id}'>
        ${ingredient.description}
        <button data-id='${id}' data-ref='${ingredient.id}' onClick='removeIngredient()'; return false;>X</button>
        </li>
        `
        clearForm()
    })      
}

function removeRecipe(id) {
    fetch(BASE_URL+`/recipes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    })
    .then(getRecipes)
}

function editRecipe(id){
    fetch(BASE_URL+`/recipes/${id}`)
    .then(resp => resp.json())
    .then(recipe => {
        let recipeFormDiv = document.getElementById('recipe-form')
        let html = `
            <form data-id='${id}'>
            <input type='hidden' id='recipeId' value=${id} ></input>
            <label>Description</label>
            <input type='text' id='description' value='${recipe.description}'></input></br>
            <label>Cook Time</label>
            <input type='text' id='time' value='${recipe.time}'></input></br>
            <label>Directions</label>
            <input type='text' id='directions' value='${recipe.directions}'></input></br>
            <input type='submit' value='Update Recipe'></input>
            </form>
        `
        recipeFormDiv.innerHTML = html
        document.querySelector('form').addEventListener('submit', updateRecipe)
    })
}

function updateRecipe(){
    event.preventDefault()
    let id = event.target.recipeId.value
    const recipe = {
        description: event.target.description.value,
        time: event.target.time.value,
        directions: event.target.directions.value
    }
    fetch(BASE_URL+`/recipes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        },
        body: JSON.stringify(recipe),
    })
    .then(resp => resp.json())
    .then(recipe => {
        let newRecipe = new RecipeItem(recipe)
        newRecipe.displaySingleRecipe()
        clearForm()
    })
}

function removeIngredient() {
    event.preventDefault()
    let recipeID = event.target.dataset.id 
    let id = event.target.dataset.ref 
    fetch(BASE_URL+`/recipes/${recipeID}/ingredients/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    })
    .then(() => {
        document.getElementById(id).remove()
    }) 
}


const displayOrderedIngredients = (recipe) => {  
    event.preventDefault()
    let orderedIngredients = recipe.ingredients.sort((a, b) => {
            var ingA = a.description.toUpperCase(); 
            var ingB = b.description.toUpperCase(); 
            if (ingA < ingB) {
                return -1;
            }
            if (ingA > ingB) {
                return 1;
            }
            return 0;
        })

        let ul = document.querySelector('ul')
        ul.innerHTML = ''
        ul.innerHTML += orderedIngredients.map(ingredient => {
            return `<li id='${ingredient.id}'>
            ${ingredient.description}
            <button data-id='${this.id}' data-ref='${ingredient.id}' onClick='removeIngredient()'; return false;>X</button>
            </li>`
            }).join('')  
}


class RecipeItem{
    constructor(recipe){
        this.id = recipe.id 
        this.description = recipe.description
        this.time = recipe.time
        this.directions = recipe.directions
        this.ingredients = recipe.ingredients
    }

    renderRecipeItem(){
        return `<a href='#' data-id=${this.id}>${this.description}</a> - ${this.time}</br>`
    }

    displaySingleRecipe() {
        let main = document.querySelector('#container')
        let ingredients= this.ingredients.map(ingredient => {
            return `<li id='${ingredient.id}'>
            ${ingredient.description}
            <button data-id='${this.id}' data-ref='${ingredient.id}' onClick='removeIngredient()'; return false;>X</button>
            </li>`
            }).join('')
        main.innerHTML = `
            <h2>${this.description}</h2> 
            <h3>Cook Time: ${this.time}</h3>
            <p>
                <strong>Ingredients:</strong>
                <br>
                <ul>
                    ${ingredients}
                </ul>
                <br>
            
                <button data-id='${this.id}' onclick='displayIngredientForm()'; return false;>New Ingredient</button>
                <br>
                <br>
                <div id='ingredient-form'></div>
                <br>
                <button data-id='${this.id}' onclick='displayOrderedIngredients(${JSON.stringify(this)})'; return false;>Order Ingredients</button>
                <br>
                <br>
                <strong>Directions:</strong>
                </br>
                ${this.directions}
    
                <br>
                <br>
                <br>
                
                <button data-id='${this.id}' onclick='editRecipe(${this.id})'; return false;>Edit Recipe</button>
                <br>
                <button data-id='${this.id}' onclick='removeRecipe(${this.id})'; return false;>Delete Recipe</button>
            </p>
        `
    }

}
