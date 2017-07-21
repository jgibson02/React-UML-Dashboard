'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.D3SvgFileZoomPan = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var D3SvgFileEngine = function () {
  function D3SvgFileEngine() {
    (0, _classCallCheck3.default)(this, D3SvgFileEngine);
  }

  (0, _createClass3.default)(D3SvgFileEngine, [{
    key: 'create',
    value: function create(input) {
      this.draw(input);
    }
  }, {
    key: 'update',
    value: function update(input) {
      this.destroy(input.el);
      this.draw(input);
    }
  }, {
    key: 'destroy',
    value: function destroy(el) {
      _d2.default.select(el).selectAll('svg').remove();
    }
  }, {
    key: 'draw',
    value: function draw(props) {
      var svgFrame = this.buildZoomPanFrame(props);
      this.processSvgFile(props, svgFrame);
    }
  }, {
    key: 'buildZoomPanFrame',
    value: function buildZoomPanFrame(props) {
      var zoomed = function zoomed() {
        svg.attr('transform', 'translate(' + _d2.default.event.translate + ') scale(' + _d2.default.event.scale + ')');
      };
      var zoom = _d2.default.behavior.zoom().on('zoom', zoomed);
      var resetZoom = function resetZoom() {
        svg.transition().duration(props.duration).attr('transform', 'translate(0,0) scale(1)');
        zoom.scale(1).translate([0, 0]);
      };
      var svg = _d2.default.select(props.el).append('svg').attr('id', 'svg-file-container').attr('width', '100%').attr('height', '100%').call(zoom).on('dblclick.zoom', resetZoom).append('g');
      return svg;
    }
  }, {
    key: 'processSvgFile',
    value: function processSvgFile(props, svgFrame) {
      var _this = this;

      _d2.default.xml(props.svgPath, function (error, svgFile) {
        if (error) {
          console.warn(error);
          return;
        }
        if (svgFile) {
          _this.attachSvgFile(svgFile, svgFrame, props.resize);
        }
      });
    }
  }, {
    key: 'attachSvgFile',
    value: function attachSvgFile(svgFile, svgFrame, resize) {
      var svgFileNode = svgFile.getElementsByTagName('svg')[0];
      if (resize) {
        svgFileNode.setAttribute('width', '100%');
        svgFileNode.setAttribute('height', '100%');
      }
      svgFrame.node().appendChild(svgFileNode);
    }
  }]);
  return D3SvgFileEngine;
}();

var D3SvgFileZoomPan = new D3SvgFileEngine();

exports.D3SvgFileZoomPan = D3SvgFileZoomPan;