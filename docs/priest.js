​
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
​
function combat(){
​
    if(state == "pve")
    {

    loot();
​
    if(character.rip || is_moving(character)) return;
​
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
​
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
