<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    Protected $model = Product::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'category' => $this->faker->randomElement(config('categorylist')),
            'description' => $this->faker->realText,
        ];
    }
}
