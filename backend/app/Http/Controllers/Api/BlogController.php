<?php

namespace App\Http\Controllers\API;

use App\Models\Blog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class BlogController extends Controller
{
    public function createBlog(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|string',
        'content' => 'required|string',
        'image' => 'required|file|image',
        'genre' => 'required|string',
        'author_id' => 'required'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => '422',
            'message' => $validator->messages()
        ]);
    }

    // File upload handling
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageData = file_get_contents($image->path());
    }

    // Create a new blog post
    $blog = Blog::create([
        'title' => $request->title,
        'content' => $request->content,
        'image' => $imageData,
        'genre' => $request->genre,
        'author_id' => $request->author_id
    ]);

    return response()->json([
        'status' => '200',
        'message' => 'Blog created successfully!'
    ]);
}

public function getAllBlogs()
{
    try {
        // Use Eloquent to join blogs and users tables
        $blogs = Blog::join('users', 'blogs.author_id', '=', 'users.id')
            ->select('blogs.title','blogs.id', 'blogs.genre', 'blogs.content', 'blogs.created_at', 'blogs.image as blog_image', 'users.name as user_name', 'users.image as user_image')
            ->get();

        $responseData = [];
        foreach ($blogs as $blog) {
            // Ensure images are properly handled
            $responseData[] = [
                'blog_id' => $blog->id,
                'title' => $blog->title,
                'content' => $blog->content,
                'genre' => $blog->genre,
                'created_at' => $blog->created_at,
                'blog_image' => base64_encode($blog->blog_image), // Encode the blog image as base64
                'user_name' => $blog->user_name,
                'user_image' => base64_encode($blog->user_image) // Encode the user image as base64
            ];
        }

        return response()->json([
            'status' => 200,
            'data' => $responseData,
        ]);
    } catch (\Exception $exception) {
        Log::error('Error retrieving blogs: ' . $exception->getMessage());
        return response()->json([
            'status' => 500,
            'message' => 'Internal Server Error',
        ], 500);
    }
}

public function getBlogById($id){

    $blog = DB::table('blogs')
    ->join('users', 'blogs.author_id', '=', 'users.id')
    ->where('blogs.id', $id)
    ->select(
        'blogs.id as blog_id',
        'blogs.title',
        'blogs.genre',
        'blogs.content',
        'blogs.image as blog_image',
        'blogs.created_at',
        'users.name as user_name',
        'users.image as user_image'
    )
    ->first();

if (!$blog) {
    return response()->json([
        'status' => 404,
        'message' => 'Blog not found',
    ], 404);
} else {
        $responseData = [
            'blog_id' => $blog->blog_id,
            'title' => $blog->title,
            'content' => $blog->content,
            'genre' => $blog->genre,
            'created_at' => $blog->created_at,
            'blog_image' => base64_encode($blog->blog_image), // Encode the blog image as base64
            'user_name' => $blog->user_name,
            'user_image' => base64_encode($blog->user_image) // Encode the user image as base64
        ];
        return response()->json([
            'status' => 200,
            'data' => $responseData
        ]);
    }

}

public function getBlogsByGenre($genre){
    try {
        // Fetch blogs based on genre
        $blogs = DB::table('blogs')
            ->join('users', 'blogs.author_id', '=', 'users.id')
            ->where('blogs.genre', $genre)
            ->select(
                'blogs.id as blog_id',
                'blogs.title',
                'blogs.genre',
                'blogs.content',
                'blogs.image as blog_image',
                'blogs.created_at',
                'users.name as user_name',
                'users.image as user_image'
            )
            ->get();

        // Check if any blogs were found
        if ($blogs->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'No blogs found for the genre: ' . $genre,
            ], 404);
        }

        // Prepare response data with Base64 encoded images
        $responseData = [];
        foreach ($blogs as $blog) {
            $blogData = [
                'blog_id' => $blog->blog_id,
                'title' => $blog->title,
                'content' => $blog->content,
                'genre' => $blog->genre,
                'created_at' => $blog->created_at,
                'blog_image' => base64_encode($blog->blog_image), // Encode the blog image as base64
                'user_name' => $blog->user_name,
                'user_image' => base64_encode($blog->user_image) // Encode the user image as base64
            ];
            $responseData[] = $blogData;
        }

        return response()->json([
            'status' => 200,
            'data' => $responseData
        ]);

    } catch (\Exception $e) {
        // Handle any database query exceptions
        return response()->json([
            'status' => 500,
            'message' => 'Error fetching blogs by genre',
            'error' => $e->getMessage() // Optionally include the error message for debugging
        ]);
    }
}


