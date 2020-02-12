class RecipeSerializer < ActiveModel::Serializer
  attributes :id, :description, :time, :directions

  has_many :ingredients, serializer: IngredientSerializer
end
