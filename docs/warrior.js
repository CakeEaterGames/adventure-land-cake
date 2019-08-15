game_log("warrior");

setInterval(update,1000);

var state = "idle";
set_state("combat_tank");
function set_state(s) {
  if(s!=state)
  {
    leave_state(state);
    state = s;
    enter_state(state)
  }
}

/*
combat_solo
combat_tank
combat_kite
*/
function update_state() {
  switch (state) {
    case "combat_solo":
    combat_solo();
    break;

    case "combat_tank":
    combat_tank();
    break;

  }
}
function enter_state(s) {

}
function leave_state(s) {

}


function update()
{
  time++;

    smart_heal();
    loot();

    send_cm("CakeEater", "pos "+Math.round(character.real_x)+" "+Math.round(character.real_y) +" "+ character.map);

    send_cm("CakePriest", "pos "+Math.round(character.real_x)+" "+Math.round(character.real_y) +" "+ character.map);

    update_state();


}



function combat_solo()
{
  loot();
  if(character.rip || is_moving(character)) return;

  var  target=get_nearest_monster({min_xp:100});
  if(target) change_target(target);
  else
  {
    set_message("No Monsters");
    return;
  }

  if(!in_attack_range(target))
  {
    move(
      character.x+(target.x-character.x)/2,
      character.y+(target.y-character.y)/2
    );
    // Walk half the distance
  }
  else if(can_attack(target))
  {
    set_message("Attacking");
    attack(target);
  }
}


function combat_tank()
{
    loot();
    if(character.rip || is_moving(character)) return;

    var target=get_targeted_monster();

    if(!target)
    {
      target=get_nearest_monster({min_xp:100});
      if(target) change_target(target);
      else
      {
        set_message("No Monsters");
        return;
      }
    }
    //	if(target.target !== "CakeWarrior" && target.target !== undefined)
    if(target.target !== "CakeWarrior")
    {
      use_skill("taunt");
    }
    //	game_log(target);
    //game_log(target.target);

    if(!in_attack_range(target))
    {
      move(
        character.x+(target.x-character.x)/2,
        character.y+(target.y-character.y)/2
      );
      // Walk half the distance
    }
    else if(can_attack(target))
    {
      set_message("Attacking");
      attack(target);
    }
}

function on_cm(name, data)
{
  var args = data.split(' ');
  //game_log(args);

  var Length = character.items.length;
  if(args[0] == "mp_pot")
  {
    for (var i = 0; i < Length; i++)
    {
      var a = character.items[i];
      if(a && a.name == "mpot0")
      {
        send_item(name, i, 100);
        break;
      }
    }
  }

  if(args[0] == "hp_pot")
  {
    for (var i = 0; i < Length; i++)
    {
      var a = character.items[i];
      if(a && a.name == "hpot0")
      {
        send_item(name, i, 100);
        break;
      }
    }
  }
}
