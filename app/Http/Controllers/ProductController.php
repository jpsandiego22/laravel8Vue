<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductCollection;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $data;

    public function __construct() {

        $this->data['page'] = "Product";
    }
    public function index(Request $request)
    {
        $routelist = config('routelist');
        $datasource = collect([ "category" => collect(config('categorylist')), "link_create" =>  $routelist['products-create']]);
        
        // dd(compact('category'));exit;
        return view('products.index',['data'=>$this->data,'link'=> config('routelist')],compact('datasource'));
    }
    public function create()
    {
        //
    }
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
    public function show(Request $request)
    {
        $paginate = request('paginate',10); 
        $filter = request('filter',''); 
        $filterby = request('filterby',''); 
        $products = Product::Filter(trim($filter))->FilterBy(trim($filterby))->Paginate($paginate);
        
        return ProductCollection::collection($products);
    }
    public function edit(Product $product)
    {
        //
    }
    public function update(Request $request, $id)
    {
        $data['page'] = "Edit";
        $product_info =  Product::where('id', $id)->first();
        // return  $product_info;
        $datasource = collect([ "category" => collect(config('categorylist')), "info" => $product_info,'iid'=> $id]);
        // $category->iid = $id;
        // $category = $category;
        return view('products.edit',['data'=>$data,'link'=> config('routelist')],compact('datasource'));
    }

    public function product_validation(Request $request)
    { 
        if($request->valid == 1){
            $validator = Validator::make($request->all(), [
                'name' => 'required|max:50',
                'category' => 'required|max:50',
                'description' => 'required|max:255',
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
                    'img' => 'required',
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
            $data= $request->all();
            unset($data['valid']);
            unset($data['dt']);
    
            $posting = Product::where('id', $request->id)->update($data);
           
            return response()->json(['status' => 'success', 'data'=>$posting]);
        }
    }
    Public function remove_product(Request $request)
    {
        $id = $request->iid;
        Product::where('id',$id)->delete();
        return response()->json(['message'=>'Data has been succcessfully deleted','status' => 'success']);
    }
    public function get_category(Request $request)
    {
        return response()->json(['data' => config('categorylist')]);
    }
}
