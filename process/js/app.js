var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var SearchAppointments = require('./SearchAppointments');
var SvgFileZoomPan = require('react-svg-file-zoom-pan');
var SortableTree = require('react-sortable-tree').default;

const my_path = "https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg" //"https://larced.sp.jsc.nasa.gov/sites/EDM/seemb/sysmldiagram/SitePages/FUELEAP_NIFS_v75/diagrams/FUELEAP%20Project%20Interface.svg";

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
        <SvgFileZoomPan svgPath={my_path} duration={300} resize={true}/>
    ) //return
  } //render
}); //MainInterface

var DiagramsTree = React.createClass({
    getInitialState: function() {
        return {
            treeData: [
                { title: 'Process Flow/Flow Chart (act)',
                    children: [ { title: 'ARMD NGO' } ]
                },
                { title: 'Architecture/Decomposition (bdd)' },
                { title: 'Interface (ibd)' },
                { title: 'Doc Tree/Organization (pkg)' },
                { title: 'Parametric (par)' },
                { title: 'Requirement (req)' },
                { title: 'Interaction/System Behavior (sd, stm)' },
                { title: 'Stakeholder Analysis (uc)' }
            ]
        } //return
    }, //getInitialState

    render: function() {
        return (
            <SortableTree
                treeData={this.state.treeData}
                onChange={treeData => this.setState({ treeData })}
                scaffoldBlockPxWidth={30}
                slideRegionSize={50}
                canDrag={false}
                isVirtualized={false}
            />
        ); // return
    } // render
}); // DiagramsTree

ReactDOM.render(
  <MainInterface />,
  document.getElementById('view-pane')
); // render

ReactDOM.render(
    <DiagramsTree/>,
    document.getElementById('diagrams-tree')
);
