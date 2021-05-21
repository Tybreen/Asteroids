/*

NOTE: 

/Could not figure out how to use sound.
/Would love to fix but can't figure out how to.

/Tyler/

*/

/*
function testError() {
  console.error("Error");
  }

function testSuccess() {
  console.warn("Success");
  }*/

function preload() {
  /*
  soundFormats('mp3', 'wav');
  
  BackgroundMusic = loadSound("mp3/music_background.wav", testSuccess, testError);
  WonMusic = loadSound("Mp3/Jingle_Win_01.mp3", testSuccess, testError);
  EngineSound = loadSound("Mp3/SpaceShip_Engine_Large_Loop_00.mp3", testSuccess, testError);
  LazerSound = loadSound("Mp3/Laser/Laser_09.mp3", testSuccess, testError);
  AstroidExplosionSound = loadSound("Mp3/explosion_asteroid.wav", testSuccess, testError);
  PlayerDyingSound = loadSound("Mp3/explosion_player.wav", testSuccess, testError);
  */

 

  PlayerImageWithBurn = loadImage("Ship.png");
  PlayerImageWithOutBurn = loadImage("Ship NO BURN.png");
  PlayerImageWithBurnWithShield = loadImage("Ship With Shield.png");
  PlayerImageWithOutBurnWithShield = loadImage("Ship No Burn With Shield.png");
  
  SamsShip = loadImage("Sams Ship.png");
  
  AsteroidPic = loadImage("Asteroid.png");
  
  FragmentPic = loadImage("Fragment.png");
  
}

var CanvasWidth;
var CanvasHeight;


function setup() {

  
  CanvasWidth = windowWidth;
  CanvasHeight = windowHeight;
  
  createCanvas(CanvasWidth, CanvasHeight);
  
  
  Player = createSprite(100, 100);
  
  Player.addImage("Sams Ship", SamsShip);
  
  Player.addImage("Burn", PlayerImageWithBurn);
  Player.addImage("BurnWithShield", PlayerImageWithBurnWithShield);
  Player.addImage("NoBurnWithShield", PlayerImageWithOutBurnWithShield);
  
  Player.addImage("NoBurn", PlayerImageWithOutBurn);
  
  
  Player.setDefaultCollider();
  
  //Player.setCollider("rectangle", 0, 0, 100, 100);
  
  
  RestartButton = createSprite(CanvasWidth / 2, CanvasHeight - 100, 300, 75);
  
  RestartButton.shapeColor = color(75);
  
  RestartButton.onMousePressed = function() {
    
    GamePlaying = true;
    
    if(Title == false) AddScore();
    
    Title = false;
    
    Reset();
  }
  
  RestartButton.onMouseOver = function() {
    
    cursor(HAND);
  }
  
  RestartButton.onMouseOut = function() {
    
    cursor(ARROW);
  }
  
  
  ChangeInitialsButton = createSprite(CanvasWidth / 2, 150, 200, 50);
  
  ChangeInitialsButton.shapeColor = color(75);
  
  ChangeInitialsButton.onMouseReleased = function() {
    
    SetInitials();
  }
  
  ChangeInitialsButton.onMouseOver = function() {
    
    cursor(TEXT);
  }
  
  ChangeInitialsButton.onMouseOut = function() {
    
    cursor(ARROW);
  }
  
  
  Lazers = new Group();
  Astroids = new Group();
  Fragments = new Group();
  
  StartShieldRegen();
  
  setInterval(SpawnAstroids, 1000);

  setInterval(Cleaner, 10000);
  
  //useQuadTree(true);
}


function Reset() {
  
  Player.position.x = 100;
  Player.position.y = 100;
  Player.setSpeed(0);
  Player.rotation = 0;
  
  while(Lazers.length >= 1) {
    Lazers.get(0).remove();
  }
  
  while(Astroids.length >= 1) {
    Astroids.get(0).remove();
  }
  
  while(Fragments.length >= 1) {
    Fragments.get(0).remove();
  }
  
  TotalTime = 0;
  TimeSec1 = 0;
  TimeSec2 = 0;
  TimeMin1 = 0;
  TimeMin2 = 0;
  
  Health = 1000;
  Shield = 1000;
}



