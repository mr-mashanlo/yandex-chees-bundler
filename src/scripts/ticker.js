function ticker( options ) {
  const ticker = document.querySelectorAll( options.element );
  ticker.forEach( item => {
    item.innerHTML = doubleTickerElements( item );
  } );
}

function doubleTickerElements( ticker ) {
  const tickerList = ticker.innerHTML;
  return tickerList + tickerList;
}

export default ticker;