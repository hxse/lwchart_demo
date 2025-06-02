import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from "lightweight-charts";

export function createLWChart(chartContainer) {
  const chart = createChart(chartContainer, {
    timeScale: { rightOffset: 1 },
    layout: {
      panes: {
        separatorColor: "rgba(41, 152, 236, 0.3)",
        // separatorHoverColor: "rgba(41, 152, 236, 0.3)",
        enableResize: false,
      },
    },
  });
  return chart;
}

export function createLWSeries(chart, key, pIdx) {
  if (key === "ohlc") {
    const ohlcSeries = chart.addSeries(CandlestickSeries, {}, 0);
    return ohlcSeries;
    // obj.ohlcSeries = ohlcSeries;
    // obj.seriesArray.push(["ohlcSeries", ohlcSeries]);
  } else if (key === "volume") {
    const volumeSeries = chart.addSeries(
      HistogramSeries,
      {
        color: "rgba(38, 166, 154, 0.7)",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // set as an overlay by setting a blank priceScaleId
      },
      pIdx // Pane index
    );
    volumeSeries.priceScale().applyOptions({
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.85, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });
    return volumeSeries;
    // obj.volumeSeries = volumeSeries;
    // obj.seriesArray.push(["volumeSeries", volumeSeries]);
  } else if (key === "sma") {
    const smaSeries = chart.addSeries(
      LineSeries,
      { color: "#2962FF" },
      pIdx // Pane index
    );
    return smaSeries;
    // obj.smaSeries = smaSeries;
    // obj.seriesArray.push(["smaSeries", smaSeries]);
  } else if (key === "rsi") {
    const rsiSeries = chart.addSeries(
      LineSeries,
      { color: "orange" },
      pIdx // Pane index
    );
    return rsiSeries;
    // obj.rsiSeries = rsiSeries;
    // obj.seriesArray.push(["rsiSeries", rsiSeries]);
  }
}

export function setLWHeight(chart, heightScale) {
  let height = chart.paneSize().height * heightScale;
  const secondPane = chart.panes()[0];
  secondPane.setHeight(height);
  console.log("pane height", secondPane, height);
}
