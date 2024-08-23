<?php

namespace App\Http\Controllers\API;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function postComment(Request $request){

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'blog_id' => 'required|integer',
            'content' => 'required|string'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => '422',
                'message' => $validator->messages()
            ]);
        }
    
        $commentData = [
            'user_id' => $request->user_id,
            'blog_id' => $request->blog_id,
            'content' => $request->content,
            'parent_comment_id' => $request->input('parent_comment_id', null) // Set to null if not provided
        ];
    
        $comment = Comment::create($commentData);
    
        return response()->json([
            'status' => '200',
            'message' => 'Comment created successfully!'
        ]);
    }

    public function getCommentsByBlogId($id)
{
    $comments = DB::table('comments')
    ->select(
        'comments.id as comment_id',
        'comments.user_id as user_id',
        'comments.blog_id',
        'comments.content',
        'comments.parent_comment_id',
        'comments.created_at',
        'users.image',
        'users.name'
    )
    ->join('users', 'comments.user_id', '=', 'users.id')
    ->where('comments.blog_id', $id)
    ->get();


    // Base64 encode image before returning the JSON response
    $comments = $comments->map(function ($comment) {
        $comment->image = base64_encode($comment->image);
        return $comment;
    });

    return response()->json([
        'status' => 200,
        'data' => $comments
    ]);
}


    public function deleteComment($id){
       // Find the comment by id
        $commentsToDelete = Comment::where('id', $id)
        ->orWhere(function ($query) use ($id) {
            $query->where('parent_comment_id', $id);
        })
        ->get();

        // Check if any comments were found
        if ($commentsToDelete->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Comments not found!'
            ], 404);
        }

        // Delete all comments found
        DB::beginTransaction();
        try {
            foreach ($commentsToDelete as $comment) {
                $comment->delete();
            }
            DB::commit();
            return response()->json([
                'status' => 200,
                'message' => 'Comments deleted successfully!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 500,
                'message' => 'Error deleting comments: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCommentById($id){
        $comment = Comment::find($id);
        if (!$comment) {
            return response()->json([
                'status' => 404,
                'message' => 'Comment not found!'
            ], 404);
        }
        return response()->json([
            'status' => 200,
            'data' => $comment
        ]);
    }

    public function updateComment(Request $request){
        $comment = Comment::find($request->comment_id);
        if (!$comment) {
            return response()->json([
                'status' => 404,
                'message' => 'Comment not found!'
            ], 404);
        }
        $comment->content = $request->content;
        $comment->save();
        return response()->json([
            'status' => 200,
            'message' => 'Comment updated successfully!'
        ]);
    }
    
}
