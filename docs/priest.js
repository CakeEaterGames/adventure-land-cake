setInterval(update,1000/4);

setInterval(auto_upgrade,1000/2);
setInterval(combat,1000/4);

change_target();

var state = "idle";

function update()
{
	smart_heal();
	loot();
	request_potions();
}

function request_potions()
{
	var needHP = true;
	var needMP = true;

	var Length = character.items.length;
	for (var i = 0; i < Length; i++)
	{
		var a = character.items[i];
		if(a)
		{
			if(a.name == "mpot0" && a.q>100)
			{
				needMP = false;
			} else
			if(a.name == "hpot0" && a.q>100)
			{
				needHP = false;
			}
		}

	}
	if(needHP) send_cm("CakeWarrior", "hp_pot");
	if(needMP) send_cm("CakeWarrior", "mp_pot");
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

	var target = "helmet";

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
	}else if(character.mp<character.max_mp*0.5)
	{
	   use('use_mp');
	}
}

function combat(){

	if(state == "pve")
	{

	loot();

	if(character.rip || is_moving(character)) return;

	var leader = get_player("CakeWarrior");
	var mage = get_player("CakeEater");
	var priest = get_player("CakePriest");
	var target=get_target_of(leader);

	if(character.hp<character.max_hp-950)
	{
	   heal(character);
	}
	else if(leader.hp<leader.max_hp-950)
	{
	   heal(leader);
	}
	else if(mage.hp<mage.max_hp-950)
	{
	   heal(mage);
	}

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
		set_message("Attacking");
		attack(target);
		if(can_use("curse"))
		{
		   use_skill("curse");
		}

	}
	}
}

var isMoving = false;

function on_cm(name, data)
{
	var args = data.split(' ');
	//game_log(args);

	if(args[0] == "pos")
	{
		var l = Math.abs(character.real_x-args[1])+
			Math.abs(character.real_y-args[2]);
	if(!isMoving && l >250)
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

	}
}


function handle_death() {
    setTimeout(respawn,15000);
	state = "idle";
    return true;
} 
