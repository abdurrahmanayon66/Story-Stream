<?php

namespace App\Http\Controllers\Api;

use App\Models\UserModel;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function registerUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'image' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '422',
                'message' => $validator->messages()
            ], 422);
        } else {
            
             // File upload handling
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageData = file_get_contents($image->path());
        }

            $user = UserModel::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'image' => $imageData
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'status' => '200',
                'message' => 'User created successfully',
                'token' => $token
            ], 200);
        }
    }

    public function loginUser(Request $request){
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        
        // Authentication passed...

        $user = UserModel::where('email', $request->email)->first();
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => '200',
            'message' => 'Login successful',
            'token' => $token
        ], 200);
    } else {
        // Authentication failed...
        return response()->json([
            'status' => '401',
            'message' => 'Unauthorized',
        ], 401);
        }
    }

    public function getUserById($userId){

        $user = UserModel::find($userId);
        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found',
            ], 404);
        } else {
                $responseData = [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_image' => base64_encode($user->image) // Encode the user image as base64
                ];
                return response()->json([
                    'status' => 200,
                    'data' => $responseData
                ]);
            }
    }
}
