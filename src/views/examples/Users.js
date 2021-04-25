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
    setUserInfo(userList.find(user => user.id === id))
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

  const handleOnClickDeleteUser = (id) => {
    const userRef = db.collection("Users").doc(id);
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
                    <th scope="col">Password</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone number</th>
                    <th scope="col"></th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {userList.map((user) => (
                    <tr>
                      <th scope="row">{user.displayName}</th>
                        <td>{user.Password}</td>                   
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td></td>
                      
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
                            {/* <DropdownItem href="#" onClick={() => handleOnClickDeleteUser(user.id)}>
                              Delete User
                            </DropdownItem> */}
                            
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
                    <Label for="displayName">User's name:</Label>
                    <Input type="string" placeholder="displayName" value={userInfo.displayName}
                      onChange={event => setUserInfo({...userInfo, displayName: event.target.value})}
                      />
                  </FormGroup>       
                  <br/>
                  <FormGroup>
                      <Label for="Phone number">Phone number:</Label>
                      <Input type="string" placeholder="Phone number" value={userInfo.phone}
                      onChange={event => setUserInfo({...userInfo, phone: event.target.value})}
                      />
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
          <ModalFooter>
              <Button color="primary" onClick={handleSaveInfo}>
                  Save
              </Button>{" "}
              <Button color="secondary" onClick={toggleEditInfo}>
                  Cancel
              </Button>
          </ModalFooter>
          
        </Modal>
      </Container>
    </>
  );
};

export default Tables;



