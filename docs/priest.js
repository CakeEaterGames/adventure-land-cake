game_log("priest");

setInterval(update,1000/4);

set_state("combat_solo");

function update()
{
  time++;
  setPlayers();
  smart_heal();
  loot();
  request_potions();
  update_state();
  cooperate();
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



function combat_solo()
{
  if(character.rip || is_moving(character)) return;

  if(!target){
    target=get_nearest_monster({min_xp:100});
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

function cooperate() {
  if(character.hp<character.max_hp*0.7)
  {
    heal(character);
  }
  else if(warrior!=null && warrior.hp<warrior.max_hp*0.7)
  {
    heal(warrior);
  }
  else if(mage!=null && mage.hp<mage.max_hp*0.7)
  {
    heal(mage);
  }
  else if(merch!=null && merch.hp<merch.max_hp*0.7)
  {
    heal(merch);
  }
}

function combat_tank(){
  if(character.rip || is_moving(character)) return;

  var target=get_target_of(warrior);

  //Heal amount is stored in char.attack;



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
  }
  else if(can_attack(target))
  {
    attack(target);
    if(can_use("curse"))
    {
      use_skill("curse");
    }

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
      var l = Math.abs(character.real_x-args[1])+
      Math.abs(character.real_y-args[2]);
      if(!isMoving && l >500)
      {
        isMoving = true;
        game_log("going");
        var dest = {
          x: character.x+(args[1]-character.x)/1,
          y: character.y+(args[2]-character.y)/1,
          map:args[3]
        };
        smart_move(dest, function(){isMoving = false;});
      }

      switch (args[0]) {
        case "":

        break;
      }
    }
  }
}
