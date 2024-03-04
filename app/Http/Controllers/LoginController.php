<?php

namespace App\Http\Controllers;

use App\Models\Login;
use App\Models\UserAccount;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Cookie;


class LoginController extends Controller
{
    protected $minutesExpiration = 43200;

    public function index(Request $request)
    {
        if(Auth::viaRemember())
        {
            return redirect('/');
        }
        if (Auth::check()) {
            return redirect('/');
        }
        return view('login');
    }
   
    public function store(Request $request)
    {
        // 
        $remember_me = $request->has('remember') ? true : false; 

        $validator = Validator::make($request->all(),['username' => 'required','password'=>'required']);

        if ($validator->fails()) 
        {
            return response()->json(['message'=>$validator->errors()->first(),'status' => 'error']);
            exit;
        }
        
        $user = UserAccount::where('username', $request->username)->OrWhere('email', $request->username)->get()->first();

        if(count(collect($user))==0){
            return response()->json(['message'=>'Invalid Username']);exit;
        }
        $user->makeVisible('password');

        if(!password_verify($request->password, $user['password'])){
            return response()->json(['message'=>'Invalid Password']);exit;
        }
        $gets = Auth::attempt(['username'=> $request->username , 'password'=>$request->password],$remember_me);
        
        return response()->json(['message'=> 'success']);exit;
        
    }
   
}