function draw() {
  
  background(0);

  CanvasWidth = windowWidth;
  CanvasHeight = windowHeight;
  
  
  if(GamePlaying && !Title) {
    
    drawSprite(Player);
    drawSprites(Lazers);
    drawSprites(Astroids);
    drawSprites(Fragments);
    PlayerMovement();
    PlayerLazers();
    Collisions();
    HudDisplay();
  }
  
  if(!GamePlaying && !Title) {
    
    GameOverMenu();
  }
  
  if(Title) {
    
    TitleMenu();
  }
  
  //if(Title || GamePlaying) BackgroundMusic.play();
  
  if(keyIsDown(68)) GamePlaying = false;
  
  //"console.logs"
  
  //console.error(":");
  //console.warn(":");
  //console.log("Speed " + Player.getSpeed());
  //console.log("Lazers " + Lazers.length);
  //console.log("Astroids " + Astroids.length);
  //console.log("Fragments " + Fragments.length);
  //console.log(DegreeOffOfCurrentLaser);
  
}


var Player;
var PlayerImageWithBurn;
var PlayerImageWithOutBurn;
var PlayerImageWithBurnWithShield;
var PlayerImageWithOutBurnWithShield;
var SamsShip;
var SamMode = false;
var AsteroidPic;
var FragmentPic;
var GamePlaying = false;
var RestartButton;
var ChangeInitialsButton;
var Health = 1000;
var Shield = 1000;
var RegenTimeout = null;
var RegenInterval = null;
var RotatingSpeed = 5;
var ThrustSpeed = 5;
var MaxSpeed = 8;
var Lazers;
var CurrentLazer;
var DegreeOffOfCurrentLaser;
var RateOfFire = 200;
var TimeSinceFired = RateOfFire;
var Astroids;
var CurrentAstroid;
var Fragments;
var TotalTime = 0;
var TimeSec1 = 0;
var TimeSec2 = 0;
var TimeMin1 = 0;
var TimeMin2 = 0;
/*
var BackgroundMusic;
var WonMusic;
var EngineSound;
var LazerSound;
var AstroidExplosionSound;
var PlayerDyingSound;
*/


function PlayerMovement() {
  
  if(keyIsDown(LEFT_ARROW)) {
     Player.rotation -= RotatingSpeed;
  }
  
  if(keyIsDown(RIGHT_ARROW)) {
     Player.rotation += RotatingSpeed;
  }
  
  
  if(keyIsDown(UP_ARROW)) {
    Player.addSpeed(ThrustSpeed * deltaTime / 1000, Player.rotation);
    //EngineSound.play();
    
    
    if(SamMode) Player.changeImage("Sams Ship");
    
    
    else if(Shield == 0) {
      Player.changeImage("Burn");
    }
    else {
      Player.changeImage("BurnWithShield");
    }
  }
  
  else if(!keyIsDown(UP_ARROW)) {
    
    if(SamMode) Player.changeImage("Sams Ship");
    
    
    else if(Shield == 0) {
      Player.changeImage("NoBurn");
    }
    
    else {
      Player.changeImage("NoBurnWithShield");
    }
    
  }
  
  
  if(Player.getSpeed() <= 0.15 && !keyIsDown(UP_ARROW)) Player.setSpeed(0);
  
  
  
  var s = Player
  if(s.position.x < 20) {
    s.position.x = 21;
    s.velocity.x = abs(s.velocity.x);
  }

  if(s.position.x > width - 20) {
    s.position.x = width - 21;
    s.velocity.x = -abs(s.velocity.x);
  }

  if(s.position.y < 20) {
    s.position.y = 21;
    s.velocity.y = abs(s.velocity.y);
  }

  if(s.position.y > height - 20) {
    s.position.y = height - 21;
    s.velocity.y = -abs(s.velocity.y);
  }
  
  Player.limitSpeed(MaxSpeed);
  

  if(keyIsDown(83) && keyIsDown(65) && keyIsDown(77)) SamMode = true;
  if(keyIsDown(78)) SamMode = false;

}


