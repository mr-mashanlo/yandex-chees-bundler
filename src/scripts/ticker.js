class Ticker {

  defaultOptions = {
    element: '.slider'
  };

  constructor( options ) {
    this.options = { ...this.defaultOptions, ...options };
    this.init();
  }

  init = () => {
    const ticker = document.querySelectorAll( this.options.element );
    ticker.forEach( item => {
      item.innerHTML = this.doubleTickerElements( item );
    } );
  };

  doubleTickerElements = ( ticker ) => {
    const tickerList = ticker.innerHTML;
    return tickerList + tickerList;
  };

}

export default Ticker;