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
import {Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Form, Col } from 'reactstrap';

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
  Button,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect } from "react";
import db from "firebase/firebase.config";
import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";


const Tables = () => {

  const [productList,setProductList] = useState([])
  const [modalAddProduct,setModalAddProduct] = useState(false)
  const toggleModalAddProduct = () => setModalAddProduct(!modalAddProduct)

  const [product,setProduct] = useState({
  })


  useEffect(() => {
    const fetchProductList = async() => {
      const productRef = db.collection("Products")
      const snapshot = await productRef.get()

      const result = []
      snapshot.forEach(doc => {
        result.push(doc.data())      
      });
      console.log(result)

      setProductList(result)
    }

    fetchProductList()
  },[])



  const handleDeleteProduct = () => {

  }

  const handleEditProduct = () => {

  }

  const handleAddProduct = () => {
    // console.log(product)
    const newProduct = {...product}

    const specification = product.specification
    const detail = product.detail

    const resultSpecification = {}
    const resultDetail = []

    const splitSpecification = specification.split(".")
    splitSpecification.forEach((spec) => {
      const temp = spec.split(":")
    })


    


    setModalAddProduct(!modalAddProduct)
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
                  <h3 className="mb-0">Card tables</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Product ID</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Rating</th>
                      <th scope="col"><Button color="primary" onClick={toggleModalAddProduct}>Add product</Button> </th>
                    </tr>
                  </thead>
        {
          productList.length > 0 && productList.map((product) => (

                  <tbody>
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
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          ${product.price + ' '}USD
                        </Badge>
                      </td>
                      <td>
                        {product.quantity}
                      </td>
                      <td className="d-flex">
                        
                        <span className="d-flex align-self-center">{product.rating}</span>
                        <span className="d-flex align-self-center">{Array(product.rating).fill().map((_,i) => <AiFillStar style={{ cursor: 'pointer'}} size={15} color='red' />)}</span>

                      </td>
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
                            <DropdownItem
                              href="#pablo"
                              onClick={handleDeleteProduct}
                            >
                              Delete product
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={handleEditProduct}
                            >
                              Edit product
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  </tbody>
                
          ))
          }
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
          
        
        </Container>

        <Modal isOpen={modalAddProduct} toggle={toggleModalAddProduct}>
          <ModalHeader toggle={toggleModalAddProduct}>Add Product</ModalHeader>
          <ModalBody>

            <Form>
              <FormGroup>
                <Label>Title:</Label>
                <Input type="text" onChange={event => setProduct({...product, title: event.target.value})}/>
              </FormGroup>
              <Row form>
                <Col xs={6}>
                  <FormGroup>
                    <Label>Price:</Label>
                    <Input type="number" onChange={event => setProduct({...product, price: event.target.value})} />
                  </FormGroup>
                </Col>

                <Col xs={6}>
                  <FormGroup>
                    <Label>Quantity:</Label>
                    <Input type="number" onChange={event => setProduct({...product, quantity: event.target.value})} />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Specification:</Label>
                <Input type="textarea" onChange={event => setProduct({...product, specification: event.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Detail:</Label>
                <Input  type="textarea" onChange={event => setProduct({...product,detail: event.target.value})}/>
              </FormGroup>
              <FormGroup>
                <Label>Upload Images:</Label>
                <Input type="file"/>
              </FormGroup>
              <FormGroup>
                <Label>Upload Thumbnail:</Label>
                <Input type="file"/>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAddProduct}>Add Product</Button>{' '}
            <Button color="secondary" onClick={toggleModalAddProduct}>Cancel</Button>
          </ModalFooter>
        </Modal>
        {/* {console.log(product)} */}

    </>
  );
};

export default Tables;
