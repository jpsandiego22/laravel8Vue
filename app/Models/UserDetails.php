<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetails extends Model
{
    use HasFactory;
    protected $table = 'um_user_details';
    protected $fillable = [
        'account_id',
        'firstname',
        'lastname',
        'middlename',
        'gender',
        'email',
        'contact_no',
        'added_by'
    ];
}
