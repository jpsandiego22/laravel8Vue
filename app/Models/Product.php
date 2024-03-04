<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    public $timestamps = false;
    protected $table = 'products';
    protected $primaryKey = 'id';
    protected $fillable = [
        'name',
        'category',
        'description',
    ];

    public function scopeFilter($query, $val)
    {
        $val ='%'.$val.'%';

        $query->where(function($query) use ($val) {
            $query->where('name','like',$val)
            ->orWhere('description','like',$val);
        });
    }
    public function scopeFilterBy($query, $val)
    {
        if($val)
        {
            $query->where(function($query) use ($val) {
                    $query->where('category',$val);
            });
        }
       
       
    }
}
