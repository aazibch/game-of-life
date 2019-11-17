import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Cell = (props) => <div
    id={props.id}
    className={"cell " + props.class}
    onClick={props.cellSelectHandler.bind(this, props.row, props.col)}></div>;

const Grid = (props) => {
    const cells = [];

    for (let row = 0; row < props.grid.length; row++) {
        for (let col = 0; col < props.grid[row].length; col++) {
            let className = "";
            let key = row + "_" + col;

            if (props.grid[row][col]) {
                className = "selected";
            }

            cells.push(<Cell
                key={key}
                id={key}
                class={className}
                row={row}
                col={col}
                cellSelectHandler={props.cellSelectHandler} />);
        }
    }

    return (
        <div id="grid" className="mx-auto mt-3">
            {cells}
        </div>
    );
};

const Controls = (props) => (
    <div className="btn-group btn-group-sm float-left">
        <button
            type="button"
            className="btn btn-dark"
            onClick={props.startButtonHandler}>Start</button>
        <button
            type="button"
            className="btn btn-dark"
            onClick={props.pauseButtonHandler}>Pause</button>
        <button
            type="button"
            className="btn btn-dark"
            onClick={props.clearButtonHandler}>Clear</button>
    </div>
);

const GenerationCount = (props) => <span className="text-uppercase float-right">Generation: {props.gen}</span>

const BottomBar = (props) => (
    <div className="mt-2">
        <Controls
            startButtonHandler={props.startButtonHandler}
            pauseButtonHandler={props.pauseButtonHandler}
            clearButtonHandler={props.clearButtonHandler} />
        <GenerationCount gen={props.gen} />
    </div>
)

class App extends Component {
    newGrid = Array(30).fill(Array(55).fill(false));

    state = {
        grid: this.newGrid,
        gen: 0,
        intervalSet: false
    }

    selectRandomCells () {
        const updatedGrid = copyNestedArray(this.state.grid);

        for (let i = 0; i < updatedGrid.length; i++) {
            updatedGrid[i] = updatedGrid[i].map(() => {
                return Math.floor(Math.random() * 4) === 1;
            });
        }

        this.setState({grid: updatedGrid});
    }

    clearInterval () {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    startGame = () => {
        const playOut = () => {
            const gridCopy = copyNestedArray(this.state.grid);
            const updatedGrid = copyNestedArray(this.state.grid);
            let aliveCount = 0;

            for (let i = 0; i < gridCopy.length; i++) {
                for (let j = 0; j < gridCopy[i].length; j++) {
                    let neighborCount = 0;

                    if (gridCopy[i][j - 1])
                        neighborCount++;
                    if (gridCopy[i][j + 1])
                        neighborCount++;

                    if (gridCopy[i + 1]) {
                        if (gridCopy[i + 1][j - 1])
                            neighborCount++;
                        if (gridCopy[i + 1][j])
                            neighborCount++;
                        if (gridCopy[i + 1][j + 1])
                            neighborCount++;
                    }

                    if (gridCopy[i - 1]) {
                        if (gridCopy[i - 1][j - 1])
                            neighborCount++;
                        if (gridCopy[i - 1][j])
                            neighborCount++;
                        if (gridCopy[i - 1][j + 1])
                            neighborCount++;
                    }

                    if (gridCopy[i][j]) {
                        aliveCount++;
                        if (neighborCount < 2 || neighborCount > 3)
                            updatedGrid[i][j] = false;
                    } else if (!gridCopy[i][j]) {
                        if (neighborCount === 3) {
                            updatedGrid[i][j] = true;
                        }
                    }
                }
            }
            
            if (aliveCount === 0) {
                this.clearInterval();
                this.setState({
                    gen: 0
                });
            } else {
                this.setState({
                    grid: updatedGrid,
                    gen: this.state.gen + 1
                });    
            }
        }

        if (this.intervalId === null || this.intervalId === undefined) {
            this.intervalId = setInterval(playOut, 150);
            this.setState({intervalSet: true});
        }
    }

    cellSelectHandler = (row, col) => {
        const updatedGrid = copyNestedArray(this.state.grid);
        updatedGrid[row][col] = !updatedGrid[row][col];
        this.setState({grid: updatedGrid});
    }

    clearButtonHandler = () => {
        this.clearInterval();
        this.setState({
            grid: this.newGrid,
            gen: 0
        });
    }

    pauseButtonHandler = () => {
        this.clearInterval();
    }

    startButtonHandler = () => {
        this.startGame();
    }

    componentWillMount() {
        this.selectRandomCells();
        this.startGame();
    }

    render() { 
        return (
            <div className="container">
                <h1 className="h2 text-center text-uppercase">Game of Life</h1>
                <Grid grid={this.state.grid} cellSelectHandler={this.cellSelectHandler} />
                <BottomBar startButtonHandler={this.startButtonHandler}
                    pauseButtonHandler={this.pauseButtonHandler}
                    clearButtonHandler={this.clearButtonHandler}
                    gen={this.state.gen} />
            </div>
        )
    }
}

function copyNestedArray (arr) {
    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
        newArr.push([...arr[i]]);
    }

    return newArr;
}

ReactDOM.render(<App />, document.getElementById('root'));
