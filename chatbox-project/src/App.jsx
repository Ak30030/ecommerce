import { useState } from 'react'
import {ChatInput} from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import './App.css'



      function App() {

          const [messages,setMessages] = useState([]
        );
       //const [ChatMessages,setChatMessage] = array;
        //const ChatMessages = array[0];
        //const setChatMessages = array[1];


            return(
            <div className="app-container">
          <ChatMessages
          messages ={messages}
          />
              <ChatInput
          messages ={messages}
          setMessages={setMessages}
          />
        </div>
            );
            }

export default App;
