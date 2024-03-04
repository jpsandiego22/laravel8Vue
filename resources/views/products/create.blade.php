@extends('layout.master')

@section('content')
    <div class="col-md-8 m-auto">
        <section class="content">
            <div class="card">
                <div class="card-body">
                    
                    <products-create :categories ="{{$category}}"/>
                </div>
            </div>
        </section>
    </div>
@endsection
