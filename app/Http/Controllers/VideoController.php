<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoController extends Controller
{

    public function index(Request $request,$id)
    {
        $this->data['page'] = "Video Player";
        $list = array([''],[asset('video/KANA-BOON - Silhouette.mp4')],
        [asset('video/PRAXXYS Demo Reel MoGraph Retimed with VO with CC v2.mp4')]);

        $videos = json_encode($list[$id]);

        return view('video.video',['data'=>$this->data,'link'=> config('routelist')],compact('videos'));
    }

   
}
