@extends('layout.master')

@section('content')
    <div class="col-md-12">
        <section class="content">
            <div class="card">
                <div class="card-body">
                    <video-player :video ='{{$videos}}'/>
                </div>
            </div>
        </section>
    </div>
@endsection