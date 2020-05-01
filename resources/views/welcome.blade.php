@extends('layouts.app')

@section('content')
    <div class="container py-5 my-5">
        <div class="jumbotron text-white d-flex flex-column flex-lg-row justify-content-between align-items-center bg-primary">
            <div class="col-12 col-md-6">
                <h1>What is one-way-binding?</h1>
                <p class="lead">And how can we learn to understand it better?</p>
                <p>StateBind is a chat app based on a data cycle used to build applications like this one. Its kinda of like a telephone game, except instead of trying to pass one word, you're trying to have an conversation. Good luck!</p>
            </div>
            <div class="col-12 col-md-4 text-center">
                <a class="btn btn-success btn-lg " style="padding: 10px 80px" href="/home">Go Chat</a>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-6">
                <div class="jumbotron text-white bg-danger">
                    <h2>Data Moves</h2>
                    <p class="lead text-white">But how and why?</p>
                    <p>Understanding the way data moves can be difficult for Software Engineers and regular folks alike. I've found that experiencing one-way-binding data flow in a chat app is the easiest way to explain to others how it works.</p>
                </div>
            </div>
            <div class="col-12 col-md-6">
                <div class="jumbotron text-white bg-warning">
                    <h2>One-Way-Data Binding?</h2>
                    <p class="lead text-white">What is one-way-data binding on a technical level?</p>
                    <p>
                        One-Way-Data binding is a design pattern that only allows data to move through the application in one predefined direction. For example, this website was built with React, which uses state. State can be accessed easily enough, but it is only able to be set through the setState function.
                    </p>
                </div>
            </div>
        </div>
    </div>
@endsection
