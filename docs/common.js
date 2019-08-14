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
