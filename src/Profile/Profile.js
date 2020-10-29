import React from 'react';

import Navbar from '../Navbar/Navbar';
import Table from '../Profile/Table';
import Image from '../Profile/Image';

function Profile() {

    return (
        <div>
            <Navbar></Navbar>
            <Image></Image>
            <Table></Table>
        </div>
    );
}

export default Profile;