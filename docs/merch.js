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
      send_cm("CakeWarrior","merchant_is_here");
      send_cm("CakeEater","merchant_is_here");
      send_cm("CakePriest","merchant_is_here");
      game_log("SENDING");
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
}
