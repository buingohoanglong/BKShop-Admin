import React, { useState } from 'react';
import {
    Collapse,
    Nav, Navbar,
    NavbarBrand,
    NavbarText, NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';



const Filter = (props) => {
    const { header, onChangeFilter, title, fields } = props
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen)

    return (
        <div>
            <Navbar color="none" light expand="md" className='mx-0 my-0 px-0 py-0'>
                {/* <NavbarBrand >{header}</NavbarBrand> */}
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret className='mx-1 my-0 px-0 py-0'>
                                {title}
                            </DropdownToggle>
                            <DropdownMenu right>
                                {fields.map((field) => (
                                    <DropdownItem onClick={() => onChangeFilter(field)}>
                                        {field}
                                    </DropdownItem>
                                ))}
                                {/* <DropdownItem onClick={() => onChangeFilter(true)}>
                                    Low to High
                                </DropdownItem>
                                <DropdownItem onClick={() => onChangeFilter(false)}>
                                    High to Low
                                </DropdownItem> */}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>

    )
}


export default Filter