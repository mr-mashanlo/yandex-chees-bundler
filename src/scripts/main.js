import Slider from './slider.js';
import ticker from './ticker.js';

document.addEventListener( 'DOMContentLoaded', () => {

  ticker( { element: '.ticker' } );
  new Slider( { element: '.slider', slides: 3 } );

} );
