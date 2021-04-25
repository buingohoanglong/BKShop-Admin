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
import { useHistory, useRouteMatch } from "react-router";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Form, Col } from 'reactstrap';
import { useAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './Product.css'
import Avatar from 'react-avatar';

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
  List
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useEffect } from "react";
import db, { firebase, storage } from "firebase/firebase.config";
import { useState, useSelector } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { merge } from "jquery";
import Rating from "components/Rating/Rating";


const Tables = () => {

  const match = useRouteMatch()

  const [productList, setProductList] = useState([])

  const [modalAddProduct, setModalAddProduct] = useState(false)

  const toggleModalAddProduct = () => setModalAddProduct(!modalAddProduct)

  const [product, setProduct] = useState({})

  const [specification, setSpecification] = useState({})

  const [listFileImages, setListFileImages] = useState([])

  const [listFileImagesBeforeUpdate, setListFIleImagesBeforeUpdate] = useState([])

  const [fileImageThumb, setFileImageThumb] = useState([])

  const [modalEditProduct, setModalEditProduct] = useState(false)

  const toggleModalEditProduct = () => {
    setModalEditProduct(!modalEditProduct)
    setProduct({})
    setProduct({})
    // console.log(doc.data())
    setSpecification({})
    // // console.log(specification)
    setFileImageThumb([])
    // console.log(doc.data().imgList)
    setListFileImages([])
    // console.log(listFileImages)
    setListFIleImagesBeforeUpdate([])
  }
  // const user = useSelector(state => state.user)

  const storageRef = storage.ref()

  const alert = useAlert()


  // const filesUpload = files.map((file) => (
  //   new File([file], getFileName(file.name))
  // ))


  const handleAddProduct = async () => {
    // console.log(product)
    const newProduct = { ...product, specification: {} }

    // newProduct.detail.push(product.detail ? product.detail: "")
    newProduct.detail = product.detail ? product.detail : ""
    newProduct.specification = specification
    newProduct.img = ""
    newProduct.imgList = []
    newProduct.rating = 0
    newProduct.sales = 0
    console.log(newProduct)

    console.log(listFileImages)
    console.log(fileImageThumb)

    db.collection("Products").add(newProduct)
      .then((res) => {
        if (listFileImages.length > 0) {
          const filesUpload = listFileImages.map((file) => (
            new File([file], getFileName(file.name, res.id))
          ))
          uploadFilesImgList(filesUpload, res.id)
        }

        if (fileImageThumb.length > 0) {
          const fileUpload = new File([fileImageThumb[0]], getFileName(fileImageThumb[0].name, res.id))
          uploadFilesImgThumb(fileUpload, res.id)
        }
        db.collection("Products").doc(res.id).set({ id: res.id }, { merge: true })
      }, (err) => {
        alert.error("Some error here")
      }).finally(() => {
        setProduct({})
        setProduct({})
        // console.log(doc.data())
        setSpecification({})
        // // console.log(specification)
        setFileImageThumb([])
        // console.log(doc.data().imgList)
        setListFileImages([])
        // console.log(listFileImages)
        setListFIleImagesBeforeUpdate([])

        alert.success("Add product success")
      })
    setModalAddProduct(!modalAddProduct)
  }



  const handleDeleteFileWhenAdd = (index) => {
    setListFileImages(listFileImages.filter((file, idx) => index !== idx))
  }

  const getFileName = (fileName, productID) => {
    return fileName.split('.')[0] + productID + (new Date(Date.now()).getTime()) + '.' + fileName.split('.').pop()
  }


  const uploadFilesImgList = (filesUpload, productID) => {
    // const imgList = filesUpload.slice(0,filesUpload.length-1)
    filesUpload.forEach((file) => {
      const metadata = {
        contentType: `image/${file.name.split('.').pop()}`
      }
      const uploadTask = storageRef.child(`images/products/${file.name}`).put(file, metadata)
      uploadTask.on('state_changed',
<<<<<<< HEAD
          (snapshot) => {
          },
          (error) => {
              // Handle unsuccessful uploads
              console.log(error)
          },
          () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log(downloadURL)
                  
                  db.collection("Products").doc(productID).set({
                    imgList: firebase.firestore.FieldValue.arrayUnion(downloadURL),
                  },{merge: true}).then(() => {
                    console.log("Update image list success")
                  })
              });
          }
=======
        (snapshot) => {
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL)

            db.collection("Products").doc(productID).set({
              imgList: firebase.firestore.FieldValue.arrayUnion(downloadURL),
            }, { merge: true }).then(() => {
              console.log("Update image list success")
            })
          });
        }
