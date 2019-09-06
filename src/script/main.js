$(function(){

jQuery.fn.exists = function () {
    return this.length !== 0;
};

const customCursor = function(){

	/**
	 * tutorial.js
	 * http://www.codrops.com
	 *
	 * Licensed under the MIT license.
	 * http://www.opensource.org/licenses/mit-license.php
	 *
	 * Copyright 2019, Codrops
	 * http://www.codrops.com
	 */

	// set the starting position of the cursor outside of the screen
	let clientX = -100;
	let clientY = -100;
	const innerCursor = document.querySelector(".cursor--small");

	const initCursor = () => {
	  // add listener to track the current mouse position
	  document.addEventListener("mousemove", e => {
	    clientX = e.clientX;
	    clientY = e.clientY;
	  });

	  // transform the innerCursor to the current mouse position
	  const render = () => {
	    TweenMax.set(innerCursor, {
	      x: clientX,
	      y: clientY
	    });

	    requestAnimationFrame(render);
	  };
	  requestAnimationFrame(render);
	};

	initCursor();

	let lastX = 0;
	let lastY = 0;
	let isStuck = false;
	let showCursor = false;
	let group, stuckX, stuckY, fillOuterCursor;

	const initCanvas = () => {
	  const canvas = document.querySelector(".cursor--canvas");
	  const shapeBounds = {
	    width: 75,
	    height: 75
	  };
	  paper.setup(canvas);
	  const strokeColor = "#131313";
	  const strokeWidth = 1;
	  const segments = 8;
	  const radius = 15;

	  // we'll need these later for the noisy circle
	  const noiseScale = 150; // speed
	  const noiseRange = 4; // range of distortion
	  let isNoisy = false; // state

	  // the base shape for the noisy circle
	  const polygon = new paper.Path.RegularPolygon(
	    new paper.Point(0, 0),
	    segments,
	    radius
	  );

	  polygon.strokeColor = strokeColor;
	  polygon.strokeWidth = strokeWidth;
	  polygon.smooth();
	  group = new paper.Group([polygon]);
	  group.applyMatrix = false;

	  const noiseObjects = polygon.segments.map(() => new SimplexNoise());
	  let bigCoordinates = [];

	  // function for linear interpolation of values
	  const lerp = (a, b, n) => {
	    return (1 - n) * a + n * b;
	  };

	  // function to map a value from one range to another range
	  const map = (value, in_min, in_max, out_min, out_max) => {
	    return (
	      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
	    );
	  };

	  // the draw loop of Paper.js
	  // (60fps with requestAnimationFrame under the hood)
	  paper.view.onFrame = event => {
	    // using linear interpolation, the circle will move 0.2 (20%)
	    // of the distance between its current position and the mouse
	    // coordinates per Frame
	    if (!isStuck) {
	      // move circle around normally
	      lastX = lerp(lastX, clientX, 0.2);
	      lastY = lerp(lastY, clientY, 0.2);
	      group.position = new paper.Point(lastX, lastY);

	      polygon.fillColor = "rgba(0, 0, 0, 0)";

	    } else if (isStuck) {
	      // fixed position on a nav item
	      lastX = lerp(lastX, stuckX, 0.2);
	      lastY = lerp(lastY, stuckY, 0.2);
	      group.position = new paper.Point(lastX, lastY);

	      polygon.fillColor = "rgba(0, 0, 0, .15)";

	      
	    }

	    if (isStuck && polygon.bounds.width < shapeBounds.width) {
	      // scale up the shape
	      polygon.scale(1.08);
	    } else if (!isStuck && polygon.bounds.width > 30) {
	      // remove noise
	      if (isNoisy) {
	        polygon.segments.forEach((segment, i) => {
	          segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
	        });
	        isNoisy = false;
	        bigCoordinates = [];
	      }
	      // scale down the shape
	      const scaleDown = 0.92;
	      polygon.scale(scaleDown);
	    }

	    // while stuck and big, apply simplex noise
	    if (isStuck && polygon.bounds.width >= shapeBounds.width) {
	      isNoisy = true;
	      // first get coordinates of large circle
	      if (bigCoordinates.length === 0) {
	        polygon.segments.forEach((segment, i) => {
	          bigCoordinates[i] = [segment.point.x, segment.point.y];
	        });
	      }

	      // loop over all points of the polygon
	      polygon.segments.forEach((segment, i) => {
	        // get new noise value
	        // we divide event.count by noiseScale to get a very smooth value
	        const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
	        const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

	        // map the noise value to our defined range
	        const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
	        const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

	        // apply distortion to coordinates
	        const newX = bigCoordinates[i][0] + distortionX;
	        const newY = bigCoordinates[i][1] + distortionY;

	        // set new (noisy) coodrindate of point
	        segment.point.set(newX, newY);
	      });
	    }
	    polygon.smooth();
	  };
	};

	initCanvas();

	const initHovers = () => {
	  // find the center of the link element and set stuckX and stuckY
	  // these are needed to set the position of the noisy circle
	  const handleMouseEnter = e => {
	    const navItem = e.currentTarget;
	    const navItemBox = navItem.getBoundingClientRect();
	    stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
	    stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
	    isStuck = true;
	  };

	  // reset isStuck on mouseLeave
	  const handleMouseLeave = () => {
	    isStuck = false;
	  };

	  // add event listeners to all items
	  const linkItems = document.querySelectorAll(".link");
	  linkItems.forEach(item => {
	    item.addEventListener("mouseenter", handleMouseEnter);
	    item.addEventListener("mouseleave", handleMouseLeave);
	  });

	};

	initHovers();


	// Reset hover on page change
	document.addEventListener('swup:contentReplaced', event => {
		isStuck = false;
		initHovers();
	});

	
};
customCursor();


const menu = ()=>{
	
	const menu = $('.main-header__menu');
	const bg_1 = $('.main-header__bg--1');
	const bg_2 = $('.main-header__bg--2');
	const content = $('.main-header__content');
	const menu_list = $('.main-header__menu-list');


	const toggleMenuVisibility = ()=>{

		tl = new TimelineLite();
		CustomEase.create( "menu-slide", "0.85,-0.01, 0.93, 0.75" );
		CustomEase.create( "menu-content-slider", ".25,.1,.25,1" );



		const open = function(){

			const btn = $('.main-header__button_container');
			btn.removeClass('is-closed');
			btn.addClass('is-opened');

			btn.find('.main-header__button span').text('Fermer');

			tl.to( menu, 0, {display:"block"})
				.to(  bg_1, .65, { width:"100%", ease: "menu-slide" })
				.to( menu, 0, {backgroundColor:"#e8e8e8"})
				.to(  bg_2, .65, { width:"100%", ease: "menu-slide" }, "-=.55")
				.to(  content, 0, { display:"block"})
				.to(  menu_list, .3, { opacity:"1", transform: "matrix(1, 0, 0, 1, 0, 0)", ease: "menu-content-slider"})
				.to( $('body'), 0, {css:{className:'+=no-scroll'}});
		}

		const close = function(){

			

			const btn = $('.main-header__button_container');
			btn.addClass('is-closed');
			btn.removeClass('is-opened');

			btn.find('.main-header__button span').text('Menu');

			tl.to(  menu_list, .45, { opacity:"0", transform: "matrix(1, 0, 0, 1, -158.7, 0)", ease: CustomEase.create( "ease-out", ".42,0,.58,1" )})
				.to(  content, 0, { display:"none"})
				.to( menu, 0, {backgroundColor:"transparent"})
				.to(  bg_2, .35, { width:"0", ease: "menu-slide"})
				.to(  bg_1, .35, { width:"0", ease: "menu-slide"} , "-=.2")
				.to( menu, 0, {display:"none"})
				.to( $('body'), 0, {css:{className:'-=no-scroll'}}, "+=1");
		}

		// Opening
		$(document).on("click", ".main-header__button_container.is-closed", function() { open(); });

		// Closing
		$(document).on("click", ".main-header__button_container.is-opened", function() { close(); });
		$(document).on("click", ".main-header__menu a", function() { close(); });

	}

	toggleMenuVisibility();

}
menu();



const menuItemManager = ()=>{
	
	let page = window.location.pathname.split('/')[ window.location.pathname.split.length ].split('.')[0];

	const switchCurrentItem = ( path )=>{
		const dir = './';
		const trail = '.html';
		const a = $('.main-header__menu-item a[href="'+ dir + path + trail + '"]');
		a.parent('.main-header__menu-item').addClass('is-current');
	};


	const initCurrentMenu = ()=>{

		$('.main-header__menu-item').removeClass('is-current');
		
		if( page == ''){
			page = 'index';
		}

		switchCurrentItem( page );

	}
	initCurrentMenu();


	const changeActiveMenuOnUrlPopstate = ( )=>{
		document.addEventListener('swup:contentReplaced', event => {

			let page = window.location.pathname.split('/')[ window.location.pathname.split.length ].split('.')[0];
		    $('.main-header__menu-item').removeClass('is-current');
		    switchCurrentItem( page );
		});
	}
	changeActiveMenuOnUrlPopstate();

}
menuItemManager();



const typeWrite = ()=>{


	var options = {
	  strings: ["Sémiot", "Sensorielle"],
	  typeSpeed: 150
	}

	setTimeout(function(){
		var typed = new Typed(".main-content__degree--morph", options);
	}, 1500)
	

}
if( $('.main-content__degree--morph').exists() ){ typeWrite(); }



document.addEventListener('swup:contentReplaced', event => {

	if( $('.main-content__degree--morph').exists() ){ typeWrite(); }
	
});

const swupPageTransition = ()=>{

		let options = {
		    linkSelector:
		    'a[href^="' +
		    window.location.origin +
		    '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="./"]:not([data-no-swup])',
		    debugMode: true,
		};

		const swup = new Swup(options);

}

swupPageTransition();



let timeoutId1;
$(document).on("click", ".main-content__page-controlers a", function() { 
	
	clearTimeout(timeoutId1);
	timeoutId = setTimeout(()=>{

		let body = $("html, body");
		$(body).animate({scrollTop:0}, '500');
	}, 850);
});


let progressivePagination = ()=>{


	if( !$('#main-content__circle-canvas').exists()){ return ;}
	
	let counter = document.getElementById('main-content__circle-canvas').getContext('2d');
	
    var no = $(window).scrollTop(); // Starting Point
    var nmax = $(document).height() - $(window).height();
    var pointToFill = 4.72;  //Point from where you want to fill the circle
    var cw = counter.canvas.width;  //Return canvas width
    var ch = counter.canvas.height; //Return canvas height
    var diff;   // find the different between current value (no) and trageted value (100)
    
   	if(no >= nmax + 5)
    {
         return;     //fill is a variable that call the function fillcounter()
    }

    diff = ((no/nmax) * Math.PI*2);
    
    counter.clearRect(0,0,cw,ch);   // Clear canvas every time when function is call
    
    counter.lineWidth = 2;     // size of stroke
    
    counter.fillStyle = '#333333';     // color that you want to fill in counter/circle
    
    counter.strokeStyle = '#333333';    // Stroke Color
    
    
    counter.beginPath();
    counter.arc(24,24,23,pointToFill,diff+pointToFill);    //arc(x,y,radius,start,stop)
    
    counter.stroke();   // to fill stroke
    
}
progressivePagination();

window.addEventListener('scroll', ()=>{

	progressivePagination();

})

});


