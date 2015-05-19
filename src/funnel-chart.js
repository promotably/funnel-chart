/*!
 * Funnel Chart v0.0.1
 * https://github.com/promotably/funnel-chart
 *
 * Copyright 2015 Promotably LLC
 * Released under the MIT license
 */
(function (root, factory) {
  if(typeof define === 'function' && define.amd) {
    define(factory);
  }
  else if(typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
  else {
    root.FunnelChart = factory();
  }
}(this, function() {

  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  }

  // canvas arg can be an ID string or HTMLElement
  function FunnelChart(canvas, settings) {
    // Allows FunnelChart to be instantiated without use of "new"
    if (!(this instanceof FunnelChart))
      return new FunnelChart(canvas, settings);

    // Ensure canvas is an HTMLElement
    this.canvas = (typeof canvas === 'string') ?
      document.getElementById(canvas) : canvas;

    // TODO: Check settings.values exists
    if(!settings.values || !settings.values.length)
      throw('A values setting must be provided');

    // Extend default settings
    this.settings = extend(this.settings, settings);

    // Init!
    this.initialize();
  }

  FunnelChart.prototype = extend(FunnelChart.prototype, {

    settings: {

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

      // String - The font weight for labels and values
      fontWeight: '300',

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
    },

    initialize: function() {
      this.calculateDimensions();
      this.draw();
    },

    calculateDimensions: function() {
      var settings = this.settings,
          labelWidth, sectionTotalHeight;

      // Width and height of canvas
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;

      // Width allocated to labels
      labelWidth = this.hasLabels() ? this.width * (settings.labelWidthPercent / 100) : 0;
      this.labelMaxWidth = labelWidth - settings.labelOffset;

      // Start and end width of funnel
      this.startWidth = this.width - labelWidth;
      this.endWidth = this.startWidth * (settings.funnelReductionPercent / 100);

      // Section heights
      if(settings.displayPercentageChange) {
        sectionTotalHeight = (this.height / (settings.values.length - 0.5));
        this.pSectionHeight = (sectionTotalHeight / (settings.pSectionHeightPercent + 100)) * settings.pSectionHeightPercent;
        this.sectionHeight = sectionTotalHeight - this.pSectionHeight - 1;
        this.pSectionHeight = this.pSectionHeight - 1;
      }
      else {
        sectionTotalHeight = (this.height / settings.values.length);
        this.sectionHeight = sectionTotalHeight - 1;
        this.pSectionHeight = 0;
      }
    },

    draw: function() {
      var canvas = this.canvas,
          settings = this.settings;

      if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            maxAvailFontSize = ((settings.displayPercentageChange) ? this.pSectionHeight : this.sectionHeight) - 2;

        // Reduce font size if necessary
        if(settings.maxFontSize >= maxAvailFontSize)
          settings.maxFontSize = maxAvailFontSize;

        // Configure font styling
        ctx.font = settings.fontWeight + ' ' + settings.maxFontSize + 'px ' + settings.font;

        // Draw labels if we have any
        if(this.hasLabels()) this.drawLabels(ctx);

        // Draw funnel clipping area with white background
        this.drawClippingArea(ctx, settings);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.clip();

        // Draw funnel sections
        this.drawSections(ctx);

        // Tidy up funnel outline
        this.drawClippingArea(ctx, settings);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      }
    },

    drawLabels: function(ctx) {
      var settings = this.settings,
          i, yPos;

      ctx.strokeStyle = settings.labelLineColor;
      ctx.lineWidth = 1;

      for(i = 0; i < settings.values.length; i++) {
        yPos = this.calculateYPos(i);

        ctx.fillStyle = this.sequentialValue(settings.labelFontColor, i);
        ctx.fillText(
          settings.labels[i] || '',
          this.startWidth + settings.labelOffset,
          yPos + (this.sectionHeight / 2) + (settings.maxFontSize / 2) - 2,
          this.labelMaxWidth
        );

        if(i > 0) {
          ctx.beginPath();
          ctx.moveTo(i, yPos);
          ctx.lineTo(this.width, yPos);
          ctx.stroke();
        }

        if(i < (settings.values.length - 1) && settings.displayPercentageChange){
          ctx.beginPath();
          ctx.moveTo(i, yPos + this.sectionHeight);
          ctx.lineTo(this.width, yPos + this.sectionHeight);
          ctx.stroke();
        }

      }
    },

    drawClippingArea: function(ctx, settings) {
      var inset = (this.startWidth - this.endWidth) / 2;
      var height = (settings.values.length * this.sectionHeight) +
                     ((settings.values.length - 1) * this.pSectionHeight) +
                     (settings.values.length + 1);

      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(this.startWidth,0);
      ctx.quadraticCurveTo(
        (this.startWidth - inset),
        (height / 3),
        (this.startWidth - inset),
        height
      );
      ctx.lineTo(inset,height);
      ctx.quadraticCurveTo(inset, (height / 3), 0, 0);
    },

    drawSections: function(ctx) {
      var settings = this.settings,
          i, yPos;

      ctx.textAlign = 'center';

      for(i = 0; i < settings.values.length; i++) {
        yPos = this.calculateYPos(i);

        ctx.fillStyle = this.sequentialValue(settings.sectionColor, i);
        ctx.fillRect(0, yPos, this.startWidth, this.sectionHeight);
        ctx.fillStyle = this.sequentialValue(settings.sectionFontColor, i);
        ctx.fillText(
          settings.values[i],
          this.startWidth / 2,
          yPos + (this.sectionHeight / 2) + (settings.maxFontSize / 2) - 2
        );

        if(i < (settings.values.length - 1) && settings.displayPercentageChange) {
          ctx.fillStyle = this.sequentialValue(settings.pSectionColor, i);
          ctx.fillRect(
            0,
            (yPos + this.sectionHeight + 1),
            this.startWidth,
            this.pSectionHeight
          );

          ctx.fillStyle = this.sequentialValue(settings.pSectionFontColor, i);
          ctx.fillText(
            ((settings.values[i + 1] / settings.values[i]) * 100).toFixed(settings.pPrecision) + '%',
            this.startWidth / 2,
            yPos + this.sectionHeight + (this.pSectionHeight / 2) + (settings.maxFontSize / 2) - 1
          );
        }
      }
    },

    hasLabels: function() {
      return this.settings.labels && !!this.settings.labels.length;
    },

    calculateYPos: function(i) {
      var sectionHeight = this.sectionHeight + 1;

      if(this.settings.displayPercentageChange)
        sectionHeight += this.pSectionHeight + 1;

      return (i === 0) ? 0 : (sectionHeight * i);
    },

    sequentialValue: function(arr, i) {
      if(typeof arr === 'string') return arr;
      return arr[i % arr.length];
    }

  });

  return FunnelChart;

}));