public function getTrendingBlogs()
{
    try {
        // Fetch the blogs data
        $blogs = DB::table('blogs')
            ->join('users', 'blogs.author_id', '=', 'users.id')
            ->orderBy('blogs.created_at', 'desc')
            ->select(
                'blogs.id as blog_id',
                'blogs.title',
                'blogs.genre',
                'blogs.content',
                'blogs.image as blog_image',
                'blogs.created_at',
                'users.name as user_name',
                'users.image as user_image'
            )
            ->take(6)
            ->get();

        // Prepare response data
        $responseData = [];
        foreach ($blogs as $blog) {
            $responseData[] = [
                'blog_id' => $blog->blog_id,
                'title' => $blog->title,
                'content' => $blog->content,
                'genre' => $blog->genre,
                'created_at' => $blog->created_at,
                'blog_image' => base64_encode($blog->blog_image), // Encode the blog image as base64
                'user_name' => $blog->user_name,
                'user_image' => base64_encode($blog->user_image) // Encode the user image as base64
            ];
        }

        // Return JSON response with success status and data
        return response()->json([
            'status' => 200,
            'data' => $responseData
        ]);
    } catch (\Exception $e) {
        // Handle exceptions
        return response()->json([
            'status' => 500,
            'message' => 'Error retrieving trending blogs: ' . $e->getMessage()
        ]);
    }
}


public function getBlogsByUserId($authorId){
    try {
        $blogs = DB::table('blogs')
            ->join('users', 'blogs.author_id', '=', 'users.id')
            ->where('blogs.author_id', $authorId)
            ->select(
                'blogs.id as blog_id',
                'blogs.title',
                'blogs.genre',
                'blogs.content',
                'blogs.image as blog_image',
                'blogs.created_at'
            )
            ->get();

        // Prepare response data
        $responseData = [];
        foreach ($blogs as $blog) {
            $responseData[] = [
                'blog_id' => $blog->blog_id,
                'title' => $blog->title,
                'content' => $blog->content,
                'genre' => $blog->genre,
                'created_at' => $blog->created_at,
                'blog_image' => base64_encode($blog->blog_image)
            ];
        }

        // Return JSON response with success status and data
        return response()->json([
            'status' => 200,
            'data' => $responseData
        ]);
    } catch (\Exception $e) {
        // Handle exceptions
        return response()->json([
            'status' => 500,
            'message' => 'Error retrieving blogs by user ID: ' . $e->getMessage()
        ]);
    }
}

public function deleteBlog($blogId){
    try {  

        $blog = Blog::find($blogId);
        if (!$blog) {
            return response()->json([
                'status' => 404,
                'message' => 'Blog not found',
            ], 404);
        }

        $blog->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Blog deleted successfully',
        ]);
    }catch (\Exception $e) {
        // Return an error response if something goes wrong
        return response()->json([
            'success' => false,
            'message' => 'Blog post not found or could not be deleted'
        ], 500);
    }
}

public function updateBlog($blogId, Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'nullable|string',
        'content' => 'nullable|string',
        'genre' => 'nullable|string',
        'image' => 'nullable|image'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => '422',
            'message' => $validator->messages()
        ]);
    }

    $blog = Blog::find($blogId);
    if (!$blog) {
        return response()->json([
            'status' => 404,
            'message' => 'Blog not found',
        ], 404);
    }

    if ($request->has('title')) {
        $blog->title = $request->title;
    }

    if ($request->has('content')) {
        $blog->content = $request->content;
    }

    if ($request->has('genre')) {
        $blog->genre = $request->genre;
    }

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageData = file_get_contents($image->getRealPath());
        $blog->image = $imageData;
    }

    $blog->save();

    return response()->json([
        'status' => 200,
        'message' => 'Blog updated successfully',
    ]);
}


public function searchBlog(Request $request)
{
    $query = $request->input('query');

    // Check for exact matches first
    $results = Blog::where('title', $query)
                   ->orWhere('genre', $query)
                   ->get(['id', 'title']);

    // If no exact matches, check for partial matches
    if ($results->isEmpty()) {
        $results = Blog::where('title', 'like', "%{$query}%")
                       ->orWhere('genre', 'like', "%{$query}%")
                       ->get(['id', 'title']);
    }

    if ($results->isEmpty()) {
        return response()->json([
            'status' => 200,
            'data' => [],
            'message' => 'No results found'
        ]);
    }

    return response()->json([
        'status' => 200,
        'data' => $results
    ]);
}




}
