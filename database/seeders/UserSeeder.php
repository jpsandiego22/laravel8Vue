<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
         DB::table('user_account')->insert([
            'name' => 'Juan Dela Cruz Jr.', 
            'username'=> 'admin', 
            'email'=> 'admin@gmail.com', 
            'password'=> password_hash('p@ssw0rd',PASSWORD_DEFAULT)
         ]);
    }
}