function PlayerLazers() {
  
  TimeSinceFired += deltaTime;
  
  if(keyIsDown(32) && TimeSinceFired >= RateOfFire) {
    
    if(!SamMode) TimeSinceFired = 0;
    
    CurrentLazer = createSprite(Player.position.x, Player.position.y , 20, 4);
    
    
    if(!SamMode) CurrentLazer.shapeColor = "green";

    //LazerSound.play();
    
    DegreeOffOfCurrentLaser = random(-3, 3);
    
    CurrentLazer.setSpeed(10, Player.rotation + DegreeOffOfCurrentLaser);

    if(SamMode) CurrentLazer.setSpeed(30, Player.rotation + DegreeOffOfCurrentLaser);
    
    CurrentLazer.rotation = (Player.rotation + DegreeOffOfCurrentLaser);
    
    CurrentLazer.setDefaultCollider();
    
    Lazers.add(CurrentLazer);
  }
  
}

function HudDisplay() {
  
  if(SamMode) {
    
    textSize(40);
    fill(random(230), random(230), random(230));
    text("SAM MODE ACTIVATE!", 150, 50);
    
  }
  textSize(12);
  
  
  if(Player.position.x > 130 || Player.position.y > 85) {
  
    noStroke();
    fill(100);
    rect(5, 5, 110, 65);
  }
  
  noStroke();
  
  fill(0, 0, 150);
  if(SamMode)fill(0, 0, random(255));

  text("Shield", 10, 18);
  rect(10, 20, Shield / 10, 10);
  
  
  fill(150, 0, 0);
  if(SamMode)fill(random(255), 0, 0);

  text("Health", 10, 48);
  rect(10, 50, Health / 10, 10);
  
   
  
  if(Player.position.x < CanvasWidth - 65 || Player.position.y < CanvasHeight - 55) {
    
  fill(100);
  rect(CanvasWidth - 50, CanvasHeight - 40, 45, 35);
  }
  
    
  fill(200, 200, 0);
  text("Speed", CanvasWidth - 45, CanvasHeight - 25);
  text(Math.floor(Player.getSpeed() / MaxSpeed * 100 + 0.5), CanvasWidth - 45, CanvasHeight - 10);
  
  
  if(Player.position.x < CanvasWidth - 90 || Player.position.y > 55) {
  
    noStroke();
    fill(100);
    rect(CanvasWidth - 70, 5, 65, 35);
  }
  
  
  
  TimeSec1 += deltaTime;
  TotalTime += deltaTime;
  
  if(Math.floor(TimeSec1 / 1000) == 10) {
    
    TimeSec2++;
    TimeSec1 = 0;
  }
  
  if(TimeSec2 == 6) {
    
    TimeMin1++;
    TimeSec2 = 0;
  }
  
  if(TimeMin1 == 10) {
    
    TimeMin2++;
    TimeMin1 = 0;
  }
  
  
  
  fill(0, 200, 0);
  textSize(20);
  
  text(Math.floor(TimeSec1 / 1000), CanvasWidth - 20, 30);
  
  
  text(TimeSec2, CanvasWidth - 32, 30);
  
  text(":", CanvasWidth - 40, 30);
  
  text(TimeMin1,  CanvasWidth - 53, 30);
  
  text(TimeMin2, CanvasWidth - 65, 30);
  
  
}


function TakeDamage(Damage) {
  
  Shield -= Damage;
  
  RestartShieldRegen(1000);
  
  if(Shield < 0) {
    Health += Shield;
    Shield = 0;
    
    RestartShieldRegen(3000);
  }
  
  if(Health <= 0) {

    GamePlaying = false;
    /*
    PlayerDyingSound.play();
    setTimeout(function(){WonMusic.play()}, 2000);
    */
  }
  
}


