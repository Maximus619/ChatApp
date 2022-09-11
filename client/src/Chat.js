import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { quill, quillRef } = useQuill();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  React.useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        // console.log('Text change!');'

        console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div style={{ width: 500, height: 20 }}>
          <div ref={quillRef}
            type="text"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }} />
        </div>
        {/* <div className="text-editor-header">
          <span><button type="button" className="btn" datae-element="bold">
            <i className="fa fa-bold"></i>
          </button>
            <button type="button" className="btn" datae-element="italic">
              <i className="fa fa-italic"></i>
            </button>
            <button type="button" className="btn" datae-element="strikeThrough">
              <i className="fa fa-strikethrough"></i>
            </button>
            <button type="button" className="btn" datae-element="createLink">
              <i className="fa fa-link"></i>
            </button>
            <button type="button" className="btn" datae-element="insertUnorderedList">
              <i className="fa fa-list-ul"></i>
            </button>
            <button type="button" className="btn" datae-element="insertOrderedList">
              <i className="fa fa-list-ol"></i>
            </button>
            <button type="button" className="btn" datae-element="formatBlock">
              <i className="fa fa-bold"></i>
            </button>
          </span>
        </div>
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button type="button" className="btn" datae-element="insertImage">
          <i className="fa fa-image"></i>
        </button>
        <button type="button" className="btn" datae-element="insertImage">
          <i className="fa fa-bold"></i>
        </button>
        <button type="button" className="btn" datae-element="insertImage">
          <i className="fa fa-bold"></i>
        </button> */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div >
  );
}

export default Chat;
