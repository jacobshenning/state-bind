<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/token', function () {

    // $user = \Auth::user();

    // if (false && $user->twilio_token !== null) {
    //     $token = $user->twilio_token;
    // } else {
    //     $token = new AccessToken(
    //         env('TWILIO_ACCOUNT_SID'),
    //         env('TWILIO_API_KEY'),
    //         env('TWILIO_API_SECRET'),
    //         3600,
    //         $user->name
    //     );
    //     $chatGrant = new ChatGrant();
    //     $chatGrant->setServiceSid(env('TWILIO_CHAT_SERVICE_SID'));
    //     $token->addGrant($chatGrant);
    //     $jwt = $token->toJWT();
    //     $user->twilio_token = $jwt;
    //     $user->save();
    // }

    // return response()->json([
    //     'channel' => $user->name,
    //     'identity' => $user->name,
    //     'token' => $user->twilio_token,
    // ]);
});

