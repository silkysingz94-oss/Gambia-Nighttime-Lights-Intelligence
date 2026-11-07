
/***************************************************************
 GBoS GEOAI | GAMBIA NIGHT-TIME LIGHTS INTELLIGENCE
 Data: NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG
 Monthly radiance + cloud-free coverage
 Produced by Ansu Singhateh
 GIS Analyst | GIS / Cartography Unit | Gambia Bureau of Statistics
***************************************************************/

// 01. DATA AND GEOGRAPHIC EXTENT

var collection = ee.ImageCollection(
  'NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG'
);

var gambia = ee.Geometry.Rectangle(
  [-16.817362, 13.064655, -13.790928, 13.826890],
  null,
  false
);

var palette = [
  '080b24', '173d83', '087fba',
  '21c5b2', 'd9ec61', 'fff2b0'
];

var years = [];
for (var y = 2014; y <= 2026; y++) {
  years.push(String(y));
}

var months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

var monthNumbers = [
  '01','02','03','04','05','06',
  '07','08','09','10','11','12'
];

// 02. MAP

var map = ui.Map();
map.setOptions('HYBRID');
map.centerObject(gambia, 8);
map.setControlVisibility({
  all: true,
  layerList: true,
  zoomControl: true,
  scaleControl: true,
  mapTypeControl: true
});

map.addLayer(
  gambia,
  {color: '00d5e8', fillColor: '00000000', width: 2},
  'Gambia analysis extent'
);

// 03. CONTROL PANEL

var title = ui.Label('GBoS GEOAI', {
  fontSize: '21px',
  fontWeight: 'bold',
  color: '#12304a'
});

var subtitle = ui.Label(
  'GAMBIA NIGHT-TIME LIGHTS INTELLIGENCE',
  {fontSize: '11px', fontWeight: 'bold', color: '#1685a4'}
);

var intro = ui.Label(
  'VIIRS DNB monthly radiance monitoring, temporal analysis and cloud-free observation coverage.',
  {fontSize: '11px', color: '#52677c'}
);

var yearSelect = ui.Select({
  items: years,
  value: '2025',
  style: {stretch: 'horizontal'}
});

var monthSelect = ui.Select({
  items: months,
  value: 'January',
  style: {stretch: 'horizontal'}
});

var modeSelect = ui.Select({
  items: ['Monthly', 'Yearly mean'],
  value: 'Monthly',
  style: {stretch: 'horizontal'}
});

var minRadiance = ui.Textbox({
  value: '0',
  placeholder: 'Minimum radiance',
  style: {stretch: 'horizontal'}
});

var maxRadiance = ui.Textbox({
  value: '30',
  placeholder: 'Maximum radiance',
  style: {stretch: 'horizontal'}
});

var minCoverage = ui.Slider({
  min: 0,
  max: 30,
  value: 1,
  step: 1,
  style: {stretch: 'horizontal'}
});

var showRadiance = ui.Checkbox({
  label: 'Show radiance layer',
  value: true
});

var showCoverage = ui.Checkbox({
  label: 'Show cloud-free coverage',
  value: false
});

var runButton = ui.Button({
  label: 'RUN NIGHT-LIGHTS ANALYSIS',
  style: {
    stretch: 'horizontal',
    color: 'white',
    backgroundColor: '#1769aa',
    fontWeight: 'bold'
  }
});

var resetButton = ui.Button({
  label: 'RESET MAP',
  style: {stretch: 'horizontal'}
});

var status = ui.Label('Ready. Select a period and run analysis.', {
  fontSize: '10px',
  color: '#16865b'
});

var extentText = ui.Label(
  'West: -16.817362\nEast: -13.790928\nSouth: 13.064655\nNorth: 13.826890\nCRS: EPSG:4326',
  {fontSize: '10px', whiteSpace: 'pre', color: '#52677c'}
);

var controls = ui.Panel({
  widgets: [
    title,
    subtitle,
    ui.Label('01 | DATA & CONTROLS', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '18px 0 8px 0'
    }),
    intro,
    ui.Label('Analysis mode'),
    modeSelect,
    ui.Label('Year'),
    yearSelect,
    ui.Label('Month'),
    monthSelect,
    ui.Label('Minimum cloud-free observations'),
    minCoverage,
    ui.Label('Display minimum radiance'),
    minRadiance,
    ui.Label('Display maximum radiance'),
    maxRadiance,
    showRadiance,
    showCoverage,
    runButton,
    resetButton,
    status,
    ui.Label('GEOGRAPHIC DOMAIN', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '20px 0 8px 0'
    }),
    extentText,
    ui.Label('DATA SOURCE', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '20px 0 8px 0'
    }),
    ui.Label(
      'NOAA / Earth Observation Group\nVIIRS DNB Monthly V1.0\nBands: avg_rad and cf_cvg\nPixel size: approximately 464 metres\nMonthly observations from 2014 onward.',
      {fontSize: '10px', whiteSpace: 'pre', color: '#52677c'}
    )
  ],
  style: {
    width: '33%',
    padding: '12px',
    backgroundColor: '#ffffff'
  }
});

