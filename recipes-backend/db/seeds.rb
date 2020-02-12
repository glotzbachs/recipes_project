# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
salad = Recipe.create(description: "Delicious, fresh tossed salad", time: "5 minutes", directions: "Put all of your fresh ingredients in a bowl and enjoy!")
 
lettuce= Ingredient.create(recipe: salad, description: "lettuce")
tomato= Ingredient.create(recipe: salad, description: "tomato")
cucumber= Ingredient.create(recipe: salad, description: "cucumber")
ranch= Ingredient.create(recipe: salad, description: "ranch dressing")
