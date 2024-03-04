<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;

class IndexController extends Controller
{
    protected $data;

    public function __construct() {
        $this->data['page'] = "Systems";
    }
    public function index(Request $request)
    {
        return view('index',['data'=>$this->data,'link'=> config('routelist')]);
    }
}