// 04. ANALYTICS PANEL

var analyticsTitle = ui.Label('03 | ANALYTICS & STATISTICS', {
  fontWeight: 'bold',
  color: '#1769aa',
  fontSize: '13px'
});

var periodLabel = ui.Label('Selected period: —', {
  fontWeight: 'bold',
  color: '#12304a'
});

var meanLabel = ui.Label('Mean radiance: —');
var maxLabel = ui.Label('Maximum radiance: —');
var minLabel = ui.Label('Minimum radiance: —');
var stdLabel = ui.Label('Standard deviation: —');
var countLabel = ui.Label('Valid pixels: —');
var coverageLabel = ui.Label('Mean cloud-free observations: —');

var trendPanel = ui.Panel();
var distributionPanel = ui.Panel();

var analytics = ui.Panel({
  widgets: [
    analyticsTitle,
    periodLabel,
    ui.Label('RADIANCE INDICATORS', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '18px 0 8px 0'
    }),
    meanLabel,
    maxLabel,
    minLabel,
    stdLabel,
    countLabel,
    coverageLabel,
    ui.Label('MONTHLY RADIANCE TREND', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '20px 0 8px 0'
    }),
    trendPanel,
    ui.Label('RADIANCE DISTRIBUTION', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '20px 0 8px 0'
    }),
    distributionPanel,
    ui.Label('METHODOLOGY', {
      fontWeight: 'bold',
      color: '#1769aa',
      margin: '20px 0 8px 0'
    }),
    ui.Label(
      'Monthly mean radiance is derived from avg_rad. The cf_cvg band represents the number of cloud-free observations. Pixels below the selected coverage threshold are masked for analysis.',
      {fontSize: '10px', color: '#52677c'}
    ),
    ui.Label(
      'Yearly mean is calculated from available monthly images. It is not the official annual VNL composite.',
      {fontSize: '10px', color: '#a15c15'}
    ),
    ui.Label(
      'Produced by Ansu Singhateh\nGIS Analyst | GIS / Cartography Unit\nGambia Bureau of Statistics\nGBoS GEOAI • Research and educational use',
      {fontSize: '10px', color: '#52677c', margin: '20px 0'}
    )
  ],
  style: {
    width: '33%',
    padding: '12px',
    backgroundColor: '#ffffff'
  }
});

// 05. THREE EQUAL COLUMNS

ui.root.clear();
ui.root.setLayout(ui.Panel.Layout.flow('horizontal'));
ui.root.add(controls);
ui.root.add(map);
ui.root.add(analytics);

// Set map width to one-third of the application.
map.style().set({
  width: '34%',
  height: '100%'
});

// 06. BUILD SELECTED IMAGE

function getSelectedCollection() {
  var year = Number(yearSelect.getValue());
  var start;
  var end;

  if (modeSelect.getValue() === 'Monthly') {
    var monthIndex = months.indexOf(monthSelect.getValue());
    var month = monthIndex + 1;

    start = ee.Date.fromYMD(year, month, 1);
    end = start.advance(1, 'month');

  } else {
    start = ee.Date.fromYMD(year, 1, 1);
    end = start.advance(1, 'year');
  }

  return collection
    .filterDate(start, end)
    .filterBounds(gambia);
}

function getAnalysisImage() {
  var selected = getSelectedCollection();

  var image;

  if (modeSelect.getValue() === 'Monthly') {
    image = ee.Image(selected.first());
  } else {
    image = selected.mean();
  }

  var coverage = image.select('cf_cvg');

  var threshold = minCoverage.getValue();

  image = image.updateMask(coverage.gte(threshold));

  return image.clip(gambia);
}

// 07. UPDATE MAP AND STATISTICS

