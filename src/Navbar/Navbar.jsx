import React from 'react';

//Navbar and Drawer
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

//User Info
import { Auth } from 'aws-amplify'

class UserData extends React.Component {
  constructor(props) {
    //console.log("Printing my props : ", props);
    super(props);

    this.state = {
      username: ''
    };
  }
  async componentDidMount() {
    this.setState(await this.getUserInfo());
    //console.log("I will now be mounted: ", this.state);
    
     
  }
  async getUserInfo()
    { 
      //console.log("Setting user info");
      let var1
      return new Promise((resolve,reject)=>
      {
        var1 = Auth.currentAuthenticatedUser();
        //console.log("en la promesa, ", var1)
        resolve(var1);
      }).then(userinfo=>{
        return userinfo;
      })
      //return await user.username;

  }
  render(){
    return(
      <p>{this.state.username}</p>
    )
  }

}





const useStyles_Drawer = makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  });

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

 function Navbar () {
    const classes = useStyles();
    const classes_Drawer = useStyles_Drawer();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
    
        setState({ ...state, [anchor]: open });
        };

    const list = (anchor) => (
        <div
          className={clsx(classes_Drawer.list, {
            [classes_Drawer.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <List>
            {['My Profile', 'My seasons', 'Available Seassons', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      );

    //console.log("afuera del then" + value)  
    return(
      <div className="Appbar">
          <AppBar position="static" color="#fffde7">
          <Toolbar>
              <div>
                  <React.Fragment key='left'>
                  <SwipeableDrawer
                      anchor='left'
                      open={state['left']}
                      onClose={toggleDrawer('left', false)}
                      onOpen={toggleDrawer('left', true)}
                  >
                      {list('left')}
                  </SwipeableDrawer>
                  </React.Fragment>
              </div>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
              <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}><UserData></UserData></Typography>
              <amplify-sign-out button-text="Sign Out"></amplify-sign-out>
          </Toolbar>
          </AppBar>
      </div>
      
      

  );
    
}

export default Navbar;
