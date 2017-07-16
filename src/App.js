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
                {
                    id: 'fruit-1',
                    msg: 'apple',
                    user: "jessphillips",
                    profile_image: "https://pbs.twimg.com/profile_images/597069124720828417/IvNyrUQc_bigger.jpg",
                    name: "Jess Philips",
                    quoted_status: {}}
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
                // fruits: state.fruits.concat(message)
                fruits: [message].concat(state.fruits)
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
            const has_quoted_status = Object.keys(tweet.quoted_status) != 0;
            console.log(tweet);
            return (
                <div className="list-group-item list-group-item-info col-md-12" key={tweet.id}>
                    <div className="col-md-1">
                        <a href={"https://twitter.com/" + tweet.user}>
                            <img className="user-image" src={tweet.profile_image} alt={tweet.user} width="48" height="48"/>
                        </a>
                    </div>
                    <div className="col-md-11">
                        <div className="stream-item header">
                            <strong className="full-name"><a href={"https://twitter.com/" + tweet.user}>{tweet.name}</a></strong>
                            <span className="user-name">@{tweet.user}</span>
                        </div>
                        <div className="stream-item body">
                            <Linkify>{tweet.msg}</Linkify>
                            {has_quoted_status ? (
                                <div className="quoted-tweet-container">
                                    <div className="quoted-tweet">
                                        <div className="stream-item header">
                                            <strong className="full-name"><a
                                                href={"https://twitter.com/" + tweet.quoted_status.user}>{tweet.quoted_status.name}</a></strong>
                                            <span className="user-name">@{tweet.quoted_status.user}</span>
                                        </div>
                                        <div className="stream-item body">
                                            <Linkify>{tweet.quoted_status.msg}</Linkify>
                                        </div>
                                    </div>
                                </div>
                                ) : ("")}
                        </div>
                    </div>
                </div>
            )
        });
        return (
            <div className="container ">
                <div className="list-group text-center">
                    {stationComponents}
                </div>
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
