/**
* Main javascript file for the slide view.
* Define "slides" namespace that contains all the logic of the display and controller.
*
* @author Sebastien Domergue: https://github.com/corwinAmbre
* @version 0.1
*/
var slides = {
	// Slides objects list as returned by Polymer
	slides: null,
	// Max index of slides
	max: -1,
	// Presenter mode: 0 for standalone, 1 for server (or any positive), -1 for client (or any negative)
	mode: 0,
	client: null,

	/**
	* Initialization method.
	* - Load slides list in slides.slides (assumed that only one core-animated-pages node is present on the page)
	* - Compute number of slides (for further computation and controls)
	* - Define keys controls
	* - Call 2 other init methods :
	* 	@see updateNavBar
	* 	@see initSlideCarousel
	*/
	init: function() {
		slides.slides = document.querySelector('core-animated-pages');
		slides.max = $("core-animated-pages section").length - 1;
		$("#maxSlide").text(slides.max + 1);
		$("#gotoSlideNumber").attr("max", slides.max + 1);
		if(window.location.search.indexOf("presenterMode=client") > -1) {
			slides.mode = -1;
			window.addEventListener("message", slides.receiveMessage, false);
			slides.slides.onclick = null;
			if(window.location.search.indexOf("currentSlide=") > -1) {
				var slideToInit = window.location.search.substring(window.location.search.indexOf("currentSlide=") + 13);
				slides.changeSlideTo(slideToInit);
			}
		} else {
			$(document).keydown(function(event) {
				switch(event.which) {
					case 37: // Left arrow key
					case 38: // Up arrow key --> both keys are used to go to previous state
						slides.previous();
						break;
					case 13: // Enter key
					case 39: // Right arrow key
					case 40: // Down arrow key --> all keys are used to go to next state (click is also used to go to the next state but is bound with "onclick" on the DOM)
						slides.next();
						break;
					case 71: // 'G' key is used to open dialog for "Go-to slide"
						document.querySelector("#dialogGoToSlide").toggle();
						break;
					case 77: // 'M' key is used to toggle grid slide selection
						// Little tricks since polymer init is done after init methods.
						// We want that every elements of the slides to be visible when we select a slide
						$("#slideCarousel").find("animated-list li").css("opacity", 1);
						// Force overflow since visible is setup in style attribute by polymer
						$("#slideCarousel section").attr("style","position: relative;");
						$("#slideCarousel").removeClass("hidden");
						break;
					case 78: // 'N' key is used to toggle nav-bar at the bottom of the page
						$("#nav-bar").toggle();
						break;
					case 80: // 'P' key is used to start the presenter mode
						if(slides.mode == 0) {
							slides.presenterMode();
						}
						break;
					default:
				}
			});
			slides.initSlideCarousel();
		}
		$(".preventClickToNext").click(function(event) {
			event.stopPropagation();
		});
		slides.updateNavBar();
	},
	
	/**
	* Initialization method for slide grid/carousel.
	* - Duplicate html from the core-animated-pages tag to the slideCarousel object.
	* - Set opacity to 1 on animated list elements (do not work on loading, issue in concurrency loading)
	* - Add a "onclick" handler for each section that allows to display the selected slide on the presentation.
	*/
	initSlideCarousel: function() {
		$("#slideCarousel").html($("core-animated-pages").html());
		$("#slideCarousel").find("animated-list li").css("opacity", 1);
		$("#slideCarousel section").click(function() {
			$("#slideCarousel").addClass("hidden");
			slides.changeSlideTo(slides.max - $(this).nextAll().length);
		});
	},
	
	/**
	* Update nav-bar at the bottom of the page:
	* - Update current slide number display
	* - Update the progress bare indicator
	*/
	updateNavBar: function() {
		var current = (slides.slides.selected ? slides.slides.selected : 0) + 1;
		var currentPercent = current * 100 / (slides.max + 1);
		$("#currentSlide").text(current);
		$("#currentSlideProgressBar").attr("value", currentPercent);
	},
	
	/**
	* Return the slide object currently displayed on the presentation. Selected by "selected" index of the core-animated-pages object
	* @return Slide currently displayed on the main presentation view
	*/
	currentSlide: function() {
		return slides.slides.querySelectorAll('section')[slides.slides.selected];
	},
	
	/**
	* Move of one slide to the left or to the right. If it is impossible to move in the specified direction
	* (to the right on the last slide or to the left on the first one), do nothing. Call updateNavBar method at the end of the process.
	* @param {{Number}} Direction to move. If positive, move to the right, if negative, move to the left. 0 does nothing
	* @see updateNavBar
	*/
	changeSlide: function (direction) {
		if (direction > 0 && slides.slides.selected < slides.max) {
			slides.slides.selected += 1;
		}
		if (direction < 0 && slides.slides.selected > 0) {
			slides.slides.selected -= 1;
		}
		slides.updateNavBar();
	},
	
	/**
	* Go to a specified slide on the main presentation view.
	* Call updateNavBar method at the end of the process.
	* @param {{Number}} Number of the slide to move, 0-index based. If number is out of the slide index bounds, do nothing
	* @see updateNavBar
	*/
	changeSlideTo: function (slideNumber) {
		if(slides.mode > 0) {
			slides.client.postMessage("goto" + slideNumber, location.protocol + location.hostname + (location.port ? (":"+location.port) : ""));
		}
		if(slideNumber >= 0 && slideNumber <= slides.max) {
			slides.slides.selected = slideNumber;
		}
		slides.updateNavBar();
	},
	
	/**
	* Method calls when submitting Go To Slide dialog box.
	* Uses gotoSlideNumber input value for parameter to call changeSlideTo. Adjust the value to be 0-index based.
	* @see changeSlideTo
	*/
	gotoSlide: function() {
		if($("#gotoSlideNumber").val()) {
			slides.changeSlideTo($("#gotoSlideNumber").val() - 1);
		}
	},

	/**
	* Methods to display the next item.
	* First, will call the next method on animated-list elements of the current slide. 
	* If no next method is required on these elements, move to the next slide.
	* @see changeSlide
	*/
	next: function () {
		if(slides.mode > 0) {
			slides.client.postMessage("next", location.protocol + location.hostname + (location.port ? (":"+location.port) : ""));
		}
		var currentSlide = slides.currentSlide();
		var animatedLists = currentSlide.querySelectorAll('animated-list');
		var moveToNextSlide = true;
		if (animatedLists.length > 0) 
		{
			for(li = 0; li < animatedLists.length; li += 1) {
				if(animatedLists[li].next()) {
					moveToNextSlide = false;
					break;
				}
			}
		}
		if (moveToNextSlide) {
			slides.changeSlide(1);
		}
	},

	/**
	* Methods to go back to the previous item.
	* First, will call the previous method on animated-list elements of the current slide, starting with the last one. 
	* If no previous method is required on these elements, move to the previous slide.
	* @see changeSlide
	*/
	previous: function () {
		if(slides.mode > 0) {
			slides.client.postMessage("previous", location.protocol + location.hostname + (location.port ? (":"+location.port) : ""));
		}
		var currentSlide = slides.currentSlide();
		var animatedLists = currentSlide.querySelectorAll('animated-list');
		var moveToNextSlide = true;
		if (animatedLists.length > 0) 
		{
			for(li = animatedLists.length - 1; li >= 0; li -= 1) {
				if(animatedLists[li].previous()) {
					moveToNextSlide = false;
					break;
				}
			}
		}
		if (moveToNextSlide) {
			slides.changeSlide(-1);
		}
	},
	
	presenterMode: function() {
		slides.client = window.open(window.location + "?presenterMode=client&currentSlide=" + slides.slides.selected, "slideshowClient", "menubar=no, titlebar=no");
		slides.mode = 1;
	},
	
	receiveMessage: function(event) {
		if (event.origin.indexOf(location.hostname) > -1) {
			if(event.data == "next") {
				slides.next();
			}
			if(event.data == "previous") {
				slides.previous();
			}
			if(event.data.indexOf("goto") > -1) {
				slides.changeSlideTo(event.data.substring(4));
			}
		}
	}

};

// Launch init method once the document is ready
$(document).ready(slides.init);