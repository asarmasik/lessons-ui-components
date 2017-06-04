TweenLite.ticker.fps(false);

var $banner = $("#banner"),
    $slide1 = $("#slide1"),
    $create = $("h1"),
    $stunning = $("h2"),
    $animations = $("h3"),
    $for = $("h4"),
    $deviceHead = $("#deviceHead"),
    $tablet = $("#tablet"),
    $desktop = $("#desktop"),
    $laptop = $("#laptop"),
    $learnMore = $("#learnMore"),
    $replay = $("#replay"),
    $slider = $("#slider"),
    timeline;

//CSSPlugin makes it much easy to set rotation, autoAlpha etc.
function initCSS() {
  TweenLite.set($animations, {rotation:90});
  TweenLite.set($for, {autoAlpha:0});
  TweenLite.set($deviceHead, {transformPerspective:600});
  TweenLite.set($tablet, {scale:0.34, y:18, x:-38});
  TweenLite.set($slider, {autoAlpha:0});
}

function getIntroTextTimeline() {
  var tl = new TimelineLite();
  tl.from($create, 0.4, {scale:0.2, autoAlpha:0, ease:Back.easeOut})
  .from($stunning, 0.2, {top:-60}, "+=0.1") //added 0.1 seconds after current end of timeline
  .from($animations, 0.4, {top:400, ease:Power2.easeIn})
  .to($slide1, 0.3, {rotation:-90, left:-125, top:26}, "rotateOut") //creates a label called "rotateOut" at current end of timeline and places tween there
  .to($stunning, 0.2, {left:-300}, "rotateOut") //adds tween at "rotateOut" label 
  .to($animations, 0.2, {left:30}, "+=0.2")
  .to($animations, 0.2, {left:122}, "for") //label marks the start of the reveal of the word "for"
  .to($for, 0.2, {autoAlpha:1}, "for")
  .add("introOut", "+=0.1")
  .to($for, 0.2, {autoAlpha:0, left:300}, "introOut")
  .to($animations, 0.2, {autoAlpha:0, top:"-=300px"}, "introOut")
  return tl;
}

function getDevicesTimeline() {
  var tl = new TimelineLite();
  tl.from($deviceHead, 0.5, {autoAlpha:0})
  .from($desktop, 0.5, {rotation:-50, transformOrigin:"50% 500px"}) //rotates around a point 500px below the element
  .add("desktopOut", "+=0.5")
  .to($deviceHead, 0.25, {rotationX:-90, transformOrigin:"50% 100%"}, "desktopOut") //rotates around bottom edge of element
  .to($desktop, 0.5, {rotation:50, transformOrigin:"50% 500px"}, "desktopOut")
  .add("laptopOut", "+=0.5")
  .to($deviceHead, 0.25, {rotationX:-90, transformOrigin:"50% 100%"}, "laptopOut")
  .to($laptop, 0.5, {rotation:50, transformOrigin:"50% 500px"}, "laptopOut")
  return tl;
}

function getTabletAnimation() {
  var tl = new TimelineLite();
  tl.fromTo("#tablet_end_screen", 0.6, { clip:"rect(125px 300px 125px 0px)"}, { clip:"rect(0px 300px 250px 0px)"}, "revealTablet")
  .to($tablet, 0.1, {scale:1, x:0, y:-10, ease:Back.easeOut}, "tabletGrow")
  .from($learnMore, 0.2, {autoAlpha:0, scale:0.1, ease:Back.easeOut})
  .add(TweenMax.to($learnMore, 0.5, {boxShadow:"0px 0px 20px 2px #d0487d", repeat:3, yoyo:true}), "+=0.8")
  .from("#replay", 0.4, {autoAlpha:0, rotation:"360_ccw"}, "-=1");
  return tl;
}
    
function createMasterTimeline() {
  timeline = new TimelineLite({onUpdate:updateSlider, onComplete:showSlider});
  timeline.set($banner, {autoAlpha:1})
    .add(getIntroTextTimeline(), 0.1) //add the first animation at a time of 0.1 seconds
    .add("devices", "-=0.1") //add "devices" label just 0.1 seconds before the end of the previous animation for a bit of overlap
    .add(getDevicesTimeline(), "devices") //add the second animation and the "devices" label
    .add(getTabletAnimation(), "tabletAnimation"); 
  timeline.timeScale(1) // put a 4 in there, I dare you ;)
}  

// *** config buttons *** 
$learnMore.mouseenter(function(e){
  TweenMax.fromTo($learnMore, 0.2, {boxShadow:"0px 0px 0px 0px #d0487d"}, {boxShadow:"0px 0px 20px 2px #d0487d", repeat:-1, yoyo:true});
});

$learnMore.mouseleave(function(e){
  TweenMax.to($learnMore, 0.2, {boxShadow:"0px 0px 0px 0px d0487d"});
});

$replay.mouseenter(function(e){
  TweenLite.to($replay, 0.5, {rotation:"+=360", alpha:1});
})
  
$replay.mouseleave(function(e){
  TweenLite.to($replay, 0.5, {alpha:0.6});
})

$replay.click(function(){
  timeline.restart();
});

// *** config jQueryUI Slider ***
$slider.slider({
  range: false,
  min: 0,
  max: 100,
  step:0.1,
  slide: function ( event, ui ) {
    timeline.pause();
    //adjust the timeline's progress() based on slider value
    timeline.progress( ui.value/100 );
    }
});	

//this function is called by timeline's onUpdate callback
function updateSlider() {
  $slider.slider("value", timeline.progress() *100);
} 		

//this function is called by timeline's onComplete callback
function showSlider(){
  TweenLite.to($slider, 0.5, {autoAlpha:1});
}

//get this started
initCSS();
createMasterTimeline();
