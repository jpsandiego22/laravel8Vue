<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductCreateController;
use App\Http\Controllers\LoginManagementController;
use App\Http\Controllers\SystemManagementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('get_data', [ProductController::class, 'show']);
Route::post('save_data', [ProductController::class, 'store'])->name('store');

Route::get('get_category', [ProductCreateController::class, 'get_category']);

Route::post('product_validation', [ProductCreateController::class, 'product_validation']);

Route::post('edit_product_validation', [ProductController::class, 'product_validation']);
Route::post('remove_product', [ProductController::class, 'remove_product']);
