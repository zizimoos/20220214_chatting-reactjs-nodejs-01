import React,{useState, useEffect} from 'react';
import styled from "styled-components"
import ScrollToBottom from "react-scroll-to-bottom"

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-Direction: column;
    justify-content: space-between;
    align-items: center;
`;

const ChatArea = styled.div`
    width:90%;
    height: 80vh;
    background-color: mistyRose;
    display: flex;
    // flex-Direction: column-reverse;
    overflow : auto;
`;

 const MessageBox = styled.div`
    padding: 10px;
    display:flex;
    flex-Direction: row;
    justify-Content: space-between;
    font-size: 13px;
 `;

 const MessageText = styled.div`
    width: 90%;
    padding: 10px;
    border-radius: 10px;
    background-color: chocolate; 
    font-size: 13px;
 `;

 const InputArea = styled.div`
    width: 90%;
    display: flex;
    flex-Direction: row;
 `;



function Chat({socket, username, room}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const changeMessage=(event)=>{
        setCurrentMessage(event.target.value)
    }
    const sendMessage= async (event)=>{
        if(currentMessage !== ""){
            const messageData={
                room:room,
                author: username,
                message: currentMessage,
                time: String(new Date(Date.now()).getHours()).padStart(2,"0") 
                + ":" + String(new Date(Date.now()).getMinutes()).padStart(2,"0")
            }
            await socket.emit("send_message", messageData)
            setMessageList(list=>[...list, messageData])
            setCurrentMessage("")
            
        }
    }

    useEffect(()=>{
        socket.on("receive_message", (data)=>{
            setMessageList(list =>[...list, data])
        })
    },[socket])

    return (
        <Wrapper>
            <div>
                <p>LIVE CHAT</p>
                <p>{room}</p>
            </div>
            <ChatArea>
            <ScrollToBottom>
             {messageList.map((data, index) => 
             <MessageBox key={index} whoIsAuthor={username === data.author ? "me" : "other"}>
                <div>
                    <div>{data.author === username ? "me": data.author } </div>
                    <MessageText>{data.message}</MessageText>
                </div>
                <div> {data.time}</div>
             </MessageBox>
            )}   
            </ScrollToBottom>     
            </ChatArea>
            <InputArea>
                <input 
                type="text" 
                placeholder="....." 
                onChange={changeMessage} 
                value={currentMessage} 
                onKeyPress={(event) =>{event.key === "Enter" && sendMessage()}} />
                <button onClick={sendMessage}>&#9658;</button>
            </InputArea> 
        </Wrapper>
    );
}

export default Chat;