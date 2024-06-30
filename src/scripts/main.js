import Slider from './slider.js';
import Ticker from './ticker.js';

document.addEventListener( 'DOMContentLoaded', () => {

  new Ticker( {
    element: '.ticker'
  } );

  if ( window.outerWidth < 500 ) {
    new Slider( {
      element: '.stage-slider',
      items: 1,
      indicator: 'dots'
    } );
  }

  new Slider( { element: '.member-slider',
    items: 3,
    autoplay: true,
    loop: true
  } );

} );
