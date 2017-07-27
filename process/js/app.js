var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var SvgFileZoomPan = require('react-svg-file-zoom-pan');
var SortableTree = require('react-sortable-tree').default;

var MainInterface = React.createClass({
    getInitialState: function() {
        return {
            orderDir: 'asc',
            selectedDiagram: {
                "title": "Tiger",
                "lastModified": "2017-07-26 6:59PM",
                "lastModifiedBy": "John Doe",
                "className": "other",
                "comments": "",
                "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg"
            },
            queryText: '',
            detailsVisible: true,
            projectData: []
        } //return
    }, //getInitialState

    componentDidMount: function() {
        this.serverRequest = $.get('./js/data.txt', function(result) {
            var tempData = JSON.parse(result);
            var diagramTypesArray = tempData.diagrams;
            for (var i = 0; i < diagramTypesArray.length; i++) {
                diagramTypesArray[i].children = _.sortBy(diagramTypesArray[i].children, [function(o)  { return o.title }]);
            }
            tempData.diagrams = diagramTypesArray;
            this.setState({
                projectData: tempData
            }); //setState
        }.bind(this)); //serverRequest
    }, //componentDidMount

    componentWillUnmount: function() {
        this.serverRequest.abort(); // Close project data request
    }, //componentWillUnmount

    treeListOnChange: function(treeData) {
        var newProjectData = this.state.projectData;
        newProjectData.diagrams = treeData;
        this.setState({
            projectData: newProjectData
        });
    }, // treeListOnChange

    treeListOnClick: function(diagram) {
        this.setState({
            selectedDiagram: diagram
        });
    }, // treeListOnClick

    commentsChange: function(event) {
        var newSelectedDiagram = this.state.selectedDiagram;
        newSelectedDiagram.comments = event.target.value;
        this.setState({
            selectedDiagram: newSelectedDiagram
        });
    },

    toggleDetails: function() {
        var tempVisibility = !this.state.detailsVisible;
        this.setState({
            detailsVisible: tempVisibility
        });
    },

    searchDiagrams: function(event) {
        this.setState({
            queryText: event.target.value
        }); // setState
    }, // searchDiagrams

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

    if (this.state.detailsVisible) {
        detailsPane =
        <aside id="details-pane" className="layer">
            <h3>{this.state.selectedDiagram.title}</h3>
            <table id="details-list">
                <thead>
                    <tr><th colSpan='2'>Details</th></tr>
                </thead>
                <tbody>
                    <tr><td>Type:</td><td>{this.state.selectedDiagram.className}</td></tr>
                    <tr><td>Modified:</td><td>{this.state.selectedDiagram.lastModified} by {this.state.selectedDiagram.lastModifiedBy}</td></tr>
                    <tr><td>Created:</td><td>Jun 7, 2017 by nphojana</td></tr>
                </tbody>
            </table>
            <div className="comments-wrapper">
                <label htmlFor="comment-box">Comments:</label>
                <textarea type="text" name="comment-box" placeholder="Start typing..." rows={8} onChange={this.commentsChange} value={this.state.selectedDiagram.comments}></textarea>
            </div>
        </aside>
    } else [
        detailsPane = ""
    ]

    return (
        <div> {/* Can only return one element, so wrapping it in a div */}
        <header className="layer">
            <nav className="navbar" role="navigation">
                <h1 className="navbar-brand">Project: {this.state.projectData.projectName}</h1>
                <div className="toolbar">
                    <div href="#changelog" className="action-button" title="Changes"><i className="fa fa-clock-o"></i></div>
                    <div href="#comments" className="action-button" title="Comments"><i className="fa fa-commenting"></i></div>
                    <div href="#members" className="action-button" title="Members"><i className="fa fa-users"></i></div>
                    <span className="details-icon">
                        <div className="action-button" title="Show Details" onClick={this.toggleDetails}><i className="fa fa-info"></i></div>
                    </span>
                </div>
            </nav>
        </header>

        <div className="main">
            <aside id="navigation-pane" className="layer">
                <div id="search-bar-wrapper">
                    <span id="search-bar-icon"><i className="fa fa-search"></i></span>
                    <input type="text" placeholder='Search' id='search-bar' onChange={this.searchDiagrams}/>
                </div>
                <DiagramsTree
                    treeData = { this.state.projectData.diagrams != null ? this.state.projectData.diagrams : [] }
                    onChange = { this.treeListOnChange }
                    onClick = { this.treeListOnClick }
                    searchQuery = { this.state.queryText }
                />
            </aside>
            <ViewPane
                svgURL = { this.state.selectedDiagram.url }
            />
            {detailsPane}
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
    expand(expanded) {
        this.setState({
            treeData: toggleExpandedForAll({
                treeData: this.state.treeData,
                expanded,
            }),
        });
    },

    render: function() {
        return (
            <SortableTree
                treeData = { this.props.treeData }
                onChange = { treeData => this.props.onChange(treeData) }
                searchQuery = { this.props.searchQuery }
                scaffoldBlockPxWidth = {30}
                slideRegionSize = {50}
                canDrag = {false}
                isVirtualized = {false}
                generateNodeProps = {rowInfo => ({
                    onClick: () => {
                        if (rowInfo.path.length > 1)
                            this.props.onClick(rowInfo.node)
                        else
                            this.expand(true);
                    }
                })}
            />
        ); // return
    } // render
}); // DiagramsTree

ReactDOM.render(
  <MainInterface />,
  document.getElementById('main-interface')
); // render
