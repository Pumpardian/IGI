import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props)

    this.state = { closing: false };
    this.timer = null;
  }

  static defaultProps = {
    duration: 5000,
    onClose: () => console.log("Message closed"),
    content: "Message content"
  };

  componentDidMount() {
    if (this.props.duration > 0) {
        this.timer = setTimeout(() => {
          this.handleClose()
        }, this.props.duration);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  handleClose = () => {
    this.setState({ closing: true });

    setTimeout(() => {
      this.props.onClose();
    }, 300);
  }

  render() {
    const { content } = this.props;
    const { closing } = this.state;

    return (
      <div className={`message ${closing ? "closing" : ""}`}>
        <div className="message-content">
          <span>{content}</span>
          <button className="message-close" onClick={this.handleClose}>×</button>
        </div>
      </div>
    );
  }
};

export default Message;