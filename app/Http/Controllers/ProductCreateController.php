<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductCreateController extends Controller
{
    protected $data;

    public function __construct() {

        $this->data['page'] = "Create";
    }
    public function index(Request $request)
    {
        $category = collect(config('categorylist'));
        return view('products.create',['data'=>$this->data,'link'=> config('routelist')],compact('category'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:50',
            'category' => 'required|max:50',
            'description' => 'required|max:150',
        ]);
        if ($validator->fails()) 
        {
            return response()->json(['message'=>'error','info' => $validator->errors()]);
            exit;
        }
        $posting = Product::create($request->all());

        return response()->json(['message'=>'success','info'=>'New Entry has been successfully saved.','data' => $posting]);
    }


    public function get_category(Request $request)
    {
        return response()->json(['data' => config('categorylist')]);
    }
    public function product_validation(Request $request)
    { 
        if($request->valid == 1){
            $validator = Validator::make($request->all(), [
                'name' => 'required|max:50',
                'category' => 'required|max:50',
                'description' => 'required|max:150',
            ]);
            if ($validator->fails()) 
            {
                return response()->json(['message'=>$validator->errors()->first(),'status' => 'error']);
                exit;
            }
            return response()->json(['status' => 'success']);
        }
        elseif($request->valid==2){
            $count='';
            foreach ($request->img as $file){

                $validator = Validator::make($request->all(), [
                    'img.*' => 'mimes:jpg,jpeg,bmp,png',

                ]);
                    
                if ($validator->fails()) 
                {
                    $count=$validator->errors()->first();
                }
            }
            if($count!='')
            {
                return response()->json(['message'=> $count ,'status' => 'error']);exit;
            }
            return response()->json(['status' => 'success']);
            exit;
        }
        elseif($request->valid == 3){
           
            $validator = Validator::make($request->all(), [
                'dt' => 'required|date',
            ]);
            if ($validator->fails()) 
            {
                return response()->json(['message'=>str_replace('dt','Date',$validator->errors()->first()),'status' => 'error']);
                exit;
            }
            $data = $request->all();
            unset($data["valid"]);
            unset($data["dt"]);
            $posting = Product::create($request->all());

            return response()->json(['status' => 'save']);
        }
    }

}
