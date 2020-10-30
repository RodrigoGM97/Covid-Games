import React from 'react';
import Picture from '../Images/profile_image.png';

function Profile_picture() {

    return (
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', marginTop:'15px'}}>
        <img
          src={Picture} alt="Profile picture" className="center"
          height={'20%'}
          width={'20%'}
        />
      </div>
    );

}

export default Profile_picture;