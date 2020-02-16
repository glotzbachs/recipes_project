const BASE_URL = 'http://localhost:3000'

window.addEventListener('load', () => {
    getRecipes()
    attachClickToRecipes()
})

function getRecipes(){
    clearForm()
    let main = document.querySelector('#main ul')
    main.innerHTML = ''
    fetch(BASE_URL+'/recipes')
    .then(resp => resp.json())
    .then(recipes => {
        main.innerHTML += recipes.map(recipe => {
            let newRecipe = new RecipeItem(recipe)
            return newRecipe.renderRecipeItem()
        }).join('')
        attachClickToRecipes()
    })  
}

function clearForm(){
    let recipeFormDiv = document.getElementById('recipe-form')
    recipeFormDiv.innerHTML = ''
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
    const recipe = {
        description: document.getElementById('description').value,
        time: document.getElementById('time').value,
        directions: document.getElementById('directions').value
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
        document.querySelector('#main ul').innerHTML += recipe.renderRecipeItem
        attachClickToRecipes() 
        clearForm()
    })
}
 
function displayRecipe(e){
    e.preventDefault()
    clearForm()
    let id = e.target.dataset.id
    let main = document.querySelector('#main ul')
    main.innerHTML = ''
    fetch(BASE_URL+'/recipes/'+id)
    .then(resp => resp.json())
    .then(recipe => {
        let ingredients= recipe.ingredients.map(ingredient => {
            return `<li>
            ${ingredient.description}
            <button data-id='${recipe.id}' onClick='removeIngredient(${ingredient.id})'; return false;>X</button>
            </li>`
            }).join('')
        main.innerHTML += `
            <h2>${recipe.description}</h2> 
            <h3>Cook Time: ${recipe.time}</h3>
            <p>
                <strong>Ingredients:</strong>
                <br>
                <ul>
                    ${ingredients}
                </ul>
                <br>
            
                <button data-id='${recipe.id}' onClick='displayIngredientForm()'; return False;>New Ingredient</button>
                <br>
                <br>
                <div id='ingredient-form'></div>
                <br>

                <strong>Directions:</strong>
                </br>
                ${recipe.directions}

                <br>
                <br>
                <br>
                
                <button data-id='${recipe.id}' onClick='editRecipe(${recipe.id})'; return False;>Edit Recipe</button>
                <br>
                <button data-id='${recipe.id}' onClick='removeRecipe(${recipe.id})'; return False;>Delete Recipe</button>
            </p>
        `
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
        document.querySelector('#main ul ul').innerHTML += `
        <li>
        ${ingredient.description}
        <button onClick='removeIngredient(${ingredient.id})'; return False;>X</button>
        </li>
        `
    })
    clearForm()
}

function removeRecipe(id) {
    clearForm()
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
    clearForm()
    fetch(BASE_URL+`/recipes/${id}`)
    .then(resp => resp.json())
    .then(recipe => {
        let recipeFormDiv = document.getElementById('recipe-form')
        let html = `
            <form onsubmit='updateRecipe(${id});return false;'>
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
    })
}

function updateRecipe(id){
    const recipe = {
        description: document.getElementById('description').value,
        time: document.getElementById('time').value,
        directions: document.getElementById('directions').value
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
    .then(displayAfterEdit(id))
}

function removeIngredient(id) {
    clearForm()
    let recipeID = event.target.dataset.id 
    fetch(BASE_URL+`/recipes/${recipeID}/ingredients/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    })
    .then(displayAfterEdit(recipeID))
}

function displayAfterEdit(id){
    clearForm()
    let main = document.querySelector('#main ul')
    main.innerHTML = ''
    fetch(BASE_URL+'/recipes/'+id)
    .then(resp => resp.json())
    .then(recipe => {
        let ingredients= recipe.ingredients.map(ingredient => {
            return `<li>${ingredient.description}
            <button data-id='${recipe.id}' onClick='removeIngredient(${ingredient.id})'; return False;>X</button>
            </li>`
            }).join('')
        main.innerHTML += `
            <h2>${recipe.description}</h2> 
            <h3>Cook Time: ${recipe.time}</h3>
            <p>
                <strong>Ingredients:</strong>
                <br>
                <ul>
                    ${ingredients}
                </ul>
                <br>
            
                <button data-id='${recipe.id}' onClick='displayIngredientForm()'; return False;>New Ingredient</button>
                <br>
                <br>
                <div id='ingredient-form'></div>
                <br>
                <br>
                <br>

                <strong>Directions:</strong>
                </br>
                ${recipe.directions}

                <br>
                <br>
                <br>
                
                <button data-id='${recipe.id}' onClick='editRecipe(${recipe.id})'; return False;>Edit Recipe</button>
                <br>
                <button data-id='${recipe.id}' onClick='removeRecipe(${recipe.id})'; return False;>Delete Recipe</button>
            </p>
        `
    })
}



class RecipeItem{
    constructor(recipe){
        this.id = recipe.id 
        this.description = recipe.description
        this.time = recipe.time
        this.directions = recipe.directions
    }

    renderRecipeItem(){
        return `
        <a href='#' data-id='${this.id}'>${this.description}</a> - ${this.time}</br>
        `
    }

}
