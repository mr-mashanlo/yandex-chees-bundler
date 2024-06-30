import Slider from './slider.js';
import ticker from './ticker.js';

document.addEventListener( 'DOMContentLoaded', () => {

  ticker( { element: '.ticker' } );

  if ( window.outerWidth < 500 ) {
    new Slider( { element: '.stage-slider', items: 1, indicator: 'dots' } );
  }

  new Slider( { element: '.member-slider', items: 3, autoplay: true, loop: true } );

} );
