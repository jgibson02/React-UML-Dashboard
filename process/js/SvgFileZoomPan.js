'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _D3SvgFileZoomPan = require('./D3SvgFileZoomPan');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SvgFileZoomPan = React.createClass({
  (0, _inherits3.default)(SvgFileZoomPan, _React$Component);

  function SvgFileZoomPan() {
    (0, _classCallCheck3.default)(this, SvgFileZoomPan);
    return (0, _possibleConstructorReturn3.default)(this, (SvgFileZoomPan.__proto__ || (0, _getPrototypeOf2.default)(SvgFileZoomPan)).apply(this, arguments));
  }

  (0, _createClass3.default)(SvgFileZoomPan, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      _D3SvgFileZoomPan.D3SvgFileZoomPan.create({
        svgPath: this.props.svgPath,
        duration: this.props.duration,
        resize: this.props.resize,
        el: this.getDOMNode()
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      _D3SvgFileZoomPan.D3SvgFileZoomPan.update({
        svgPath: nextProps.svgPath,
        duration: this.props.duration,
        resize: nextProps.resize,
        el: this.getDOMNode()
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _D3SvgFileZoomPan.D3SvgFileZoomPan.destroy(this.getDOMNode());
    }
  }, {
    key: 'getDOMNode',
    value: function getDOMNode() {
      return _reactDom2.default.findDOMNode(this);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'svg-file-container' });
    }
  }]);
  return SvgFileZoomPan;
});

exports.default = SvgFileZoomPan;
module.exports=SvgFileZoomPan;

SvgFileZoomPan.propTypes = {
  svgPath: _react2.default.PropTypes.string,
  duration: _react2.default.PropTypes.number,
  resize: _react2.default.PropTypes.bool
};