function runAnalysis() {
  status.setValue('Processing VIIRS imagery...');
  periodLabel.setValue(
    'Selected period: ' +
    yearSelect.getValue() + ' | ' +
    (modeSelect.getValue() === 'Monthly'
      ? monthSelect.getValue()
      : 'Yearly mean')
  );

  var selected = getSelectedCollection();

  selected.size().evaluate(function(size) {

    if (!size || size === 0) {
      status.setValue('No image available for the selected period.');
      return;
    }

    var image = getAnalysisImage();

    map.layers().reset([]);

    map.addLayer(
      gambia,
      {color: '00d5e8', fillColor: '00000000', width: 2},
      'Gambia extent'
    );

    var minValue = Number(minRadiance.getValue());
    var maxValue = Number(maxRadiance.getValue());

    if (!isFinite(minValue)) minValue = 0;
    if (!isFinite(maxValue) || maxValue <= minValue) maxValue = 30;

    if (showRadiance.getValue()) {
      map.addLayer(
        image.select('avg_rad'),
        {
          min: minValue,
          max: maxValue,
          palette: palette
        },
        'VIIRS night-time radiance'
      );
    }

    if (showCoverage.getValue()) {
      map.addLayer(
        image.select('cf_cvg'),
        {
          min: 0,
          max: 30,
          palette: ['ffffff', '9ecae1', '2171b5', '08306b']
        },
        'Cloud-free observations'
      );
    }

    var stats = image.select('avg_rad').reduceRegion({
      reducer: ee.Reducer.mean()
        .combine(ee.Reducer.max(), '', true)
        .combine(ee.Reducer.min(), '', true)
        .combine(ee.Reducer.stdDev(), '', true)
        .combine(ee.Reducer.count(), '', true),
      geometry: gambia,
      scale: 463.83,
      maxPixels: 1e9,
      bestEffort: true
    });

    var coverageStats = image.select('cf_cvg').reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: gambia,
      scale: 463.83,
      maxPixels: 1e9,
      bestEffort: true
    });

    stats.evaluate(function(result) {
      if (!result) {
        status.setValue('No valid statistics returned.');
        return;
      }

      function display(value) {
        if (value === null || value === undefined) return 'No data';
        return Number(value).toFixed(3);
      }

      meanLabel.setValue(
        'Mean radiance: ' + display(result.avg_rad_mean) +
        ' nW/cm²/sr'
      );

      maxLabel.setValue(
        'Maximum radiance: ' + display(result.avg_rad_max)
      );

      minLabel.setValue(
        'Minimum radiance: ' + display(result.avg_rad_min)
      );

      stdLabel.setValue(
        'Standard deviation: ' + display(result.avg_rad_stdDev)
      );

      countLabel.setValue(
        'Valid pixels: ' + display(result.avg_rad_count)
      );
    });

    coverageStats.evaluate(function(result) {
      if (result && result.cf_cvg !== null) {
        coverageLabel.setValue(
          'Mean cloud-free observations: ' +
          Number(result.cf_cvg).toFixed(2)
        );
      }
    });

    // 08. MONTHLY TREND CHART

    var yearStart = ee.Date.fromYMD(
      Number(yearSelect.getValue()), 1, 1
    );

    var yearEnd = yearStart.advance(1, 'year');

    var yearCollection = collection
      .filterDate(yearStart, yearEnd)
      .filterBounds(gambia);

    var trendChart = ui.Chart.image.series({
      imageCollection: yearCollection.select('avg_rad'),
      region: gambia,
      reducer: ee.Reducer.mean(),
      scale: 463.83,
      xProperty: 'system:time_start'
    })
    .setChartType('LineChart')
    .setOptions({
      title: 'Monthly mean VIIRS radiance',
      hAxis: {title: 'Month'},
      vAxis: {title: 'Radiance (nW/cm²/sr)', minValue: 0},
      lineWidth: 2,
      pointSize: 3,
      legend: {position: 'none'},
      colors: ['#1769aa']
    });

    trendPanel.clear();
    trendPanel.add(trendChart);

    // 09. RADIANCE HISTOGRAM

    var histogram = ui.Chart.image.histogram({
      image: image.select('avg_rad'),
      region: gambia,
      scale: 463.83,
      maxBuckets: 25
    })
    .setOptions({
      title: 'Radiance distribution',
      hAxis: {title: 'Radiance'},
      vAxis: {title: 'Pixel count'},
      legend: {position: 'none'},
      colors: ['#18a6b7']
    });

    distributionPanel.clear();
    distributionPanel.add(histogram);

    status.setValue('Analysis completed successfully.');
  });
}

// 10. CONTROL EVENTS

runButton.onClick(runAnalysis);

resetButton.onClick(function() {
  map.centerObject(gambia, 8);
  minRadiance.setValue('0');
  maxRadiance.setValue('30');
  minCoverage.setValue(1);
  showRadiance.setValue(true);
  showCoverage.setValue(false);
  status.setValue('Map reset.');
});

showRadiance.onChange(runAnalysis);
showCoverage.onChange(runAnalysis);
minCoverage.onChange(runAnalysis);

modeSelect.onChange(function() {
  runAnalysis();
});

yearSelect.onChange(runAnalysis);
monthSelect.onChange(runAnalysis);

// INITIAL VIEW
runAnalysis();
