var warrior = get_player("CakeWarrior");
var mage = get_player("CakeEater");
var priest = get_player("CakePriest");
var merch = get_player("CakeMerch");

change_target();

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
    var scrollSlot = -1;
    var targetSlot = -1;
    var minLevel = 999;

    var scrolls = 0;
    var targets = 0;

    var target = "shoes";

    var Length = character.items.length;
    for (var i = 0; i < Length; i++)
    {
      var a = character.items[i];
      if(a)
      {
        switch(a.name)
        {
          case target:
          if(a.level<minLevel)
          {
            targetSlot = i;
            minLevel = a.level;
          }
          targets++;
          break;

          case "scroll0":
          scrollSlot = i;
          scrolls+=a.q;
          break;
        }
      }
    }
    if(scrolls<=0)
    {
      buy("scroll0");
      return 0;
    }
    if(targets<=1)
    {
      buy(target);
      return 0;
    }
    upgrade(targetSlot,scrollSlot);
  }
}
