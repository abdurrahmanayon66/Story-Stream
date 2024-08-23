<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BlogController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\API\RatingController;
use App\Http\Controllers\API\CommentController;


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('registerUser',[UserController::class,'registerUser']);
Route::post('loginUser',[UserController::class,'loginUser']);
Route::get('getUserById/{userId}',[UserController::class,'getUserById']);


Route::post('createBlog',[BlogController::class,'createBlog']);
Route::get('getAllBlogs',[BlogController::class,'getAllBlogs']);
Route::get('getBlog/{id}',[BlogController::class,'getBlogById']);
Route::get('getBlogsByGenre/{genre}',[BlogController::class,'getBlogsByGenre']);
Route::get('getBlogsByUserId/{authorId}',[BlogController::class,'getBlogsByUserId']);
Route::get('getTrendingBlogs',[BlogController::class,'getTrendingBlogs']);
Route::delete('deleteBlog/{blogId}',[BlogController::class,'deleteBlog']);
Route::post('updateBlog/{blogId}', [BlogController::class, 'updateBlog']);
Route::get('searchBlog/{searchQuery}', [BlogController::class, 'searchBlog']);



Route::post('postComment',[CommentController::class,'postComment']);
Route::get('getComments/{id}',[CommentController::class,'getCommentsByBlogId']);
Route::delete('deleteComment/{id}',[CommentController::class,'deleteComment']);
Route::get('getCommentById/{id}',[CommentController::class,'getCommentById']);
Route::post('updateComment',[CommentController::class,'updateComment']);

Route::post('postRating',[RatingController::class,'postRating']);
Route::get('getAllRating',[RatingController::class,'getAllRating']);
Route::get('getRatingsByUserId/{userId}', [RatingController::class, 'getRatingsByUserId']);