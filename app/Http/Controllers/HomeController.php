<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\ChatGrant;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = \Auth::user();

        if (false && $user->twilio_token !== null) {
            $token = $user->twilio_token;
        } else {
            $token = new AccessToken(
                env('TWILIO_ACCOUNT_SID'),
                env('TWILIO_API_KEY'),
                env('TWILIO_API_SECRET'),
                3600,
                $user->name
            );
            $chatGrant = new ChatGrant();
            $chatGrant->setServiceSid(env('TWILIO_CHAT_SERVICE_SID'));
            $token->addGrant($chatGrant);
            $jwt = $token->toJWT();
            $user->twilio_token = $jwt;
            $user->save();
        }

        $data = [
            'channel' => $user->name,
            'identity' => $user->name,
            'token' => $user->twilio_token,
        ];

        return view('home', ['data' => $data]);
    }
}
