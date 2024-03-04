@extends('layout.master')

@section('content')
    <div class="col-md-12">
        <section class="content">
            <div class="card">
                <div class="card-body">
                    <products :datasource = "{{$datasource}}"/>
                </div>
            </div>
        </section>
    </div>
@endsection