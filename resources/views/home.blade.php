@extends('layouts.app')

@section('content')
<script>
    var data = {!! json_encode($data) !!};
</script>
<div class="container">
    <div id="chat"></div>
</div>
@endsection
