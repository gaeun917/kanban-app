import React, {Component} from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {DragSource, DropTarget} from 'react-dnd'
import {Link} from 'react-router';

import CheckList from './CheckList';

// custom propType checker: card title should be "string"
// and less than "80" characters
let titlePropType = (props, propName, componentName) => {
    if (props[propName]) {
        let value = props[propName];
        if (typeof value !== 'string' || value.length > 80) {
            return new Error(
                `${propName} in ${componentName} is longer than 80 characters`
            );
        }
    }
};

// 1.DragSource
// 1.1 spec- begin(), end(), 1.2 collect(props for Cards)
const DragSpec = {
    beginDrag(props) {
        return {
            id: props.id,
            status: props.status
        }
    },
    endDrag(props) {
        props.cardCallbacks.persistCardDrag(props.id, props.status);
    }
}

//2. DropTarget
const DropSepc = {
    hover(props, monitor) {
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updatePosition(draggedId, props.id);
    }
}

const DragCollect = (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource()
    }
}

const DropCollect = (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

class Card extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDetails: false
        };
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    render() {
        const {
            id, tasks, color, title, description,
            taskCallbacks,
            connectDragSource,
            connectDropTarget
        } = this.props;

        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html: marked(description)}}/>
                    <CheckList cardId={id}
                               tasks={tasks}
                               taskCallbacks={taskCallbacks}
                    />
                </div>
            );
        }

        let sideColor = {
            position: 'absolute',
            zIndex: -1,
            top: 0,
            bottom: 0,
            left: 0,
            width: 7,
            backgroundColor: color
        };

        return connectDropTarget(
                connectDragSource(
                    <div className="card">
                        <div style={sideColor}/>
                        <div className="card__edit"><Link to={'/edit/'+id}>✎</Link></div>
                        <div className={this.state.showDetails ? "card__title card__title--is-open" : "card__title"}
                             onClick={this.toggleDetails.bind(this)}>
                            {title}
                        </div>
                        <ReactCSSTransitionGroup transitionName="toggle"
                                                 transitionEnterTimeout={250}
                                                 transitionLeaveTimeout={250}>
                            {cardDetails}
                        </ReactCSSTransitionGroup>
                    </div>
                )
        )
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: titlePropType,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks: PropTypes.object,
    cardCallbacks: PropTypes.object,
};

const dragHighOrderCard = DragSource('card', DragSpec, DragCollect)(Card);
const dragDropHighOrderCard = DropTarget('card', DropSepc, DropCollect)(dragHighOrderCard);

export default dragDropHighOrderCard;
