import React from 'react';import {render} from 'react-dom';import KanbanBoardContainer from './KanbanBoardContainer';//instead of rendering KanbanBoard, render Container(data fetch wrapper)render(<KanbanBoardContainer />, document.getElementById('root'));