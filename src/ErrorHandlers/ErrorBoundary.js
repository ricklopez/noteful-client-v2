import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    error: false,
  };

  goToHome = () => {
    window.location.href = "/";
  };

  componentDidCatch(error, errorInfo) {
    // console.log(error, errorInfo);
    this.setState({
      error: true,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <h2>
            Folder or Note ID does not exist- Please go back to the Home page.
          </h2>
          <button onClick={this.goToHome}>Home Page</button>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
