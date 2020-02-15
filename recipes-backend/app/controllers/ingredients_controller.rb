class IngredientsController < ApplicationController
    before_action :set_ingredient, only: [:show, :update, :destroy]

    # GET /recipes
  def index
    ingredients = Recipe.all

    render json: ingredients
  end

  # GET /recipes/1
  def show
    render json: @ingredient
  end

  # POST /recipes
  def create
    binding.pry
    recipe=Recipe.find_by(id: params[:recipe_id])
    @ingredient = recipe.ingredients.build(ingredient_params)

    if @ingredient.save
      render json: @ingredient
    else
      render json: @ingredient.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /recipes/1
  def update
    if @ingredient.update(ingredient_params)
      render json: @ingredient
    else
      render json: @ingredient.errors, status: :unprocessable_entity
    end
  end

  # DELETE /recipes/1
  def destroy
    @ingredient.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ingredient
      @ingredient = Ingredient.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def ingredient_params
      params.require(:recipe).permit(:description, :recipe_id)
    end
end
