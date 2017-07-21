var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var SearchAppointments = require('./SearchAppointments');
var SvgFileZoomPan = require('react-svg-file-zoom-pan');

const my_path = "https://larced.sp.jsc.nasa.gov/sites/EDM/seemb/sysmldiagram/SitePages/FUELEAP_NIFS_v75/diagrams/FUELEAP%20Project%20Interface.svg";

var MainInterface = React.createClass({
    getInitialState: function() {
        return {
            aptBodyVisible:  false,
            orderBy: 'petName',
            orderDir: 'asc',
            queryText: '',
            myAppointments: []
        } //return
    }, //getInitialState

    componentDidMount: function() {
        this.serverRequest = $.get('./js/data.json', function(result) {
            var tempApts = result;
            this.setState({
                myAppointments: tempApts
            }); //setState
        }.bind(this)); //serverRequest
    }, //componentDidMount

    componentWillUnmount: function() {
    this.serverRequest.abort();
    }, //componentWillUnmount

    deleteMessage: function(item) {
        var allApts = this.state.myAppointments;
        var newApts = _.without(allApts, item);
        this.setState({
            myAppointments: newApts
        }); //setState
    }, //deleteMessage

    toggleAptDisplay: function() {
        var tempVisibility = !this.state.aptBodyVisible;
        this.setState({
            aptBodyVisible: tempVisibility
        });
    }, //toggleAptDisplay

    addItem: function(tempItem) {
        var tempApts = this.state.myAppointments;
        tempApts.push(tempItem);
        this.setState({
            myAppointments: tempApts
        }); //setState
    }, //addItem

  reOrder: function(orderBy, orderDir) {
      this.setState({
          orderBy:  orderBy,
          orderDir: orderDir
      }) // setState
  }, // reOrder

  searchApts(q) {
      this.setState({
        queryText: q
      }); // setState
  }, // searchApts

  render: function() {
    var filteredApts = [];
    var orderBy =  this.state.orderBy;
    var orderDir = this.state.orderDir;
    var queryText = this.state.queryText;
    var myAppointments =  this.state.myAppointments;

    myAppointments.forEach(function(item) {
        if (
            (item.petName.toLowerCase().indexOf(queryText) != -1) ||
            (item.ownerName.toLowerCase().indexOf(queryText) != -1) ||
            (item.aptDate.toLowerCase().indexOf(queryText) != -1) ||
            (item.aptNotes.toLowerCase().indexOf(queryText) != -1)
        ) {
            filteredApts.push(item);
        }
    }); // forEach

    filteredApts = _.orderBy(filteredApts, function(item)  {
        return item[orderBy].toLowerCase();
    }, orderDir); // orderBy

    filteredApts = filteredApts.map(function(item, index) {
      return(
        <AptList key = { index }
          singleItem = { item }
          whichItem = { item }
          onDelete = { this.deleteMessage }/>
      ) //return
    }.bind(this)); //filteredApts.map
    return (
        <p>Test</p>
        //<SvgFileZoomPan svgPath={my_path} duration={300} resize={true}/>
    ) //return
  } //render
}); //MainInterface

ReactDOM.render(
  <MainInterface />,
  document.getElementById('view-pane')
); //render
