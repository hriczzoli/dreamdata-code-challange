// The main header of the application that provides navigation
// to switch between traffic events and transit data

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
    Alignment,
    Button,
    Navbar,
    Popover,
    Menu,
    Position,
    Icon
} from "@blueprintjs/core";

const Header = ({ history }) => {
    const location = useLocation();

    return (
        <Navbar className="bg-blue-800 text-white md:bg-gray-400 md:text-black">
            <Navbar.Group align={Alignment.LEFT} className="w-full">
                <Navbar.Heading><span className="font-bold md:font-semibold">Dreamdata Code Challange</span></Navbar.Heading>
                <Navbar.Divider className="hidden md:block"/>
                <div className="hidden sm:hidden md:flex">
                    <Link to="/" className={location.pathname === "/" ? `bg-gray-300 rounded` : ''}><Button className="bp3-minimal" icon="path-search" text="Events" /></Link>
                    <Link to="/transit" className={location.pathname === "/transit" ? `bg-gray-300 rounded` : ''}><Button className="bp3-minimal" icon="route" text="Transit" /></Link>
                </div>
                <div className="md:hidden ml-auto">
                    <Popover content={
                        <Menu>
                            <Menu.Item icon="path-search"  text="Events" onClick={() => history.push('/')} className={location.pathname === "/" ? `bg-gray-300 rounded` : ''}/>
                            <Menu.Item icon="route"  text="Transit" onClick={() => history.push('/transit')} className={location.pathname === "/transit" ? `bg-gray-300 rounded` : ''}/>
                        </Menu>
                    } position={Position.BOTTOM}>
                        <Icon icon="menu" iconSize="25" className=""/>
                    </Popover>
                </div>
            </Navbar.Group>
        </Navbar>
    )
}

export default Header;