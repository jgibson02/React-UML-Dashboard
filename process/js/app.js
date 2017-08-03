var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');

var Clipboard = require('clipboard');
var SvgFileZoomPan = require('react-svg-file-zoom-pan').default;
var SortableTree = require('react-sortable-tree').default;
var ReactModalBootstrap = require('react-modal-bootstrap');
    var Modal = ReactModalBootstrap.Modal;
    var ModalHeader = ReactModalBootstrap.ModalHeader;
    var ModalTitle = ReactModalBootstrap.ModalTitle;
    var ModalClose = ReactModalBootstrap.ModalClose;
    var ModalBody = ReactModalBootstrap.ModalBody;
    var ModalFooter = ReactModalBootstrap.ModalFooter;

var MainInterface = React.createClass({
    getInitialState: function() {
        return {
            selectedDiagram: null,
            projectComments: '',
            changelog: '',
            queryText: '',
            changelogVisible: false,
            commentsVisible: false,
            detailsVisible: false,
            projectData: []
        } //return
    }, //getInitialState

    componentWillMount: function() {
        this.dataRequest = $.get('./js/data.txt', function(result) {
            var tempData = JSON.parse(result);
            var diagramTypesArray = tempData.diagrams;
            diagramTypesArray = _.remove(diagramTypesArray, function(typeNode) {
                return !_.isEmpty(typeNode.children);
            });
            for (var i = 0; i < diagramTypesArray.length; i++) {
                diagramTypesArray[i].children = _.sortBy(diagramTypesArray[i].children, [function(o)  { return o.title }]);
            }
            tempData.diagrams = diagramTypesArray;
            this.setState({
                projectData: tempData
            }); //setState
        }.bind(this)); //dataRequest
    }, // compontentWillMount

    componentDidMount: function() {
        this.changelogRequest = $.get('./changelog.txt', function(result) {
            var tempChangelog = result;
            this.setState({
                changelog: tempChangelog
            }); //setState
        }.bind(this)); //serverRequest
        new Clipboard('#comments-copy');
    }, //componentDidMount

    componentWillUnmount: function() {
        this.dataRequest.abort(); // Close project data request
        this.changelogRequest.abort(); // Close project changelog request
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
            selectedDiagram: diagram,
            detailsVisible: true
        });
    }, // treeListOnClick

    commentsChange: function(event) {
        var newSelectedDiagram = this.state.selectedDiagram;
        newSelectedDiagram.comments = event.target.value;
        this.setState({
            selectedDiagram: newSelectedDiagram
        });
    },

    downloadDiagram: function(event) {
        window.open(this.state.selectedDiagram.url);
    }, // downloadDiagram

    toggleDetails: function() {
        var tempVisibility = !this.state.detailsVisible;
        this.setState({
            detailsVisible: tempVisibility
        });
    },

    hideChangelog: function() {
        this.setState({
            changelogVisible: false
        });
    }, // hideChangelog

    hideComments: function() {
        this.setState({
            commentsVisible: false
        });
    }, // hideComments

    searchDiagrams: function(event) {
        this.setState({
            queryText: event.target.value
        }); // setState
    }, // searchDiagrams

    showChangelog: function() {
        this.setState({
            changelogVisible: true
        });
    }, // showChangelog

    showComments: function() {
        var commentsList = "";
        var treeData = this.state.projectData.diagrams;
        for (var i = 0; i < treeData.length; i++) {
            for (var j = 0; j < treeData[i].children.length; j++) {
                var diagram = treeData[i].children[j];
                if (diagram.comments !== "") {
                    commentsList += ("Diagram: " + diagram.qualifiedName + "\nComments: " + diagram.comments + "\n\n");
                }
            }
        }
        if (commentsList === "")
            commentsList = "No comments have been made.";
        this.setState({
            projectComments: commentsList,
            commentsVisible: true
        });
    }, // showComments

    render: function() {
        var queryText = this.state.queryText;
        var projectData =  this.state.projectData;
        var diagramNotSelected = this.state.selectedDiagram == null;

        if (this.state.detailsVisible && !diagramNotSelected) {
            detailsPane =
            <aside id="details-pane" className="layer">
                <h3>{this.state.selectedDiagram.title}</h3>
                <table id="details-list">
                    <thead>
                        <tr><th colSpan='2'>Details</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Context:</td><td>{this.state.selectedDiagram.qualifiedName}</td></tr>
                        <tr><td>Type:</td><td>{this.state.selectedDiagram.type}</td></tr>
                        <tr><td>Modified:</td><td>{this.state.selectedDiagram.subtitle}</td></tr>
                        <tr><td>Notes:</td><td>{this.state.selectedDiagram.documentation}</td></tr>
                    </tbody>
                </table>
                <div className="comments-wrapper">
                    <label htmlFor="comment-box">Comments:</label>
                    <textarea type="text" name="comment-box" placeholder="Start typing..." rows={8} onChange={this.commentsChange} value={this.state.selectedDiagram.comments}></textarea>
                </div>
            </aside>
        } else {
            detailsPane = ""
        }

        return (
            <div> {/* Can only return one element, so wrapping it in a div */}
            <Modal isOpen={this.state.changelogVisible} onRequestHide={this.hideChangelog}>
                <ModalHeader>
                    <ModalClose onClick={this.hideChangelog}/>
                    <ModalTitle>Changelog</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {this.state.changelog.split("\n").map(function(item, i) {
                        return (
                            <span key={i}>
                                {item}
                                <br/>
                            </span>
                        )
                    })}
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-default" onClick={this.hideChangelog}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.commentsVisible} onRequestHide={this.hideComments}>
                <ModalHeader>
                    <ModalClose onClick={this.hideComments}/>
                    <ModalTitle>Comments</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <p id="commentsBox">
                        {this.state.projectComments.split("\n").map(function(item, i) {
                            return (
                                <span key={i}>
                                    {item}
                                    <br/>
                                </span>
                            )
                        })}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <button id="comments-copy" className="btn btn-primary" data-clipboard-target="#commentsBox">
                        Copy
                    </button>
                    <button className="btn btn-default" onClick={this.hideComments}>
                        Close
                    </button>
                </ModalFooter>
            </Modal>
            <header className="layer">
                <nav className="navbar" role="navigation">
                    <h1 className="navbar-brand">Project: <span id="project-name">{this.state.projectData.projectName}</span></h1>
                    <div className="toolbar">
                        <button className="action-button" title="Changes" onClick={this.showChangelog}><i className="material-icons history-icon">history</i></button>
                        <button className="action-button" title="Comments" onClick={this.showComments}><i className="material-icons comment-icon">comment</i></button>
                        <button className="action-button" title="Download" onClick={this.downloadDiagram} disabled={diagramNotSelected}><i className="material-icons">file_download</i></button>
                        <button className="action-button" id="details-button" title="Show Details" onClick={this.toggleDetails} disabled={diagramNotSelected}><i className="material-icons info-icon">info_outline</i></button>
                    </div>
                </nav>
            </header>

            <div className="main">
                <aside id="navigation-pane" className="layer">
                    <div id="search-bar-wrapper">
                        <span id="search-bar-icon"><i className="material-icons">search</i></span>
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
                    svgURL = { this.state.selectedDiagram != null ? this.state.selectedDiagram.url : '' }
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
    render: function() {
        return (
            <SortableTree
                treeData = { this.props.treeData }
                onChange = { function(treeData) { return this.props.onChange(treeData)}.bind(this) }
                searchQuery = { this.props.searchQuery }
                searchFocusOffset = {0}
                scaffoldBlockPxWidth = {30}
                slideRegionSize = {50}
                rowHeight = {70}
                canDrag = {false}
                generateNodeProps = {
                    function(rowInfo) {
                        var isChild = rowInfo.path.length > 1;

                        return ({
                            buttons: [
                                rowInfo.node.children ? <button>{rowInfo.node.children.length}</button>  : null
                            ],
                            className: isChild ? "node-child" : "node-parent",
                            onClick: function() {
                                if (isChild) {
                                    this.props.onClick(rowInfo.node);
                                }
                            }.bind(this)
                        })
                    }.bind(this)
                }
            />
        ); // return
    } // render
}); // DiagramsTree

ReactDOM.render(
  <MainInterface />,
  document.getElementById('main-interface')
); // render
