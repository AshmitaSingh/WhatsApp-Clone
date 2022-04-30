import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth,db } from '../firebase';
import { useRouter } from 'next/router';

function Chat({ id, users }) {

    const router = useRouter();
    const [user] = useAuthState(auth);

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(users, user))
    );

    //When user clicks on one of the chat out of the chat-list, then we enter that specific chat
    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    // 'users' -> array of users; 'user' -> logged in user
    const recipientEmail = getRecipientEmail(users, user)

  return (
    <Container onClick={enterChat}>
        { recipient ? (
            <UserAvatar src={recipient?.photoURL} alt='user-avatar' />
        ) : (
            <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;