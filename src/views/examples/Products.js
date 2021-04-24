/*!

=========================================================
* Argon Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
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
  const [productList, setProductList] = useState([])
  const [productInfo, setProductInfo] = useState({})
  const [idOfProduct,setIdOfProduct] = useState(0)
  const [modalEditInfo, setModalEditInfo] = useState(false);
  const toggleEditInfo = () => setModalEditInfo(!modalEditInfo);

  useEffect(async () => {
    db.collection('Products').get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const productListPromise = querySnapshot.docs.map((productDoc) => (
          { ...productDoc.data(), id: productDoc.id }
        ))

        Promise.all(productListPromise).then(newProductList => {
          console.log("Product List: ", newProductList)
          setProductList(newProductList)
        })
      }
    })
  }, [])


  
  const handleOnClickEditInfo = (id) => {
    setProductInfo(productList.find(item => item.id === id))
    setIdOfProduct(id)
    setModalEditInfo(!modalEditInfo)
    console.log("productList")
  }

  const handleSaveInfo = async () => {
    const productRef = db.collection("Products").doc(idOfProduct)
    const doc = await productRef.get()
    productRef.set(productInfo)
    setModalEditInfo(!modalEditInfo)
  }

  const handleOnClickDeleteItem = (id) => {
    const productRef = db.collection("Products").doc(id);
    // const newProductList = productList.filter((value,id) => value != id)
    setProductList(productList.filter((value,id) => value != id))
    productRef.delete()
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
                <h3 className="mb-0">Products tables</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Product Id</th>
                    <th scope="col">Price</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Quantity</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {productList.map((product) => (
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
                              src={product.img}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              {product.title}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{product.id}</td>
                      <td>{product.price}</td>
                      <td>{product.rating}</td>
                      <td>{product.quantity}</td>
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
                            <DropdownItem href="#" onClick={() => handleOnClickEditInfo (product.id)}>
                              Edit Information
                            </DropdownItem>
                            <DropdownItem href="#" onClick={() => handleOnClickDeleteItem(product.id)}>
                              Delete Item
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
                    <Label for="name">Product's name:</Label>
                    <Input placeholder="name" value={productInfo.title}
                    onChange={event => setProductInfo({...productInfo, title: event.target.value})}
                    />
                  </FormGroup>       
                  <br/>
                  
                  <FormGroup>
                      <Label for="price">Price:</Label>
                      <Input placeholder="price" value={productInfo.price}
                      onChange={event => setProductInfo({...productInfo, price: event.target.value})}
                      />
                  </FormGroup>
                  <br/>

                  <FormGroup>
                      <Label for="quantity">Quantity:</Label>
                      <Input type="number" placeholder="quantity" value={productInfo.quantity}
                      onChange={event => setProductInfo({...productInfo, quantity: event.target.value})}
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
