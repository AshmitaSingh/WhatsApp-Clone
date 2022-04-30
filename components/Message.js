import moment from 'moment';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({ user, message }) {

    const [userLoggedIn] = useAuthState(auth);

    // To determine what messages are of the Sender and of the Receiver (It's basically determining when to choose the 'Sender' style & when to use the 'Receiver' style)
    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

  return (
    <Container>
        <TypeOfMessage>{message.message}
        <Timestamp>
            {message.timestamp ? moment(message.timestamp).format('LT') : '...' }
        </Timestamp>
        </TypeOfMessage>
    </Container>
  )
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 24px;
    position: relative;
    text-align: center;
`;

// Differentiate between a sender and a receiver
// For the Sender : Extending the styles of the MessageElement for the Sender
const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`;

// For the Sender : Extending the styles of the MessageElement for the Sender
const Receiver = styled(MessageElement)`
    text-align: left;
    background-color: whitesmoke;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;