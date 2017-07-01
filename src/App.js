import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import SocketIOClient from 'socket.io-client';
import Linkify from 'react-linkify'

let socket = SocketIOClient('http://localhost:5000', {path: '/socket.io/', origins: '*'});


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fruits: [
                {id: 'fruit-1', msg: 'apple'},
                {id: 'fruit-2', msg: 'lemon'}
            ]
        };
        this.addFruit = this.addFruit.bind(this);
        this.messageRecieve = this.messageRecieve.bind(this);
    }

    componentDidMount() {
        socket.on('message', this.messageRecieve);
        socket.on('text', this.messageRecieve);

    }


    addFruit(fruit) {
        //create a unike key for each new fruit item
        let timestamp = (new Date()).getTime();
        this.setState(function (state) {
            return {
                fruits: state.fruits.concat({id: 'fruit-' + timestamp, msg: fruit})
            }
        })
    }

    messageRecieve(message) {
        console.log(message);
        console.log(message.msg);
        //create a unike key for each new fruit item
        let timestamp = (new Date()).getTime();
        this.setState(function (state) {
            return {
                fruits: state.fruits.concat(message)
            }
        })
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <div className="component-wrapper">
                    <FruitList fruits={this.state.fruits}/>
                    <AddFruitForm addFruit={this.addFruit}/>

                </div>
            </div>
        );
    }
}

let FruitList = React.createClass({
    render: function () {
        let stationComponents = this.props.fruits.map(function (tweet) {
            return <li className="list-group-item list-group-item-info" key={tweet.id}><Linkify>{tweet.msg}</Linkify></li>
        });
        return (
            <div className="container">
                <ul className="list-group text-center">
                    {stationComponents}
                </ul>
            </div>);
    }
});


let AddFruitForm = React.createClass({
    createFruit: function (e) {
        e.preventDefault();
        //get the fruit object name from the form
        var fruit = this.refs.fruitName.value;
        //if we have a value
        //call the addFruit method of the App component
        //to change the state of the fruit list by adding an new item
        if (typeof fruit === 'string' && fruit.length > 0) {
            this.props.addFruit(fruit);
            //reset the form
            this.refs.fruitForm.reset();
        }
    },
    render: function () {
        return (
            <form className="form-inline" ref="fruitForm" onSubmit={this.createFruit}>
                <div className="form-group">
                    <label htmlFor="fruitItem">
                        Fruit Name
                        <input type="text" id="fruitItem" placeholder="e.x.lemmon" ref="fruitName"
                               className="form-control"/>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Add Fruit</button>
            </form>
        )
    }
});

export default App;
