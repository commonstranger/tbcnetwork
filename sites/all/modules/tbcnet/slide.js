;(function($) {
var curSlide, prevSlide, curScore, prevScore, audio, audCtrl, grfx, sonic, loader, muted = false;
jQuery(window).load(function() {
	grfx = {
		width: 100,
		height: 100,
		stepsPerFrame: 3,
		trailLength: 1,
		pointDistance: .01,
		fps: 30,
		step: 'fader',
		strokeColor: '#b1e7f0',
		setup: function() {
			this._.lineWidth = 6;
		},
		path: [
			['arc', 50, 50, 20, 360, 0]
		]
	}
	sonic = new Sonic(grfx);
	// Element creation util
	function getScr(src) {
		return '<source src="'+src+'"></source>';
	}
	// Returns a loop as a Boolean
	function loopValue(value) {
		return value <= 0 ? false : true;
	}
	function muteToggle() {
		if(audio) {
			muted =	audio[0].muted = (!audio[0].muted);
			var ext = muted ? 'off' : 'on';
			audCtrl.removeClass().addClass('audiocontrol-'+ext);
		}
	}
	jQuery('.flexslider').flexslider({
    		animation: "fade",
    		directionNav:true,
    		controlNav:false,
    		slideshowSpeed: 12000,
    		slideshow: false,
		animationLoop: false,
		start: function(slider) {
			loader = sonic.canvas;
			curSlide = jQuery('.flex-active-slide img');
			curScore = jQuery('.flex-active-slide img[data-score!="none"]').attr('data-score');
                	if(jQuery('.slides li img[data-score!="none"]').length > 0) {
                        	jQuery('.flexslider').append('<audio id="tbcnet-release-audio" type="audio/mpeg" class="tbcnet-release-audio" autoplay="false" preload="auto" volume=".3" loop="'+loopValue(curSlide.attr("data-loop-score"))+'"></audio>');
				audio = jQuery('#tbcnet-release-audio');
				jQuery('h1.page-title').after('<div id="audiocontrol" class="audiocontrol-on"></div>');
				audCtrl = jQuery('#audiocontrol');
				audCtrl.click(function(event) {
					muteToggle();
				});
                        	//
                       		// Note that append returned an odd Node related error here
                       		// Leaving comment and nonfunctional line for reference
                    		// jQuery('.flexslider audio').html(scores.join(" "));
                	}
			// Add the first audio source
			if(curScore) {
				audio.html(getScr(curScore));
			}
			//
			// Fade all slides except the first. This is done
			// because GIFs will not restart unless their src
			// attribute changes. Thus, their src attribute must
			// be rest and the cache invalidated. The cache must
			// be invalidated because caching the src locally
			// using the Image object does not work consistently
			// (the src is not always reset when using Image.src)
			//
			// Secondarily, we do this for the following reasons:
			//
			// 1. On the desktop, GIFs must replay when navigating
			// forward or back. Thus we must realod the image src
			// when navigating to a new slide. We fade out while 
			// loading, and back in when complete.
			//
			// 2. On mobile devices, the GIFs are all loaded and 
			// played at once. Thus we must reload the image src
			// when navigating to a new slide. We fade out while
			// loading, and back in when complete
			//
			fade(curSlide.attr('id'));
		},
		before: function(slider) {
			//
			// Note: 'before' happens prior to a slide transition,
			// so it is here that we set the previous slide
			//
			prevSlide = jQuery('.flex-active-slide img');
			prevSlide.off('click');
		},
		after: function(slider) {
			//
			// Fade all slides. The current slide will be
			// faded back in once its image src is reloaded
			//
			fade();
			curSlide = jQuery('.flex-active-slide img');
			// Get the new score and, if different than current, add the source
			var newScore = jQuery('.flex-active-slide img').attr('data-score');
                        if((curScore && newScore != 'none' && newScore != curScore )) {
				audio.setAttribute('loop', loopValue(curSlide.attr('data-loop-score')));
				jQuery('audio').html(getScr(newScore));
				// Set the current score if changed
				curScore = newScore;
			}
			else if(newScore == 'none') {
				audio.setAttribute('loop', loopValue(curSlide.attr('data-loop-score')));
				jQuery('audio')[0].pause();
			}
			// Reload the src and bust the cache
			var regex = /.*\.(gif|jpg|jpeg|png)/;
			var src = regex.exec(curSlide.attr('src'))[0]+'?b='+(1+Math.floor(Math.random()*10));
			jQuery('#content').before(loader);
			sonic.play();
			curSlide.load(function() {
				jQuery(this).fadeTo(200, 1);
				sonic.stop();
				jQuery(loader).remove();
                        });
			curSlide.click(function(event) {
				fsRequest(event);
			});
                        var timeout = setTimeout(function() {
				curSlide.attr('src', src);
                                clearTimeout(timeout);
                        }, 0);
		},
  	});
});

jQuery(document).ready(function() {
	// Stub	
});

function fade(exclude) {
	jQuery('#tbcnet-release  .slides img').each(function() {
		if(exclude != jQuery(this).attr('id')) {
			jQuery(this).fadeTo(0, 0);
		}
	}); 
}

function fsRequest(event) {
	var fsObj = document.getElementById('tbcnet-release');
	if(runPrefixMethod(document, 'FullScreen') || runPrefixMethod(document, 'IsFullScreen')) {
		runPrefixMethod(document, 'CancelFullScreen');
	}
	else {
		console.log('prefix: ' + runPrefixMethod(fsObj, 'RequestFullScreen'));
	}
}

// FS prefix
var pfx = ["webkit", "moz", "ms", "o", ""];
function runPrefixMethod(obj, method) {
	var p = 0, m, t;
	while (p < pfx.length && !obj[m]) {
		m = method;
		if (pfx[p] == "") {
			m = m.substr(0,1).toLowerCase() + m.substr(1);
		}
		m = pfx[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			pfx = [pfx[p]];
			return (t == "function" ? obj[m]() : obj[m]);
		}
		p++;
	}
}
}());
