
async function buscar() {

  const symbol = document.getElementById('symbol').value.toUpperCase();
  const url = `https://api.binance.com/api/v3/depth?limit=500&symbol=${symbol}USDT`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Encontrar la cantidad de venta más alta y su precio
    let maxSellAmount = 0;
    let maxSellAmountPrice = 0;

    for (const order of data.asks) {
      const price = parseFloat(order[0]);
      const amount = parseFloat(order[1]);

      if (amount > maxSellAmount) {
        maxSellAmount = amount;
        maxSellAmountPrice = price;
      }
    }

    // Formatear y mostrar la cantidad de venta más alta y su precio
    const formattedMaxSellAmount = maxSellAmount.toFixed(2);
    const formattedMaxSellAmountPrice = maxSellAmountPrice.toFixed(2);
    datos.innerHTML = `<p>Se van a vender ${formattedMaxSellAmount} ${symbol} cuando el precio llegue a: $ ${formattedMaxSellAmountPrice}</p>`;

    // Encontrar la cantidad de compra más alta y su precio
    let maxBuyAmount = 0;
    let maxBuyAmountPrice = 0;

    for (const order of data.bids) {
      const price = parseFloat(order[0]);
      const amount = parseFloat(order[1]);

      if (amount > maxBuyAmount) {
        maxBuyAmount = amount;
        maxBuyAmountPrice = price;
      }
    }

    // Formatear y mostrar la cantidad de compra más alta y su precio
    const formattedMaxBuyAmount = maxBuyAmount.toFixed(2);
    const formattedMaxBuyAmountPrice = maxBuyAmountPrice.toFixed(2);
    datos.innerHTML += `<p>Se van a comprar ${formattedMaxBuyAmount} ${symbol} cuando el precio llegue a: $ ${formattedMaxBuyAmountPrice}</p>`;

  } catch (error) {
    console.log('Error:', error);
  }
}

document.querySelector('button').addEventListener('click', buscar);
