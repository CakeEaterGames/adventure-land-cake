game_log("choosing class...");


$.getScript("https://cakeeatergames.github.io/adventure-land-cake/common.js",load_class);

function load_class()
{

  if(character.ctype == "merchant")
  {
    $.getScript("https://cakeeatergames.github.io/adventure-land-cake/merch.js");
  }
  else if(character.ctype == "warrior")
  {
    $.getScript("https://cakeeatergames.github.io/adventure-land-cake/warrior.js");
  }
  else if(character.ctype == "priest")
  {
    $.getScript("https://cakeeatergames.github.io/adventure-land-cake/priest.js");
  }
  else if(character.ctype == "mage")
  {
    $.getScript("https://cakeeatergames.github.io/adventure-land-cake/mage.js");
  }
  else {
    game_log("unknown class");
  }

game_log("DONE!");
}
