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

export const Header = ({ history }) => {
    const location = useLocation();

    return (
        <Navbar>
            <Navbar.Group align={Alignment.LEFT} className="w-full">
                <Navbar.Heading><span className="font-bold md:font-semibold">Dreamdata Code Challange</span></Navbar.Heading>
                <Navbar.Divider className="hidden md:block"/>
                <div className="hidden sm:hidden md:flex">
                    <Link to="/" className={location.pathname === "/" ? `bg-gray-300 rounded` : ''}><Button className="bp3-minimal" icon="path-search" text="Events" /></Link>
                    <Link to="/dashboard" className={location.pathname === "/dashboard" ? `bg-gray-300 rounded` : ''}><Button className="bp3-minimal" icon="route" text="Bus" /></Link>
                </div>
                <div className="md:hidden ml-auto">
                    <Popover content={
                        <Menu>
                            <Menu.Item icon="path-search"  text="Events" onClick={() => history.push('/')} className={location.pathname === "/" ? `bg-gray-300 rounded` : ''}/>
                            <Menu.Item icon="route"  text="Bus" onClick={() => history.push('/dashboard')} className={location.pathname === "/dashboard" ? `bg-gray-300 rounded` : ''}/>
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