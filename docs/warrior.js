setInterval(update,1000/4);
​
setInterval(auto_upgrade,1000/2);
setInterval(combat,1000/8);
​
change_target();
​
var state = "idle";
​
function update()
{
    smart_heal();
    loot();

     send_cm("CakeEater", "pos "+Math.round(character.real_x)+" "+Math.round(character.real_y) +" "+ character.map);

     send_cm("CakePriest", "pos "+Math.round(character.real_x)+" "+Math.round(character.real_y) +" "+ character.map);

// game_log("pos "+Math.round(character.real_x)+" "+Math.round(character.real_y)+" "+ character.map);
     //send_cm("CakeEater", this);
}
function buy_potions()
{
    var x=character.real_x,y=character.real_y,map=character.map;
    smart_move({to:"potions"},function(done){
        buy("hpot0",1000-quantity("hpot0"));
        buy("mpot0",5000-quantity("mpot0"));
        game_log("Got the potions!","#4CE0CC");
        smart_move({x:x,y:y,map:map});
    });
}
​
​
​
function auto_upgrade()
{
    if(state == "upgrade" && character.q.upgrade === undefined)
    {
        set_message("Upgrading");
    var scrollSlot = -1;
    var targetSlot = -1;
    var minLevel = 999;

    var scrolls = 0;
    var targets = 0;
