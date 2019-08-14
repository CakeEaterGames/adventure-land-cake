setInterval(update,1000/4);

setInterval(auto_upgrade,1000/2);
setInterval(combat,1000/8);

change_target();

var state = "idle";

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
	//game_log(scrollSlot);
	//game_log(targetSlot);
	//game_log(scrolls);
 	//game_log(targets);

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



function smart_heal()
{
	if(character.hp<character.max_hp*0.8)
	{
	   use('use_hp');
	}else if(character.mp<character.max_mp-400)
	{
	   use('use_mp');
	}
}
function combat()
{
	if(state == "pve")
	{

	loot();
	if(character.rip || is_moving(character)) return;

	var target=get_targeted_monster();

	if(!target)
	{
		target=get_nearest_monster({min_xp:100});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
//	if(target.target !== "CakeWarrior" && target.target !== undefined)
	if(target.target !== "CakeWarrior")
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
		set_message("Attacking");
		attack(target);
	}
	}

}

function on_cm(name, data)
{
	var args = data.split(' ');
	//game_log(args);

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



function handle_death() {
    setTimeout(respawn,15000);
	state = "idle";
    return true;
}
