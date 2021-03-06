import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import './components/layout/Navbar';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import Search from './components/users/Search';
import Users from './components/users/Users';
import User from './components/users/User';
import Alert from './components/layout/Alert';
import About from './components/pages/About';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  // Search GH users
  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ users: res.data.items, loading: false });
  }

  // Clears Users
  clearUsers = () => {
    this.setState({ users: [], loading: false })
  }

  // Get a single User
  getUser = async (username) => {
    this.setState({loading: true});
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ user: res.data, loading: false });
  }

  // Get a single User's repos
  getUserRepos = async (username) => {
    this.setState({loading: true});
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);
    this.setState({ repos: res.data, loading: false });
  }

  // Sets an alert
  setAlert = (msg, type) => {
    this.setState({
      alert: { msg, type }
    })
    setTimeout(() => this.setState({ alert: null }), 5000)
  }

  render(){
    const { user, users, loading, repos } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Alert alert={this.state.alert} />
                  <Search 
                    searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers} 
                    showClear={users.length > 0 ? true : false}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => (
                <User 
                  { ...props } 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  user={user} 
                  repos={repos}
                  loading={loading}
                />
              )} />
            </Switch>
            
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
