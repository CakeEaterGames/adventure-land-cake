change_target();

var time = 0;

var warrior = get_player("CakeWarrior");
var mage = get_player("CakeEater");
var priest = get_player("CakePriest");
var merch = get_player("CakeMerch");

function setPlayers() {
  warrior = get_player("CakeWarrior");
  mage = get_player("CakeEater");
  priest = get_player("CakePriest");
  merch = get_player("CakeMerch");
}



function handle_death() {
  setTimeout(respawn,15000);
  state = "idle";
  return true;
}

var keepItems = ["mpot0","hpot0","mpot1","hpot1","tracker"];

function give_items_to_merch()
{
  var Length = character.items.length;
  for (var i = 0; i < Length; i++)
  {
    var a = character.items[i];
    if(a)
    {
      if(!keepItems.includes(a.name)){
        send_item(merch, i, a.q)
      }
    }
  }
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

function smart_heal()
{

    if(character.hp<character.max_hp-400 && can_use("use_hp") )
    {
      use('use_hp');
    }
    else if(character.mp<character.max_mp-400 && can_use("use_mp"))
    {
      use('use_mp');
    }

}



function find_item(name)
{
  for(var i=0;i<42;i++)
  {
    if(character.items[i] && character.items[i].name==name) return character.items[i];
  }
  return -1;
}
function find_item_index(name)
{
  for(var i=0;i<42;i++)
  {
    if(character.items[i] && character.items[i].name==name) return i;
  }
  return -1;
}


function auto_combine()
{
  if(quantity("cscroll0")<=0)
  {
    buy("cscroll0");
    return 0;
  }

  var done = false;
  if(character.q.compound === undefined)
  {
    for(var i=0;i<42;i++)
    {
      if(!character.items[i]) continue;
      var item=character.items[i];
      var def=G.items[item.name];
      if(!def.compound) continue; // check whether the item can be compounded
      for(var j=i+1;j<42;j++)
      {
        if(!character.items[j]) continue;
        if(character.items[j].name!=character.items[i].name) continue;
        if(character.items[j].level!=character.items[i].level) continue;
        for(var k=j+1;k<42;k++)
        {
          if(!character.items[k]) continue;
          if(character.items[k].name!=character.items[i].name) continue;
          if(character.items[k].level!=character.items[i].level) continue;
          if(!done) // to prevent combining multiple items in one loop
          {
            var offering=null;
            // if(item.level==2) offering=find_item_index("offering");
            if(item_grade(item)==2) continue; // rare item
            if(item_grade(item)==0) compound(i,j,k,find_item_index("cscroll0"),offering);
            if(item_grade(item)==1) compound(i,j,k,find_item_index("cscroll1"),offering);
            done=true;
          }
        }
      }
    }
  }
}


function auto_upgrade()
{
  if(state == "upgrade" && character.q.upgrade === undefined)
  {
    set_message("Upgrading");
    var scrollSlot = find_item_index("scroll0");
    var targetSlot = -1;

    var scrolls = quantity("scroll0");
    var Length = character.items.length;
    for (var i = 0; i < Length; i++)
    {
      var a = character.items[i];
      if(a)
      {
        if(!parent.G.items[a.name].upgrade) continue;
        if(a.level<parent.G.items[a.name].grades[0]-1)
        {
          game_log(i);
          targetSlot = i;
          break;
        }
      }
    }
    if(scrolls<=0)
    {
      buy("scroll0");
      return 0;
    }

    upgrade(targetSlot,scrollSlot);
  }
}

set_party();
setInterval(set_party,5000);

function set_party() {
  if(!character.party){
    if(character.name == "CakeWarrior")
    {
      accept_party_invite("CakeEater");
      accept_party_invite("CakePriest");
      accept_party_invite("CakeMerch");
    }else {
      send_party_request("CakeWarrior");
    }
  }
}

function on_party_invite(name)
{
  if (name == "CakeWarrior" || name == "CakeEater" || name == "CakeMerch" || name == "CakePriest"){
    accept_party_invite(name);
  }
}
function on_party_request(name)
{
  if (name == "CakeWarrior" || name == "CakeEater" || name == "CakeMerch" || name == "CakePriest"){
    accept_party_request(name);
  }
}