>>>>>>> 9bfc2f89defab2050ab690ff2fa1be76237028a0
      );
    })


  }


  const uploadFilesImgThumb = (fileUpload, productID) => {

    const metadata = {
      contentType: `image/${fileUpload.name.split('.').pop()}`
    }
    const uploadTask = storageRef.child(`images/products/${fileUpload.name}`).put(fileUpload, metadata)
    uploadTask.on('state_changed', (snapshot) => {

    }, (err) => {

    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        db.collection("Products").doc(productID).set({
          img: downloadURL
        }, { merge: true }).then(() => {
          console.log("Update img thumb success")
        })
      })
    })
  }






  useEffect(() => {
    const fetchProductList = async () => {
      const productRef = db.collection("Products")
      const snapshot = await productRef.get()

      const result = []
      snapshot.forEach(doc => {
        result.push(doc.data())
      });
      // console.log(result)

      setProductList(result)
    }

    fetchProductList()
  }, [])



  const handleDeleteProduct = async (productID) => {

    let statusOfProduct = false
    const listOrders = []
    const orderRef = db.collection("Orders")
    const querySnapshot = await orderRef.get()
    // console.log(querySnapshot)
    querySnapshot.forEach((doc) => {
      // console.log(doc.id , doc.data())
      doc.data().items.forEach((item) => {
        if (item.productid === productID && (doc.data().status.toLowerCase() === "pending" || doc.data().status.toLowerCase() === "processing")) {
          statusOfProduct = true
          listOrders.push(doc.id)
        }
      })
    })
    // console.log(listOrders)



    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>{statusOfProduct ? "The product is in some processing order. Delete it?" : "You want to delete this product?"}</p>
            <Button onClick={onClose}>No</Button>
            <Button
              onClick={() => {
                // console.log(productID)
                db.collection("Products").doc(productID).delete().then(() => {
                  const productListAfterDelete = productList.filter((product) => product.id !== productID)
                  setProductList(productListAfterDelete)
                })

                // listOrders.forEach((orderID)=> {
                //   orderRef.doc(orderID).items().forEach((item) => {

                //   }, (err) => {
                //     console.log(err)
                //   }})
                listOrders.forEach(orderID => {
                  orderRef.doc(orderID).get().then((snapshot) => {
                    const listItemsInOrder = snapshot.data().items
                    const listItemsAfterFilter = listItemsInOrder.filter((item) => item.productid !== productID)
                    if (listItemsAfterFilter.length === 0) {
                      orderRef.doc(orderID).delete().then(() => {
                        console.log("Delete order success")
                      })
                    } else {
                      orderRef.doc(orderID).update({
                        items: listItemsAfterFilter
                      }).then(() => {
                        console.log("Update success")
                      })
                    }

                  })



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
  }

  const handleEditProduct = (productID) => {
    toggleModalEditProduct()
    db.collection("Products")
      .doc(productID)
      .get()
      .then((doc) => {
        // console.log(doc.data())
        setProduct({ ...doc.data() })
        // console.log(doc.data())
        setSpecification({ ...doc.data().specification })
        // // console.log(specification)
        setFileImageThumb([doc.data().img])
        // console.log(doc.data().imgList)
        setListFileImages(doc.data().imgList ? doc.data().imgList : [])
        // console.log(listFileImages)
        setListFIleImagesBeforeUpdate(doc.data().imgList ? doc.data().imgList : [])
      })

  }


  const handleSaveProductAfterEdit = (productID) => {
    const updateProduct = { ...product, specification: specification }
    const listFileImagesAfterFilter = []
    const originalImagesList = []
    listFileImages.forEach((item) => {
      if (typeof (item) !== 'string') {
        listFileImagesAfterFilter.push(item)
      } else {
        originalImagesList.push(item)
      }
    })

    const imgThumbAfterFilter = []
    const originalImgThumb = []
    fileImageThumb.forEach((item) => {
      if (typeof (item) !== 'string') {
        imgThumbAfterFilter.push(item)
      } else {
        originalImgThumb.push(item)
      }
    })

    console.log(fileImageThumb)
    console.log(imgThumbAfterFilter)


    db.collection("Products").doc(productID).set({
      ...updateProduct, imgList: originalImagesList
    }).then(() => {
      alert.success("Edit product success")
    })

    if (listFileImagesAfterFilter.length > 0) {
      const filesUpload = listFileImagesAfterFilter.map((file) => (
        new File([file], getFileName(file.name, productID))
      ))
      uploadFilesImgList(filesUpload, productID)
    }

    if (imgThumbAfterFilter.length > 0) {
      const fileUpload = new File([imgThumbAfterFilter[0]], getFileName(imgThumbAfterFilter[0].name, productID))
      uploadFilesImgThumb(fileUpload, productID)

      if (originalImgThumb[0] !== "") {
        const imageRef = storage.refFromURL(originalImgThumb[0])
        imageRef.delete()
      }
    }

    setProduct({})
    // console.log(doc.data())
    setSpecification({})
    // // console.log(specification)
    setFileImageThumb([])
    // console.log(doc.data().imgList)
    setListFileImages([])
    // console.log(listFileImages)
    setListFIleImagesBeforeUpdate([])


    toggleModalEditProduct()

    // console.log(listFileImagesAfterFilter)

  }


  const handleDeleteFileWhileEdit = (index) => {
    const fileDelete = listFileImages[index]
    // console.log(typeof(fileDelete))
    if (typeof (fileDelete) === 'string') {
      const imageRef = storage.refFromURL(fileDelete)
      imageRef.delete()
    }
    setListFileImages(listFileImages.filter((file, idx) => index !== idx))

    // console.log(fileDelete)

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
                <h3 className="mb-0">Products table</h3>
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
                              {/* <img
                              alt="..."
                              src={product.img}
                            /> */}
                              <Avatar src={product.img} size="40" round={true} />
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
                        <td className="">

                          <span className="">{product.rating}</span>
                          {/* <span className="">{Array(product.rating).fill().map((_, i) => <AiFillStar style={{ cursor: 'pointer' }} size={15} color='red' />)}</span> */}
                          <span className=""><Rating rating={product.rating} /></span>

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
                                onClick={() => handleEditProduct(product.id)}
                              >
                                Edit product
                            </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete product
                            </DropdownItem>

                              <DropdownItem
                                href={`${match.url}/${product.id}`}
                              >
                                Details
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
              <Input type="text" onChange={event => setProduct({ ...product, title: event.target.value })} />
            </FormGroup>
            <Row form>
              <Col xs={6}>
                <FormGroup>
                  <Label>Price:</Label>
                  <Input type="number" onChange={event => setProduct({ ...product, price: event.target.value })} />
                </FormGroup>
              </Col>

              <Col xs={6}>
                <FormGroup>
                  <Label>Quantity:</Label>
                  <Input type="number" onChange={event => setProduct({ ...product, quantity: event.target.value })} />
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
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, brand: event.target.value })} />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>Design:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, design: event.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col xs={6}>
                <FormGroup>
                  <Label>Ram:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, Ram: event.target.value })} />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>CPU:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, cpu: event.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col xs={4}>
                <FormGroup>
                  <Label>Storage:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, storage: event.target.value })} />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Size:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, size: event.target.value })} />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Guarantee:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, guarantee: event.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Detail:</Label>
              <Input type="textarea" onChange={event => setProduct({ ...product, detail: event.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Upload Images:</Label>
              <List type="unstyled">
                {listFileImages.length > 0 && listFileImages.map((file, index) => (
                  <li key={index}>
                    {file.name}{" "}
                    <Button color="danger" size="sm"
                      onClick={() => handleDeleteFileWhenAdd(index)}
                    >X</Button>
                  </li>
                ))}
              </List>
              <Input type="file"
                name="listFileImages"
                onChange={event => setListFileImages([...listFileImages, ...event.target.files])}
                multiple={true}
              />

            </FormGroup>
            <FormGroup>
              <Label>Upload Thumbnail:</Label>

              <Input type="file"
                name="fileImageThumb"
                onChange={event => setFileImageThumb([...fileImageThumb, ...event.target.files])}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddProduct}>Add Product</Button>{' '}
          <Button color="secondary" onClick={toggleModalAddProduct}>Cancel</Button>
        </ModalFooter>
      </Modal>




      <Modal isOpen={modalEditProduct} toggle={toggleModalEditProduct}>
        <ModalHeader toggle={toggleModalEditProduct}>Edit Product</ModalHeader>
        <ModalBody>

          <Form>
            <FormGroup>
              <Label>Title:</Label>
              <Input type="text" onChange={event => setProduct({ ...product, title: event.target.value })} value={product.title ? product.title : ''} />
            </FormGroup>
            <Row form>
              <Col xs={6}>
                <FormGroup>
                  <Label>Price:</Label>
                  <Input type="number" onChange={event => setProduct({ ...product, price: event.target.value })} value={product.price ? product.price : ''} />
                </FormGroup>
              </Col>

              <Col xs={6}>
                <FormGroup>
                  <Label>Quantity:</Label>
                  <Input type="number" onChange={event => setProduct({ ...product, quantity: event.target.value })} value={product.quantity ? product.quantity : ''} />
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
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, brand: event.target.value })} value={specification.brand ? specification.brand : ''} />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>Design:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, design: event.target.value })} value={specification.design ? specification.design : ''} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col xs={6}>
                <FormGroup>
                  <Label>Ram:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, Ram: event.target.value })} value={specification.Ram ? specification.Ram : ''} />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label>CPU:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, cpu: event.target.value })} value={specification.cpu ? specification.cpu : ''} />
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col xs={4}>
                <FormGroup>
                  <Label>Storage:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, storage: event.target.value })} value={specification.storage ? specification.storage : ''} />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Size:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, size: event.target.value })} value={specification.size ? specification.size : ''} />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Guarantee:</Label>
                  <Input type="textarea" onChange={event => setSpecification({ ...specification, guarantee: event.target.value })} value={specification.guarantee ? specification.guarantee : ''} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Detail:</Label>
              <Input type="textarea" onChange={event => setProduct({ ...product, detail: event.target.value })} value={product.detail ? product.detail : ''} />
            </FormGroup>
            <FormGroup>
              <Label>Upload Images:</Label>
              <List type="unstyled">
                {listFileImages.length > 0 && listFileImages.map((file, index) => (
                  <li key={index} className="mt-1"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {file.name ? file.name : file}{" "}
                    <Button color="danger" size="sm"
                      onClick={() => handleDeleteFileWhileEdit(index)}
                    >X</Button>
                  </li>
                ))}
              </List>
              <Input type="file"
                name="listFileImages"
                onChange={
                  event => setListFileImages([...listFileImages, ...event.target.files])
                }
                multiple={true}

              />

            </FormGroup>
            <FormGroup>
              <Label>Upload Thumbnail:</Label>

              <Input type="file"
                name="fileImageThumb"
                onChange={event => setFileImageThumb([...fileImageThumb, ...event.target.files])}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleSaveProductAfterEdit(product.id)}>Edit Product</Button>{' '}
          <Button color="secondary" onClick={toggleModalEditProduct}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Tables;
