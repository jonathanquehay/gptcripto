async function getMostVolatileSymbols() {
  const url = 'https://api.binance.com/api/v3/ticker/24hr';

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Ordenar los símbolos por su cambio porcentual
    const sortedSymbols = data
      .filter(symbol => symbol.symbol.endsWith('USDT'))
      .sort((a, b) => {
        const aChange = parseFloat(a.priceChangePercent);
        const bChange = parseFloat(b.priceChangePercent);
        return bChange - aChange;
      });

    // Tomar los 100 símbolos más volátiles
    const mostVolatileSymbols = sortedSymbols.slice(0, 100).map(symbol => symbol.symbol.replace('USDT', ''));

    return mostVolatileSymbols;

  } catch (error) {
    console.log('Error:', error);
  }
}

async function buscar(symbol) {
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

    // Calcular el volumen de operaciones
    let volume = 0;

    for (const order of data.bids.concat(data.asks)) {
      const amount = parseFloat(order[1]);
      volume += amount;
    }

    // Calcular el cambio porcentual de precio
    const priceChangePercent = ((maxBuyAmountPrice - maxSellAmountPrice) / maxSellAmountPrice) * 100;

    if (volume > 0) {
      // Agregar los datos a una tabla HTML
      const table = document.getElementById('tabla');
      const row = table.insertRow(-1);
      const symbolCell = row.insertCell(0);
      const buyPriceCell = row.insertCell(1);
      const buyAmountCell = row.insertCell(2);
      const sellPriceCell = row.insertCell(3);
      const sellAmountCell = row.insertCell(4);
      const priceChangeCell = row.insertCell(5);
      const volumeCell = row.insertCell(5);


      const formatoNica = (number) => {
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        return number.toString().replace(exp, rep);
      }

      symbolCell.innerHTML = symbol;
      buyAmountCell.innerHTML = formatoNica(maxBuyAmount);
      buyPriceCell.innerHTML = maxBuyAmountPrice.toFixed(2);
      sellAmountCell.innerHTML = formatoNica(maxSellAmount);
      sellPriceCell.innerHTML = maxSellAmountPrice.toFixed(2);
      priceChangeCell.innerHTML = priceChangePercent.toFixed(2) + '%';
      volumeCell.innerHTML = formatoNica(volume.toLocaleString());

    }

  } catch (error) {
    console.log('Error:', error);
  }
}


async function buscarSimbolosVolatile() {
  const symbols = await getMostVolatileSymbols();

  // Limitar la cantidad de solicitudes simultáneas
  const MAX_CONCURRENT_REQUESTS = 10;
  const batches = [];

  // Agrupar los símbolos en lotes de tamaño máximo MAX_CONCURRENT_REQUESTS
  for (let i = 0; i < symbols.length; i += MAX_CONCURRENT_REQUESTS) {
    const batch = symbols.slice(i, i + MAX_CONCURRENT_REQUESTS);
    batches.push(batch);
  }

  // Realizar las solicitudes en paralelo para cada lote de símbolos
  for (const batch of batches) {
    const promises = batch.map(symbol => buscar(symbol));
    await Promise.all(promises);
  }
}

// Llamar a la función para los 100 símbolos más volátiles
buscarSimbolosVolatile();



// Llamar a la función para los 100 símbolos más volátiles
buscarSimbolosVolatile();


