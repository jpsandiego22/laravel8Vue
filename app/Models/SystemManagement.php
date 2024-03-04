<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class SystemManagement extends Model
{
    use HasFactory;
    protected $table = 'um_systems';
    protected $fillable = [
        'system_name',
        'system_shortname',
        'system_hash',
        'system_added_by',
    ];
}
