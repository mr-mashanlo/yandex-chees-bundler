class Slider {

  constructor( options ) {
    this.element = document.querySelector( options.element );
    this.slider = this.element.querySelector( '.slider-list' );
    this.sliderSlides = this.slider.querySelectorAll( '.slider-list__item' );
    this.controls = this.element.querySelector( '.slider-control' );
    this.slides = options.slides;
    this.position = options.slides;
    this.shift = 0;

    this.init();
  }

  init = () => {
    this.handleWindowResize();
    this.setSlidesWidth();
    this.handleControlsClick();
    this.displayPosition();
    this.displayTotalSlides();
    this.updateButtonStatus();
  };

  setSlidesWidth = () => {
    this.sliderSlides.forEach( slide => {
      slide.style.width = `${100 / this.slides}%`;
    } );
  };

  updateButtonStatus = () => {
    const prev = this.controls.querySelector( '.slider-control__prev' );
    const next = this.controls.querySelector( '.slider-control__next' );

    if ( this.position <= this.slides ) {
      prev.disabled = true;
    } else if ( this.position >= this.getTotalSlides() ) {
      next.disabled = true;
    } else {
      prev.disabled = false;
      next.disabled = false;
    }
  };

  handleControlsClick = () => {
    this.controls.addEventListener( 'click', event => { 
      const button = event.target.closest( 'button' );
      if ( !button ) return; 

      if ( button.classList.contains( 'slider-control__prev' ) ) {
        this.position = this.position - 1;
        this.shift = this.shift - this.getSlideWidth();
      } else if ( button.classList.contains( 'slider-control__next' ) ) {
        this.position = this.position + 1;
        this.shift = this.shift + this.getSlideWidth();
      }

      this.updateButtonStatus();
      this.displayPosition();
      this.moveSlides();
    } );
  };

  moveSlides = () => {
    this.sliderSlides.forEach( item => {
      item.style.transform = `translateX( -${this.shift}px )`;
    } );
  };

  getSlideWidth = () => {
    return this.sliderSlides[0].offsetWidth;
  };

  getTotalSlides = () => {
    return this.sliderSlides.length;
  };
  
  displayPosition = () => {
    const position = this.controls.querySelector( '.slider-counter__position' );
    position.textContent = this.position;
  };

  displayTotalSlides = () => {
    const totalSlides = this.controls.querySelector( '.slider-counter__total-slides' );
    totalSlides.textContent = this.getTotalSlides();
  };

  handleWindowResize = () => {
    window.outerWidth <= 500 ? this.slides = 1 : this.slides = 3;
    window.outerWidth <= 500 ? this.position = 1 : this.position = 3;

    window.addEventListener( 'resize', event => {
      event.target.outerWidth <= 500 ? this.slides = 1 : this.slides = 3;
      event.target.outerWidth <= 500 ? this.position = 1 : this.position = 3;
    } );
  };

}

export default Slider;