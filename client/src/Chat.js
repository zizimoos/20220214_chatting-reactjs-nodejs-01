import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ScrollToBottom from "react-scroll-to-bottom";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 4px solid maroon;
`;

const ChatArea = styled.div`
  width: 90%;
  height: 80vh;
  background-color: mistyRose;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
  border: 4px solid chocolate;
`;

const MessageContainer = styled.div`
  width: 90%;
  margin: 10px;
  padding: 0 10px;
  display: flex;
  ${(props) =>
    props.whoIsAuthor === "me"
      ? `justify-content: flex-end;`
      : `justify-content: flex-start;`}
`;

const MessageBox = styled.div`
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 13px;
  ${(props) =>
    props.whoIsAuthor === "me"
      ? `align-items: flex-end;`
      : `align-items: flex-start;`}
`;

const MessageText = styled.div`
  width: 90%;
  padding: 10px;
  border-radius: 10px;

  color: white;
  font-size: 13px;
  ${(props) =>
    props.whoIsAuthor === "me"
      ? `background-color: darkkhaki;`
      : `background-color: steelblue;`}
`;

const SubTextBox = styled.div`
  font-size: 10px;
  padding: 0 5px;
`;

const InputArea = styled.div`
  width: 100%;
  padding: 5px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  input {
    padding: 5px;
    margin: 2px 2px;
    border-radius: 10px;
    border: 0px solid black;
    background-color: peru;
  }
`;

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const changeMessage = (event) => {
    setCurrentMessage(event.target.value);
  };

  const sendMessage = async (event) => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          String(new Date(Date.now()).getHours()).padStart(2, "0") +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, "0"),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <Wrapper>
      <div>
        <p>LIVE CHAT</p>
        <p>ROOM : {room}</p>
      </div>

      <ChatArea>
        <ScrollToBottom>
          {messageList.map((data, index) => (
            <MessageContainer
              whoIsAuthor={username === data.author ? "me" : "other"}
            >
              <MessageBox
                key={index}
                whoIsAuthor={username === data.author ? "me" : "other"}
              >
                <SubTextBox>
                  {data.author === username ? "me" : data.author}
                </SubTextBox>
                <MessageText
                  whoIsAuthor={username === data.author ? "me" : "other"}
                >
                  {data.message}
                </MessageText>
                <SubTextBox> {data.time}</SubTextBox>
              </MessageBox>
            </MessageContainer>
          ))}
        </ScrollToBottom>
      </ChatArea>

      <InputArea>
        <input
          type="text"
          placeholder="....."
          onChange={changeMessage}
          value={currentMessage}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        {/* <div onClick={sendMessage}>&#9658;</div> */}
      </InputArea>
    </Wrapper>
  );
}

export default Chat;
