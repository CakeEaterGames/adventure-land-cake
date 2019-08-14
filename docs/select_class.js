game_log("choosing class...");

if(character.ctype == "merchant")
{
  $.getScript("https://cakeeatergames.github.io/adventure-land-cake/merch.js", function() {
    game_log("merchant");
  });
}
else if(character.ctype == "warrior")
{
  $.getScript("https://cakeeatergames.github.io/adventure-land-cake/warrior.js", function() {
    game_log("merchant");
  });
}
else if(character.ctype == "priest")
{
  $.getScript("https://cakeeatergames.github.io/adventure-land-cake/priest.js", function() {
    game_log("merchant");
  });
}
else if(character.ctype == "mage")
{
  $.getScript("https://cakeeatergames.github.io/adventure-land-cake/mage.js", function() {
    game_log("merchant");
  });
}else {
    game_log("unknown class");
}


game_log("DONE!");
