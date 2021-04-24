/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* User Page: https://www.creative-tim.com/user/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState } from "react";
import { useEffect } from "react";

import db from "firebase/firebase.config";
import { Button, Col, Input, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Form, Label } from "reactstrap";
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'

const Tables = () => {
  const [userList, setUserList] = useState([])
  const [userInfo, setUserInfo] = useState({})
  const [idOfUser,setIdOfUser] = useState(0)
  const [modalEditInfo, setModalEditInfo] = useState(false);
  const toggleEditInfo = () => setModalEditInfo(!modalEditInfo);

  useEffect(async () => {
    db.collection('Users').get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userListPromise = querySnapshot.docs.map((userDoc) => (
          { ...userDoc.data(), id: userDoc.id }
        ))

        Promise.all(userListPromise).then(newUserList => {
          console.log("User List: ", newUserList)
          setUserList(newUserList)
        })
      }
    })
  }, [])

  
  const handleOnClickEditInfo = (id) => {
    setUserInfo(userList.find(item => item.id === id))
    setIdOfUser(id)
    setModalEditInfo(!modalEditInfo)
    console.log("userList")
  }

  const handleSaveInfo = async () => {
    const userRef = db.collection("Users").doc(idOfUser)
    const doc = await userRef.get()
    userRef.set(userInfo)
    setModalEditInfo(!modalEditInfo)
  }

  const handleOnClickDeleteItem = (id) => {
    const userRef = db.collection("Users").doc(id);
    // const newUserList = userList.filter((value,id) => value != id)
    setUserList(userList.filter((value,id) => value != id))
    userRef.delete()
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Users tables</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Password Id</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone number</th>
                    <th scope="col">Action</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {userList.map((user) => (
                    <tr>
                      <th scope="row">
                        
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={user.img}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              {user.title}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{user.name}</td>
                      <td>{user.password}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#" onClick={() => handleOnClickEditInfo (user.id)}>
                              Edit Information
                            </DropdownItem>
                            <DropdownItem href="#" onClick={() => handleOnClickDeleteItem(user.id)}>
                              Delete User
                            </DropdownItem>
                            <DropdownItem href="#" onClick={(e) => e.preventDefault()}>
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      

        <Modal isOpen={modalEditInfo} toggle={toggleEditInfo}>
          <ModalHeader toggle={toggleEditInfo}>Edit Information</ModalHeader>
          
          <ModalBody>
              <Form>
                  <FormGroup>
                    <Label for="name">User's name:</Label>
                    <Input placeholder="name" value={userInfo.title}
                    onChange={event => setUserInfo({...userInfo, title: event.target.value})}
                    />
                  </FormGroup>       
                  <br/>
                  
                  <FormGroup>
                      <Label for="password">Password:</Label>
                      {/* <Input placeholder="password" value={userInfo.price}
                      onChange={event => setUserInfo({...userInfo, password: event.target.value})}
                      /> */}
                  </FormGroup>
                  <br/>

                  <FormGroup>
                      <Label for="email">Email:</Label>
                      <Input type="string" placeholder="email" value={userInfo.email}
                      onChange={event => setUserInfo({...userInfo, email: event.target.value})}
                      />
                  </FormGroup>
              </Form>
          </ModalBody>

          
        </Modal>
      </Container>
    </>
  );
};

export default Tables;



