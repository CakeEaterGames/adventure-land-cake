game_log("warrior");

setInterval(update,1000/4);

var state = "";
set_state("combat_solo");


/*
combat_solo
combat_tank
combat_kite
*/
function update_state() {
  common_update_state();
  switch (state) {

  }
}
function enter_state(s) {
  common_enter_state(s);
  switch (state) {
    case "combat_tank":
    send_cm("CakeEater","set_state combat_tank");
    send_cm("CakePriest","set_state combat_tank");
    break;
    case "combat_solo":
    send_cm("CakeEater","set_state combat_solo");
    send_cm("CakePriest","set_state combat_solo");
    break;
    case "idle":
    send_cm("CakeEater","set_state idle");
    send_cm("CakePriest","set_state idle");
    break;
  }
}
function leave_state(s) {
  common_leave_state(s);
}


function update()
{
  time++;
setPlayers();
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

  var target=get_nearest_monster();
  if(!target) return;

  change_target(target);

  if(!in_attack_range(target))
  {
    move(
      character.x+(target.x-character.x)/2,
      character.y+(target.y-character.y)/2
    );
  }
  else if(can_attack(target))
  {
    attack(target);
  }
}


function combat_tank()
{
  loot();
  if(character.rip || is_moving(character)) return;

  var target=get_targeted_monster();
  if(target) change_target(target);
  if(!target)
  {
    target=get_nearest_monster({min_xp:100});
    if(target) change_target(target);
    else
    {
      return;
    }
  }
  //	if(target.target !== "CakeWarrior" && target.target !== undefined)
  if(target.target !== "CakeWarrior" && can_use("taunt"))
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
    attack(target);
  }
}

function on_cm(name, data)
{
  var args = data.split(' ');
  common_cm(name, data);

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
