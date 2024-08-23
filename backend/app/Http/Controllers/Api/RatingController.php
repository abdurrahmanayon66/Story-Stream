<?php

namespace App\Http\Controllers\API;

use App\Models\Rating;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function postRating(Request $request){

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'blog_id' => 'required|integer',
            'rating' => 'required|integer'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => '422',
                'message' => $validator->messages()
            ]);
        }
    
        $data = [
            'user_id' => $request->user_id,
            'blog_id' => $request->blog_id,
            'rating' => $request->rating
        ];
    
        $rating = Rating::create($data);
    
        return response()->json([
            'status' => '200',
            'message' => 'Comment created successfully!'
        ]);
    }

    public static function getAllRating()
    {
        try {
            $ratingAverages = DB::table('ratings')
                ->select('blog_id', DB::raw('ROUND(AVG(rating)) AS average_rating'))
                ->groupBy('blog_id')
                ->get();
            
            return response()->json([
                'status' => 200,
                'data' => $ratingAverages
            ]);
        } catch (Exception $e) {
            // Log the error or handle it in a way that makes sense for your application
            // For example, you can return a JSON response with an error message
            return response()->json([
                'status' => '422',
                'message' => 'error has occurred fetching the ratings'
            ]);
        }
    }

    public function getRatingsByUserId($userId) {
        try {
            // Query to get the blog id and rounded average rating
            $ratings = DB::table('ratings')
                ->join('blogs', 'ratings.blog_id', '=', 'blogs.id')
                ->where('blogs.author_id', $userId)
                ->groupBy('ratings.blog_id')
                ->select('ratings.blog_id', DB::raw('ROUND(AVG(ratings.rating)) as average_rating'))
                ->get();

            // Prepare response data
            $responseData = [];
            foreach ($ratings as $rating) {
                $responseData[] = [
                    'blog_id' => $rating->blog_id,
                    'average_rating' => $rating->average_rating
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
                'message' => 'Error retrieving user blog ratings: ' . $e->getMessage()
            ]);
        }
        }
    
}
