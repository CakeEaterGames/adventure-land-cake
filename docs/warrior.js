game_log("warrior");

setInterval(update,1000/4);

set_state("combat_solo");

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

function request_potions()
{
  if(quantity("hpot0")<5000) send_cm("CakeMerch", "need_hp_pot");
  if(quantity("mpot0")<5000) send_cm("CakeMerch", "need_mp_pot");
}

var target = null;
function combat_solo()
{
  loot();
  if(character.rip || is_moving(character)) return;

  if(!target)
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
  if (name == "CakeWarrior" || name == "CakeEater" || name == "CakeMerch" || name == "CakePriest"){
    switch (args[0]) {
      case "need_mp_pot":
      send_item(name, find_item_index("mpot0"), 100);
      break;

      case "need_hp_pot":
      send_item(name, find_item_index("hpot0"), 100);
      break;
      case "merchant_is_here":

      break;
    }
  }
}
