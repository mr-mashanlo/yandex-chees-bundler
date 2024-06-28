function ticker() {
  const ticker = document.querySelector( '.ticker' );
  ticker.innerHTML = doubleTickerElements( ticker );
}

function doubleTickerElements( ticker ) {
  const tickerList = ticker.innerHTML;
  return tickerList + tickerList;
}

export default ticker;