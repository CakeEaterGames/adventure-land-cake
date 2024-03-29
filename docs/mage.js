game_log("mage");

setInterval(update,1000/4);

set_state("combat_solo");


function update()
{
  loot();
  smart_heal();
  setPlayers();
  request_potions();
  update_state();
}

function update_state() {
  common_update_state();
  switch (state) {

  }
}
function enter_state(s) {
  common_enter_state(s);
}
function leave_state(s) {
  common_leave_state(s);
}

function request_potions()
{
  if(quantity("hpot0")<100) send_cm("CakeWarrior", "need_hp_pot");
  if(quantity("mpot0")<100) send_cm("CakeWarrior", "need_mp_pot");
}

var target = null;
function combat_solo()
{
  loot();
  if(character.rip || is_moving(character)) return;
  if(!target){
    var  target=get_nearest_monster();
    if(target) change_target(target);
    else
    {
      return;
    }
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
    attack(target);
  }
}


function combat_tank()
{
  game_log("cambat_tank");
  if(character.rip || is_moving(character)) return;

  var target=get_target_of(warrior);
  game_log(target);
  game_log(warrior);
  if(!target)
  {
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
    attack(target);
    //use_skill("burst");
  }

  if (priest.mp<priest.max_mp-300)
  {
    change_target(priest);
    use_skill("energize");
  }

}

var isMoving = false;

function on_cm(name, data)
{
  common_cm(name, data);
  if (name == "CakeWarrior" || name == "CakeEater" || name == "CakeMerch" || name == "CakePriest"){
    var args = data.split(' ');
    //game_log(args);

    if(args[0] == "pos")
    {
      var l = Math.abs(character.real_x-args[1])+Math.abs(character.real_y-args[2]);
      if(!isMoving && l >500)
      {
        isMoving = true;
        game_log("going");
        var dest = {
          x: character.x+(args[1]-character.x)/1.1,
          y: character.y+(args[2]-character.y)/1.1,
          map:args[3]
        };
        smart_move(dest, function(){isMoving = false;});
      }
    }
  }
}
