<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;

class RoomController extends Controller
{
    public $user;

    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function getRoom()
    {
        $room = Room::where('full', null)->first();

        if (! $room) {
            $room = new Room();
            $room->name = substr(base_convert(sha1(uniqid(mt_rand())), 16, 36), 0, 64);
            $room->save();
        }

        $this->user = request()->user();

        $this->user->room_id = $room->id;
        $this->user->save();

        return $room;
    }

    public function room()
    {
        $this->user = request()->user();

        $room = $this->user->room_id ? $this->user->room : $this->getRoom();

        $this->user->room_check = \Carbon\Carbon::now();
        $this->user->save();

        foreach($room->users as $user) {
            if (strtotime($user->room_check) < (strtotime('now') - 20) || $user->room_check == null) {
                $user->room_id = null;
                $user->room_check = null;
                $user->save();
            }
        }

        return array(
            'user' => $this->user,
            'room' => Room::where('id', $this->user->room_id)->with('users')->first()
        );
    }

    public function reverse()
    {
        $user = request()->user();
        $room = $user->room;
        if ($room->reverse_cooldown) {
            if (strtotime($room->reverse_cooldown) > strtotime('now')) {
                return "cooldown";
            }
        }
        if ($room->reverse_votes === null || $room->reverse_votes === 0) {
            $room->reverse_votes = 1;
        } else if ($room->reverse_votes === 1) {
            $room->reverse_votes = 2;
        } else if ($room->reverse_votes === 2) {
            $room->reverse_votes = 0;
            $room->reversed = !$room->reversed;
            $room->reverse_cooldown = \Carbon\Carbon::now()->addSeconds(60);
        }

        $room->save();

        return "voted";
    }
}
