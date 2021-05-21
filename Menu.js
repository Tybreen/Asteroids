var TimesList = [];

var Title = true;

var InitialsPrompt = "TJB";



function GameOverMenu() {
  
  textAlign(CENTER);
  
  textSize(100);
  fill(150, 0, 0);
  text("Game Over!", CanvasWidth / 2, 100);

  textSize(25);

  text("Click to Enter in Initials -->", CanvasWidth / 2 - 250, 155);
  
  textSize(35);

  text("High Scores!", CanvasWidth / 2, 260);

  for(var i = 0; i < Math.min(TimesList.length, 5); i++) {
    
    fill(150, 0, 0);
    text(TimesList[i][0] + ", " + TimeConverter(TimesList[i][1]), CanvasWidth / 2, 320 + i * 50);
  }
  
  
  for(i = 0; i < 5; i++) {
    
    noStroke();
    
    text(i + 1 + ".", (CanvasWidth / 2) - 95, 320 + i * 50);
    
    strokeWeight(2);
    stroke(150, 0, 0);
    
    line((CanvasWidth / 2) - 110, 325 + i * 50, (CanvasWidth / 2) + 110, 325 + i * 50);
    
    strokeWeight(1);
  }
  
  
  drawSprite(RestartButton);
  
  textSize(40);
  text("Restart Game", CanvasWidth / 2, CanvasHeight - 90);
  
  
  drawSprite(ChangeInitialsButton);
  
  
  textSize(30);
  text(InitialsPrompt + ", " + TimeConverter(TotalTime), CanvasWidth / 2, 160);
  
}


function TimeConverter(TotalTime) {
  
  var TotalTimeMin = Math.floor((TotalTime / 1000) / 60);
  var TotalTimeSec = Math.floor((TotalTime / 1000) - (60 * TotalTimeMin));
  var StringSec = "";
  
  if(TotalTimeSec < 10) StringSec = "0";
  
  StringSec += TotalTimeSec;
  
  return TotalTimeMin + ":" + StringSec;
   
}



function TitleMenu() {
  
  textAlign(CENTER);
  
  textSize(100);
  fill(0, 150, 0);
  text("ASTEROIDS", CanvasWidth / 2, 100);
  
  textSize(30);
  
  text("<  >  = Turning", CanvasWidth / 2, 200);
  
  text("^  = Thrust", CanvasWidth / 2, 250);
  
  text("SpaceBar = Shoot", CanvasWidth / 2, 300);


  
  
  textSize(40);
  
  text("The Goal?  SURVIVE!", CanvasWidth / 2, 400);
  
  
  drawSprite(RestartButton);
  
  text("Start Game", CanvasWidth / 2, CanvasHeight - 90);
  
}




function SetInitials() {
  
  var TempPrompt = prompt("");
  
  if(TempPrompt != "" && TempPrompt != null) {
    
    InitialsPrompt = TempPrompt.slice(0, 3);
  }
  
}



function AddScore() {
    
  TimesList.push([InitialsPrompt, TotalTime]);

  TimesList.sort(function(a,b) {

  return b[1]-a[1];
  })

}

