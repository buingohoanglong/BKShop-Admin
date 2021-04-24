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
import { useAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './Product.css'
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
import db , {firebase, storage} from "firebase/firebase.config";
import { useState, useSelector } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { merge } from "jquery";


const Tables = () => {

  const [productList,setProductList] = useState([])

  const [modalAddProduct,setModalAddProduct] = useState(false)

  const toggleModalAddProduct = () => setModalAddProduct(!modalAddProduct)

  const [product,setProduct] = useState({})

  const [specification,setSpecification] = useState({})

  const [listFileImages, setListFileImages] = useState([])

  const [fileImageThumb, setFileImageThumb] = useState([]) 

  // const user = useSelector(state => state.user)

  const storageRef = storage.ref()

  const alert = useAlert()


  // const filesUpload = files.map((file) => (
  //   new File([file], getFileName(file.name))
  // ))


  const handleAddProduct = async () => {
    // console.log(product)
    const newProduct = {...product, detail: [], specification: {}}

    newProduct.detail.push(product.detail? product.detail: "")
    newProduct.specification = specification
    newProduct.img = ""
    newProduct.imgList = []
    newProduct.rating = 5
    console.log(newProduct)



    db.collection("Products").add(newProduct)
      .then((res) => {
        if(fileImageThumb.length > 0 && listFileImages.length > 0) {
          const filesUpload = listFileImages.map((file) => (
            new File([file], getFileName(file.name, res.id))
          ))
          filesUpload.push(new File([fileImageThumb[0]], getFileName(fileImageThumb[0].name, res.id)))

          uploadFiles(filesUpload, res.id)
          
        }

        // console.log(filesUpload)

        db.collection("Products").doc(res.id).set({id: res.id}, {merge: true}).then(() => {
          alert.success("Add product success")
        })
      }, (err) => {
        alert.error("Some error here")
      }).finally(() => {
        setFileImageThumb([])
        setListFileImages([])
        alert.success("Add product success")
      })
    setModalAddProduct(!modalAddProduct)
  }



  const getFileName = (fileName, productID) => {
    return fileName.split('.')[0] + productID + (new Date(Date.now()).getTime()) + '.' + fileName.split('.').pop()
  }


  const uploadFiles = (filesUpload, productID) => {
    const imgList = filesUpload.slice(0,filesUpload.length-1)
    const imgThumb = filesUpload[filesUpload.length-1]
    imgList.forEach((file) => {
        const metadata = {
            contentType: `image/${file.name.split('.').pop()}`
        }
        const uploadTask = storageRef.child(`images/products/${file.name}`).put(file, metadata)
        uploadTask.on('state_changed',
            (snapshot) => {
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log(downloadURL)
                    
                    db.collection("Products").doc(productID).update({
                      imgList: firebase.firestore.FieldValue.arrayUnion(downloadURL),
                    }).then(() => {
                      console.log("Update image list success")
                    })
                });
            }
        );
    })

    const metadata = {
      contentType: `image/${imgThumb.name.split('.').pop()}`
    }
    const uploadTask = storageRef.child(`images/products/${imgThumb.name}`).put(imgThumb, metadata)
    uploadTask.on('state_changed', (snapshot) => {

    }, (err) => {

    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        db.collection("Products").doc(productID).update({
          img: downloadURL
        }).then(() => {
          console.log("Update img thumb success")
        })
      })
    })
  }






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



  const handleDeleteProduct = (productID) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <Button onClick={onClose}>No</Button>
            <Button
              onClick={() => {
                console.log(productID)
                db.collection("Products").doc(productID).delete().then(()=>{
                  const productListAfterDelete = productList.filter((product) => product.id !== productID)
                  setProductList(productListAfterDelete)
                })

                onClose();
                alert.success("Delete success", {
                  timeout: 2000,
                })
              }}
            >
              Yes, Delete it!
            </Button>
          </div>
        );
      }
    });
    console.log(productID)
  }

  const handleEditProduct = () => {

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
                              onClick={() => handleDeleteProduct(product.id)}
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
              <Row form>
                <FormGroup>
                  <Label>Specification:</Label>
                </FormGroup>
              </Row>
              <Row form>
                <Col xs={6}>
                  <FormGroup>
                    <Label>Brand:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, brand: event.target.value})} />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label>Design:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, design: event.target.value})} />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col xs={6}>
                  <FormGroup>
                    <Label>Ram:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, Ram: event.target.value})} />
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label>CPU:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, cpu: event.target.value})} />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col xs={4}>
                  <FormGroup>
                    <Label>Storage:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, storage: event.target.value})} />
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label>Size:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, size: event.target.value})} />
                  </FormGroup>
                </Col>
                <Col xs={4}>
                  <FormGroup>
                    <Label>Guarantee:</Label>
                    <Input type="textarea" onChange={event => setSpecification({...specification, guarantee: event.target.value})} />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label>Detail:</Label>
                <Input  type="textarea" onChange={event => setProduct({...product,detail: event.target.value})}/>
              </FormGroup>
              <FormGroup>
                <Label>Upload Images:</Label>
                <Input type="file"
                  name="listFileImages"
                  onChange = {event => setListFileImages([...listFileImages, ...event.target.files])}
                  multiple={true}
                />
              </FormGroup>
              <FormGroup>
                <Label>Upload Thumbnail:</Label>
                <Input type="file"
                  name="fileImageThumb"
                  onChange = {event => setFileImageThumb([...fileImageThumb, ...event.target.files])}
                />
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
