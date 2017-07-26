var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var AptList = require('./AptList');
var AddAppointment = require('./AddAppointment');
var SearchAppointments = require('./SearchAppointments');
var SvgFileZoomPan = require('react-svg-file-zoom-pan').default;
var SortableTree = require('react-sortable-tree').default;

var MainInterface = React.createClass({
    getInitialState: function() {
        return {
            aptBodyVisible:  false,
            orderBy: 'petName',
            orderDir: 'asc',
            svgURL: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg",
            queryText: '',
            projectData: []
        } //return
    }, //getInitialState

    componentDidMount: function() {
        this.serverRequest = $.get('./js/data.txt', function(result) {
            var tempData = JSON.parse(result);
            this.setState({
                projectData: tempData
            }); //setState
        }.bind(this)); //serverRequest
    }, //componentDidMount

    componentWillUnmount: function() {
        this.serverRequest.abort(); // Close project data request
    }, //componentWillUnmount

    deleteMessage: function(item) {
        var allApts = this.state.myAppointments;
        var newApts = _.without(allApts, item);
        this.setState({
            myAppointments: newApts
        }); //setState
    }, //deleteMessage

    treeListOnChange: function(treeData) {
        var newProjectData = this.state.projectData;
        newProjectData.diagrams = treeData;
        this.setState({
            projectData: newProjectData
        });
    }, // treeListOnChange

    treeListOnClick: function(diagramURL) {
        this.setState({
            svgURL: diagramURL
        });
    }, // treeListOnClick

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

  searchApts: function(q) {
      this.setState({
        queryText: q
      }); // setState
  }, // searchApts

  render: function() {
    var filteredApts = [];
    var orderBy =  this.state.orderBy;
    var orderDir = this.state.orderDir;
    var queryText = this.state.queryText;
    var projectData =  this.state.projectData;

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
        <div>
        <header className="layer">
            <nav className="navbar" role="navigation">
                <h1 className="navbar-brand">{this.state.projectData.projectName}</h1>
                <div className="toolbar">
                    <a href="#changelog"><i className="fa fa-clock-o"></i></a>
                    <a href="#comments"><i className="fa fa-commenting"></i></a>
                    <a href="#members"><i className="fa fa-users"></i></a>
                </div>
            </nav>
        </header>

        <div className="main">
            <aside id="navigation-pane" className="layer">
                <div className="search-bar-wrapper">
                    <span id="search-bar-icon"><i className="fa fa-search"></i></span>
                    <input type="text" placeholder='Search' id='search-bar'/>
                </div>
                <DiagramsTree
                    treeData = { this.state.projectData.diagrams != null ? this.state.projectData.diagrams : [] }
                    onChange = { this.treeListOnChange }
                    onClick = { this.treeListOnClick }
                />
            </aside>
            <ViewPane
                svgURL = { this.state.svgURL }
            />
            <aside id="details-pane" className="layer">
                <h3>ARMD NGO</h3>
                <table id="details-list">
                    <thead>
                        <tr><th colSpan='2'>Details</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Type:</td><td>Activity Diagram</td></tr>
                        <tr><td>Modified:</td><td>Jul 19, 2017 12:38<small>PM</small> by nphojana</td></tr>
                        <tr><td>Created:</td><td>Jun 7, 2017 by nphojana</td></tr>
                    </tbody>
                </table>
                <div className="comments-wrapper">
                    <label htmlFor="comment-box">Comments:</label>
                    <textarea type="text" name="comment-box" placeholder="Start typing..." rows={8}></textarea>
                </div>
            </aside>
        </div>
        </div>
    ) //return
  } //render
}); //MainInterface

var ViewPane = React.createClass({
    render: function() {
        return(
            <div id="view-pane">
                <SvgFileZoomPan svgPath={ this.props.svgURL } duration={300} resize={true}/>
            </div>
        );
    }
});

var DiagramsTree = React.createClass({
    render: function() {
        return (
            <SortableTree
                treeData = { this.props.treeData }
                onChange = { treeData => this.props.onChange(treeData) }
                scaffoldBlockPxWidth = {30}
                slideRegionSize = {50}
                canDrag = {false}
                isVirtualized = {false}
                generateNodeProps = {rowInfo => ({
                    onClick: () => this.props.onClick(rowInfo.node.url),
                })}
            />
        ); // return
    } // render
}); // DiagramsTree

ReactDOM.render(
  <MainInterface />,
  document.getElementById('main-interface')
); // render
