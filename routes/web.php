<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\VideoController;
use App\Http\Middleware\AuthCheckSession;
use App\Http\Controllers\ProductController;
use Illuminate\Contracts\Auth\Authenticatable;
use App\Http\Controllers\ProductCreateController;

Route::group(['namespace' => 'App\Http\Controllers'], function()
{
    Route::resource('/login',LoginController::class);
    Route::get('/logout',function(){
        Auth::logout();
        Session::flush();
        return redirect('/');
    });
});
    
Route::middleware([AuthCheckSession::class])->group(function(){
    Route::get('/',  [IndexController::class, 'index']);
    Route::prefix('products')->as('products.')->group(function(){
        Route::resource('list', ProductController::class)->only(['index']);
        Route::resource('create', ProductCreateController::class)->only(['index']);
        Route::get('{id}/edit',  [ProductController::class, 'update']);
    });
    Route::get('/video-gallery/{id}',  [VideoController::class, 'index']);
    
});




