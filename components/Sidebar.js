import React from 'react';
import styled from 'styled-components';
import { Avatar, IconButton, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth,db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';

function Sidebar() {

    const [user] = useAuthState(auth);

    //Making a reference to the database
    // The below code --> it goes to our firestore database and queries the users(from the 'users' array) and then checks the user.email 
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    // Mapping it to a real-time listener
    const [chatsSnapshot] = useCollection(userChatRef);   

    const createChat = () => {
        const input = prompt(
            'Please enter an email address for the user you wish to chat with'
        );

        // If there's no input, the I wanna stop this code from executing (wanna protect my code if there's no input)
        if(!input) return null;

        //npm install 'email-validator' & import
        // Check if the email is valid with help of a package 'email-validator' && also make sure that the chat is not 'logged in user's email'.
        // We add the chat into the DB 'chats' collection it doesn't already exists and is valid
        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            // If the email is valid then push it into the database; here we need logged in user
            // Add in a collection of 'chats' in the db
            // Inside the 'chats' collection, every single document will represent a chat.
            // Inside of a document, we'll have an user's array.
            // Every single chat will have an user's object inside of it which will be an array
            db.collection('chats').add({
                users: [user.email, input]
            });
        }
    }

    // A function to check if the chat already exists with the help of 'React firebase Hooks' 
        // recipientEmail --> this is the person with whom I'm intending to chat with
        const chatAlreadyExists = (recipientEmail) =>
            // !! means 'if the value is truthy then the code will return true, but if it was falsy/undefined/null/empty-string then it will return false'
            !!chatsSnapshot?.docs.find(
                (chat) => 
                    chat.data().users.find((user) => user === recipientEmail)?.length > 0
            );

  return (
    <Container>
        <Header>
            <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
            <IconsContainer>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>

        {/* Search Container */}
        <Search>
            <SearchIcon/>
            <SearchInput placeholder="Search in chats"/>
        </Search>

        {/* Button to start a new chat */}
        <SidebarButton onClick={createChat}>
            Start a new chat
        </SidebarButton>

        {/* List of Chats */}
        {chatsSnapshot?.docs.map(chat => (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    min-height: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;   /* IE & Edge */
    scrollbar-width: none;      /* Firefox */
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px; 
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;
