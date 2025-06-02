export function simulateOHLCVData(count, basePrice = 80, timeBase = Date.UTC(2023, 9, 26)) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const time = new Date(timeBase + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const open = basePrice + Math.random() * 2 - 1;
    const high = Math.max(open + Math.random() * 2, basePrice + Math.random() * 3);
    const low = Math.min(open - Math.random() * 2, basePrice - Math.random() * 3);
    const close = (open + high + low) / 3 + Math.random() * 1.5 - 0.75;
    basePrice = close; // Use close as the next open
    data.push({ time, open, high, low, close });
  }
  return data;
}

export function simulateVolume(ohlc) {
  if (!Array.isArray(ohlc) || ohlc.length === 0) {
    return [];
  }

  return ohlc.map((item, index) => {
    let volume = 0;
    if (index > 0) {
      const priceChange = Math.abs(item.close - ohlc[index - 1].close);
      volume = Math.floor(priceChange * 100 + Math.random() * 50);
    } else {
      volume = Math.floor(Math.random() * 100);
    }
    return { time: item.time, value: volume };
  });
}

export function calculateSMA(ohlcv, period) {
  if (!Array.isArray(ohlcv) || ohlcv.length === 0 || period <= 0) {
    return [];
  }

  const smaResults = [];
  for (let i = period - 1; i < ohlcv.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += ohlcv[i - j].close;
    }
    const value = sum / period;
    smaResults.push({ time: ohlcv[i].time, value: value });
  }

  return smaResults;
}

export function calculateRSI(ohlc, period) {
  if (!Array.isArray(ohlc) || ohlc.length <= period) {
    return [];
  }

  const rsiResults = [];
  const gains = [];
  const losses = [];
  let avgGain;
  let avgLoss;

  for (let i = 1; i < ohlc.length; i++) {
    const change = ohlc[i].close - ohlc[i - 1].close;
    gains.push(Math.max(0, change));
    losses.push(Math.max(0, -change));

    if (i === period) {
      avgGain = gains.slice(0, period).reduce((sum, g) => sum + g, 0) / period;
      avgLoss = losses.slice(0, period).reduce((sum, l) => sum + l, 0) / period;
    } else if (i > period) {
      if (typeof avgGain !== "undefined" && typeof avgLoss !== "undefined") {
        avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
      }
    }

    if (i >= period && typeof avgGain !== "undefined" && typeof avgLoss !== "undefined") {
      let rsi;
      if (avgLoss === 0) {
        rsi = 100;
      } else if (avgGain === 0) {
        rsi = 0;
      } else {
        const rs = avgGain / avgLoss;
        rsi = 100 - 100 / (1 + rs);
      }
      rsiResults.push({ time: ohlc[i].time, value: rsi });
    }
  }

  return rsiResults;
}
