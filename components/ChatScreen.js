import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { auth,db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Message from './Message';
import firebase from "firebase";
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const endOfMessagesRef = useRef(null);

    const [input, setInput] = useState('');

    const [messagesSnapshot] = useCollection(db
        .collection('chats')
        .doc(router.query.id)
        .collection('messages')
        .orderBy('timestamp', 'asc')
    );

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message = {{ 
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        }
        else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ));
        }
    }

    const sendMessage = (e) => {
        e.preventDefault();

        // Update the Last seen
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, {merge: true})

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        })

        // Setting the input to blank string
        setInput('');
        scrollToBottom();
    }

    const recipientEmail = getRecipientEmail(chat.users, user);

    // Fetch Recipient
    const [recipientSnapshot] = useCollection(
        db
          .collection('users')
          .where('email', '==', getRecipientEmail(chat.users, user))
    )

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

  return (
    <Container>
        <Header>
            { recipient ? (
                <Avatar src={recipient?.photoURL} />
            ) : (
                <Avatar>{recipientEmail[0]}</Avatar>
            )}

            <HeaderInformation>
                <h3>{recipientEmail}</h3>
                { recipientSnapshot ? (
                    <p>Last active: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : 'Unavailable'}
                    </p>
                ) : (
                    <p>Loading last active...</p>
                )}
            </HeaderInformation>

            <HeaderIcons>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </HeaderIcons>
            
        </Header>

        <MessageContainer>
            {showMessages()}
            <EndOfMessage ref={endOfMessagesRef} />
        </MessageContainer>

        <InputContainer>
            <IconButton><InsertEmoticonIcon/></IconButton>
            <Input value={input} onChange={ e => setInput(e.target.value) } />
            <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
            <IconButton><MicIcon/></IconButton>
        </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`

`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons= styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    padding: 20px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
`;

