# Funnel Chart

A funnel chart visualization using HTML5 canvas.

## Installation

Via Bower:

```shell
$ bower install funnel-chart --save
```

Via npm:

```shell
$ npm install funnel-chart --save
```

## Getting Started

First we need to include the funnel-chart.js library on the page.
The library is available in the global variable `FunnelChart`.

```html
<script src="/path/to/funnel-chart.js"></script>
```

The funnel-chart library also supports AMD and CommonJS loaders.

## Creating a Funnel Chart

The chart requires an HTML `<canvas>` element to be present on the page with its width and height set via HTML attributes or CSS.

```html
<canvas id="my-funnel" width="500" height="350"></canvas>
```

The chart must then be instantiated in the following manner:

```js
FunnelChart(canvas, settings);
```

The `canvas` argument can be a string representing the element `id`:

```js
FunnelChart('my-funnel', {
  values: [1012, 891, 96, 18],
  labels: [
    'Impressions',
    'Clicks',
    'Purchases',
    'Repeat Purchases'
  ]
});
```

or it can be an HTMLElement reference:

```js
FunnelChart(document.getElementById('my-canvas'), {
  ...
});
```

or a jQuery selector:

```js
FunnelChart($('canvas').get(0), {
  ...
});
```

The chart will be sized to best fit the dimensions of its `<canvas>` element.

## Settings

The settings argument is an object containing a number of required and optional fields.

```js
{

  /* Required */

  // Array - Numeric values that will be displayed in each funnel section
  // in descending order
  values: [3512, 891, 652, 81],

  /* Optional */

  // Array - These labels should correspond to the array entries in the
  // values setting. Omit the labels setting if you do not wish to display
  // labels.
  labels: [
    'Impressions',
    'Clicks',
    'Purchases',
    'Repeat Purchases'
  ],

  // Array - String values that correspond
  values: [3512, 891, 652, 81],

  // Boolean - Whether to display % change between sections
  displayPercentageChange: true,

  // Number - The number of decimal places that should be displayed for %
  // change values
  pPrecision: 1,

  // String - The color of the horizontal label lines (if labels are shown)
  labelLineColor: '#eee',

  // String or Array - The font color(s) of the labels.
  labelFontColor: '#657274',

  // String or Array - The color(s) of the funnel sections.
  sectionColor: '#0498b3',

  // String or Array - The color(s) of the funnel percentage sections.
  pSectionColor: '#bfd1d4',

  // String - The font for labels and values
  font: 'Helvetica Neue',

  // Number - The maximum font size in pixels (px) for labels and values.
  // This will always be used where possible unless the height of the
  // funnel sections is too small to permit it, in which case the font size
  // will be automatically reduced to fit
  maxFontSize: 13,

  // String - The font weight for labels and values.
  fontWeight: 'bold',

  // String or Array - The font color(s) for funnel sections
  sectionFontColor: '#fff',

  // String or Array - The font color(s) for % change sections
  pSectionFontColor: '#657274',

  // Number - The height of the % change sections compared to the main
  // funnel sections. This is a percent value.
  pSectionHeightPercent: 100,

  // Number - The percentage of the full canvas width that should be
  // reserved for display of labels (if provided). The funnel will expand
  // to fit the remainder.
  labelWidthPercent: 30,

  // Number - The percentage width difference between the top and the
  // bottom of the funnel.
  funnelReductionPercent: 40,

  // Number - The space between the right hand edge of the funnel and the
  // label text in pixels.
  labelOffset: 10

  // Number - The line height between each funnel section
  lineHeight: 1
}
```
