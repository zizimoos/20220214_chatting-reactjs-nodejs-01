import styled from "styled-components"
import io from "socket.io-client"
import Chat from "./Chat"
import {useState} from "react"

const socket = io.connect("http://localhost:3001")

const Container = styled.div`
    width: 100vw;
    heigit: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    input {
      width:90%;
    }
    button {
      
    }
    @media (min-width: 500px){
      width: 600px;
    }
`;

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false)

  const inputUserName=(event)=>{
    setUsername(event.target.value)
  }
  const inputRoomName = (event)=>{
    setRoom(event.target.value)
  }

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true)
    }
  };
  

  return (
    <Container >
    {!showChat ? ( 
      <>
        <h3>Join a Chat</h3>
        <input type="text" placeholder="what .... ?" onChange={inputUserName}></input>
        <input 
        type="text" 
        placeholder="Room ID .... ?" 
        onChange={inputRoomName}
        onKeyPress={(event) =>{event.key === "Enter" && joinRoom()}}
        ></input>
        <button onClick={joinRoom}>Join A Room</button>
      </>
      ):(
        <Chat socket={socket} username={username} room={room} />
      )
    }
     
      
    </Container>
  );
}

export default App;