function RestartShieldRegen(Delay) {
  clearTimeout(RegenTimeout);
  
  clearInterval(RegenInterval);
  RegenTimeout = setTimeout(StartShieldRegen, Delay);
}

function StartShieldRegen() {
  
  RegenInterval = setInterval(ShieldRegen, 20);
}


function ShieldRegen() {
   
  if(Shield < 1000) Shield += 1;
}


function SpawnAstroids() {
  
  var RandomX = random(CanvasWidth);
  var RandomY = random(CanvasHeight);
  
  var RandomSide = Math.floor(random(4));
  
  var Trajectory;
  
  var Margin = 10;
  
  if(RandomSide == 0) {
    RandomY = -Margin;
    
    Trajectory = random(45, 135);
  }
  if(RandomSide == 1) {
    RandomX = CanvasWidth + Margin;
    
    Trajectory = random(135, 225);
  }
  if(RandomSide == 2) {
    RandomY = CanvasHeight + Margin;
    
    Trajectory = random(225, 315);
  }
  if(RandomSide == 3) {
    RandomX = -Margin;
    
    Trajectory = random(-45, 45);
  }
  
  CurrentAstroid = createSprite(RandomX, RandomY, 20, 20);
  
  CurrentAstroid.addImage("AsteroidPic", AsteroidPic);
  
  
  CurrentAstroid.setSpeed(0.5, Trajectory);
  
  CurrentAstroid.Trajectory = Trajectory;
  
  CurrentAstroid.setCollider("rectangle", 0, 0, 20, 20);
  
  Astroids.add(CurrentAstroid);
}


function Collisions() {
  
  Lazers.collide(Astroids, AstroidsExplosionByLazer);
  Lazers.collide(Fragments, FragmentsExplosionByLazer);
  Player.collide(Astroids, AstroidsExplosionByShip);
  Player.collide(Fragments, FragmentsExplosionByShip);
  
}


function CreateFragment(OffSet, Astroid) {
    
  var Fragment = createSprite(Astroid.position.x, Astroid.position.y, 10, 10);
  
  Fragment.addImage("FragmentPic", FragmentPic);
  
  Fragment.shapeColor = "lightgray";
  Fragment.setSpeed(1, Astroid.Trajectory + OffSet);
  
  Fragments.add(Fragment);
    
  Fragment.setCollider("rectangle", 0, 0, 10, 10);
  
    
}

function AstroidsExplosionByLazer(Lazer, Astroid) {
  
  Lazer.remove();
  Astroid.remove();
  
  CreateFragment(90, Astroid);
  CreateFragment(-90, Astroid);
  
}

function AstroidsExplosionByShip(Player, Astroid) {
  
  //AstroidExplosionSound.play();

  Astroid.remove();
  
  Astroids.remove(Astroid);
  
  if(!SamMode) TakeDamage(300);
  
}

function FragmentsExplosionByShip(Player, Fragment) {
  
  Fragment.remove();
  
  Fragments.remove(Fragment);
  
  if(!SamMode) TakeDamage(100);
  
}

function FragmentsExplosionByLazer(Lazer, Fragment) {
  
  Lazer.remove();
  Fragment.remove();
}



function Cleaner() {
  
  CleanGroup(Lazers);
  CleanGroup(Astroids);
  CleanGroup(Fragments);
}

function CleanGroup(SpriteGroup) {
  
  for(var i = 0; i < SpriteGroup.length;i++) {
    
    var Item = SpriteGroup.get(i);
    
    if(Item.position.x <= -15 || Item.position.x >= CanvasWidth + 15 || Item.position.y <= -15 || Item.position.y >= CanvasHeight + 15) {
      
      Item.remove();
      
      i--;
      
    }
  }
}




//Thank you Codey for helping me make this game.
