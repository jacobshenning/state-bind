<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'full', 'reversed'
    ];

    protected $appends = ['cooling'];

    /**
     * Get the user's first name.
     *
     * @param  string  $value
     * @return string
     */
    public function getCoolingAttribute()
    {
        if ($this->reverse_cooldown == null) {
            return false;
        }
        if (strtotime($this->reverse_cooldown) > strtotime('now')) {
            return false;
        }
        return true;
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    /**
     *
     *
     *
     */
    public function users()
    {
        return $this->hasMany('App\User');
    }
}

