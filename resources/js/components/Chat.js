import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joined: false,
            messages: [],
            room: {},
            user: {},
            chatClient: {},
            generalChannel: {},
            channel: {},
            message: '',
            ignored_user: '',
            other_user: '',
            voted: false,
        };

        this.handleKeypress = this.handleKeypress.bind(this);
        this.createOrJoinGeneralChannel = this.createOrJoinGeneralChannel.bind(this);
        this.setupChannel = this.setupChannel.bind(this);
        this.voteReverse = this.voteReverse.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    muted (text) {
        let { messages } = this.state;
        const message = {
            text: text,
            'from': false
        };
        messages.push(message);
        this.setState({
            messages: messages
        });
    }

    print (text, from = "System") {
        let { messages } = this.state;
        const message = {
            text,
            from
        };
        messages.push(message);
        this.setState({
            messages: messages
        });
    }

    reset () {
        this.setState({
            messages: []
        });
    }

    addMessage(message) {
        const { ignored_user, other_user, room, user } = this.state;
        let person_one = '';
        let person_two = '';
        if (room.reversed) {
            person_one = ignored_user;
            person_two = other_user;
        } else {
            person_one = other_user;
            person_two = ignored_user;
        }
        if (message.author == person_one || message.author == user.name) {
            this.print(message.body, message.author);
        } else {
            this.muted(person_two + " sent a message to " + person_one);
        }
        this.scrollToBottom();
    }

    setupChannel() {
        const { generalChannel, ignored_user, other_user, room, user } = this.state;
        //if (typeof(generalChannel) != undefined && typeof(generalChannel.state) != undefined  && generalChannel.state.status !== "joined") {
            generalChannel.join().then(() => {

            });
        //} else {

       // }

        generalChannel.on('messageAdded', (message) => {
            this.addMessage(message);
        });
    }

    createOrJoinGeneralChannel(chatClient) {
        const { room } = this.state;
        let channel = room.name;
        chatClient.getChannelByUniqueName(channel)
            .then((generalChannel) => {
                if (typeof(generalChannel.state) !== undefined) {
                    this.setState({
                        generalChannel: generalChannel
                    });
                }
                this.setupChannel();
            }).catch(() => {
                chatClient.createChannel({
                    uniqueName: channel,
                    friendlyName: channel
                });
            }).then((generalChannel) => {
                if (typeof(generalChannel.state) !== undefined) {
                    this.setState({
                        generalChannel: generalChannel
                    });
                }
                this.setupChannel();
            }).catch((e) => {

            });
    }

    setupRoom() {
        Twilio.Chat.Client.create(data.token).then(client => {
            let chatClient = client;
            chatClient.getSubscribedChannels().then(this.createOrJoinGeneralChannel(chatClient));
        }).catch(error => {
            console.error(error);
        });
    }

    joinRoom () {
        axios.get("/api/room")
        .then(response => {
            const user = response.data.user;
            const room = response.data.room;

            if (!room.cooling) {
                this.setState({
                    voted: false
                });
            }

            const { joined } = this.state;

            this.setState({
                user: response.data.user,
                room: response.data.room
            });

            if (room.users.length != 3) {
                this.reset();
                const waiting_for = 3 - room.users.length;
                this.print("Waiting for " + waiting_for + " more users to join.");
            } else if (!joined) {
                this.setupRoom();
                this.reset();
                this.print("You have joined the room");
                this.setState({
                    joined: true
                });
                const users = room.users;
                let ignored_user = '';

                let other_user = '';
                if (users[0].id == user.id) {
                    ignored_user = users[1].name;
                    other_user = users[2].name;
                }
                if (users[1].id == user.id) {
                    ignored_user = users[2].name;
                    other_user = users[0].name;
                }
                if (users[2].id == user.id) {
                    ignored_user = users[0].name;
                    other_user = users[1].name;
                }

                this.setState({
                    ignored_user: ignored_user,
                    other_user: other_user
                });
            } else {
                const users = room.users;
                let ignored_user = '';

                let other_user = '';
                if (users[0].id == user.id) {
                    ignored_user = users[1].name;
                    other_user = users[2].name;
                }
                if (users[1].id == user.id) {
                    ignored_user = users[2].name;
                    other_user = users[0].name;
                }
                if (users[2].id == user.id) {
                    ignored_user = users[0].name;
                    other_user = users[1].name;
                }

                this.setState({
                    ignored_user: ignored_user,
                    other_user: other_user
                });
            }

            setTimeout(() => {this.joinRoom()}, 500);
        }).catch(function(e) {

        });
    }

    handleKeypress (e) {
        if (e.charCode == 13) {
            const { generalChannel, message } = this.state;
            if (typeof(generalChannel.state) != undefined && message.length) {
                generalChannel.sendMessage(message);
            }
            this.setState({
                message: ""
            });
        } else {
            this.setState({
                message: e.target.value
            });
        }
    }

    scrollToBottom () {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }


    voteReverse (e) {
        e.preventDefault();
        const { voted, room } = this.state;
        if (!room.cooling) {
            return;
        }
        if (voted) {
            return;
        }
        axios.get('/api/reverse')
            .then((response) => {
                if (response.data === "voted") {
                    this.setState({
                        voted: true,
                    });

                }
            })
    }

    componentDidMount () {
        this.print('Loading Room...');
        this.joinRoom();
    }

    render () {
        const { messages, joined, user, room, ignored_user, other_user, voted } = this.state;
        const message_box = messages.map((message, index) => (
            <p key={index} className={message.from ? '' : 'mutedMessage'}><strong>{ message.from }{ message.from ? ':' : ''} </strong>{ message.text }</p>
        ));
        const hint = joined ? (
            <div>
                <p><strong>Your sending messages to: </strong>{ room.reversed ? other_user : ignored_user}</p>
                <p><strong>Sending messages to you: </strong>{ room.reversed ? ignored_user : other_user}</p>
            </div>
        ) : (
            <div></div>
        )
        const arrow = room.reversed ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg> ;
        const roomStatus = joined ? (
            <div className="card-body">
                <h3>Conversation Direction</h3>
                <p>{other_user} {arrow} {user.name} {arrow} {ignored_user}</p>
                <a onClick={this.voteReverse} disabled={room.cooling ? false : true} href="#" className={ room.cooling ? 'btn btn-primary' :  'btn border-dark' }>{room.cooling ? (voted ? "Voted " + room.reverse_votes + "/3" : "Vote to reverse direction " + room.reverse_votes + "/3") : "Cooling Down"}</a>
            </div>
        ) : (
            <div className="card-body">
                <p>Waiting for a full room</p>
            </div>
        );
        const chat_placeholder = joined ? "Say anything" : "Loading...";
        const title = user.name ?? 'Chat Box';
        return (
            <div className="row py-5 my-5">
                <div className="col-12 col-md-6 mt-3">
                    <div className="card">
                        <div className="card-header bg-primary text-white">{title}</div>
                        <div id="messages" className="card-body">
                            {message_box}
                            <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}></div>
                        </div>
                        <div className="card-footer d-flex">
                            <input value={this.state.message} onKeyPress={this.handleKeypress} onChange={this.handleKeypress} className="col py-2" id="chat-input" type="text" placeholder={chat_placeholder} autoFocus disabled={!joined}/>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mt-3">
                    <div className="card">
                        <div className="card-header bg-primary text-white">Room Status</div>
                        {roomStatus}
                    </div>
                    <div className="card mt-3">
                        <div className="card-header bg-primary text-white">Understanding the Flow</div>
                        <div className="card-body">
                            <p>
                                There are three people in the chat room.
                                You're only able to send messages to one of those people.
                                Only one of those people can send messages to you.
                                The person who you can send messages to is not the same person who can send messages to you and vise versa.
                            </p>
                            {hint}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;

if (document.getElementById('chat')) {
    ReactDOM.render(<Chat />, document.getElementById('chat'));
}
