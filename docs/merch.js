game_log("merch");

setInterval(update,1000/4);

//set_state("buy_potions");

//buy_potions
//bought_potions
//traveling_to_team
//arrived
//traveling_to_town
//upgrading
//selling

function update()
{
  time++;
  setPlayers();
  smart_heal();
  loot();
  update_state();
}


function update_state() {
  common_update_state();
  switch (state) {
    case "traveling_to_team":
    if(arrived){
      arrived = false;
      send_cm("CakeWarrior","merchant_is_here "+Math.round(character.real_x)+" "+Math.round(character.real_y));
      send_cm("CakeEater","merchant_is_here "+Math.round(character.real_x)+" "+Math.round(character.real_y));
      send_cm("CakePriest","merchant_is_here "+Math.round(character.real_x)+" "+Math.round(character.real_y));
      setTimeout(function(){ set_state("traveling_to_town")}, 1000*10);
    }
    break;

    case "upgrading":
    if(!needCombining && !needUpgrading){
      set_state("selling");
    }
    break;
  }
}
function enter_state(s) {
  common_enter_state(s);
  switch (state) {
    case "buy_potions":
    buy_potions();
    break;
    case "traveling_to_team":
    traveling_to_team();
    break;
    case "traveling_to_town":
    smart_move("town",function () {set_state("upgrading")});
    break;
    case "upgrading":
    needCombining = true;
    needUpgrading = true;
    break;
    case "selling":
    smart_move("town");
    break;
  }
}
function leave_state(s) {
  common_leave_state(s);
}

function buy_potions()
{
  smart_move({to:"potions"},function(done){
    buy("hpot0",5000-quantity("hpot0"));
    buy("mpot0",5000-quantity("mpot0"));
    set_state("traveling_to_team");
  });
}

function traveling_to_team(){
  send_cm("CakeWarrior","get_pos");
}

function on_cm(name, data)
{
  var args = data.split(' ');
  common_cm(name, data);
  if (name == "CakeWarrior" || name == "CakeEater" || name == "CakeMerch" || name == "CakePriest"){
    switch (args[0]) {
      case "need_mp_pot":
      send_item(name, find_item_index("mpot0"), 5000);
      break;

      case "need_hp_pot":
      send_item(name, find_item_index("hpot0"), 5000);
      break;
    }
  }
}
