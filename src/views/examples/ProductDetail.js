import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Headers/Header';
import { useRouteMatch } from 'react-router';
import { Button, Card, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Input, Label, Form, Row, Spinner, Media } from 'reactstrap';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import db, { firebase, storage } from "firebase/firebase.config";

ProductDetail.propTypes = {

};

function ProductDetail(props) {
    const match = useRouteMatch()

    const history = useHistory();

    const [product, setProduct] = useState({})

    const [specification, setSpecification] = useState({})
  
    const [listFileImages, setListFileImages] = useState([])
  
    const [fileImageThumb, setFileImageThumb] = useState([])
    
    const storageRef = storage.ref()
    
    const alert = useAlert()

    
    useEffect (async () => {
        const productId = match.params.id

        const fetchProduct = async () => {
            const productRef = db.collection("Products").doc(productId)
            const snapshot = await productRef.get()

            setProduct(snapshot.data())
            setSpecification(snapshot.data().specification)
            console.log(product.specification)
            console.log(specification)
          }
      
        fetchProduct()

    }, [])



    const getFileName = (fileName, productID) => {
        return fileName.split('.')[0] + productID + (new Date(Date.now()).getTime()) + '.' + fileName.split('.').pop()
      }
    
    
    
    const uploadFiles = (filesUpload, productID) => {
        const imgList = filesUpload.slice(0, filesUpload.length - 1)
        const imgThumb = filesUpload[filesUpload.length - 1]
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
                    console.log("Update image list successfully")
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
                console.log("Update img thumb successfully")
            })
            })
        })
    }

      

    const handleSaveEditProduct = async () => {
        db.collection("Products").doc(product.id).update(product)
        .then(() => {
            if (fileImageThumb.length > 0 && listFileImages.length > 0) {
            const filesUpload = listFileImages.map((file) => (
                new File([file], getFileName(file.name, product.id))
            ))
            filesUpload.push(new File([fileImageThumb[0]], getFileName(fileImageThumb[0].name, product.id)))

            uploadFiles(filesUpload, product.id)

            }

            // console.log(filesUpload)

            // db.collection("Products").doc(product.id).update({ id: product.id }, { merge: true }).then(() => {
            //     alert.success("Edit product successfully")
            // })
        }, (err) => {
            alert.error("Some error here")
        }).finally(() => {
            setFileImageThumb([])
            setListFileImages([])
            alert.success("Edit product successfully")
        })
    }


    return (
        <div className='product-detail'>
            <Header />
            <Container className='mt--7' fluid>
                <Row>
                    <Col>
                        <Card className='shadow'>
                            {product === null
                                ? <Spinner color='primary' />
                                : <Container fluid >
                                    <Form>
                                        <br></br>
                                        <div><h1>Edit Details</h1></div>
                                        <FormGroup>
                                            <Label>Product's name:</Label>
                                            <Input 
                                                type="text" 
                                                value={product.title}
                                                onChange={event => setProduct({ ...product, title: event.target.value })} />                                
                                        </FormGroup>

                                        <Row className='my-3'>
                                            <Col> <img style={{height: "150px"}} alt='Loading image...' src={product.img} /> </Col>
                                            <Col lg='6'>
                                                <FormGroup>
                                                    <Label>Upload Images:</Label>
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
                                            </Col>
                                        </Row>
                                   
                                        <Row form>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>Price:</Label>
                                                <Input 
                                                    type="number" 
                                                    value={product.price}
                                                    onChange={event => setProduct({ ...product, price: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>Quantity:</Label>
                                                <Input 
                                                    type="number" 
                                                    value={product.quantity}
                                                    onChange={event => setProduct({ ...product, quantity: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className='my-3 py-2' style={{ borderBottom: '1px solid black' }}>
                                            <h2>Specification:</h2>
                                        </Row>
                                        
                                        <Row form>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>Brand:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.brand}
                                                    onChange={event => setSpecification({ ...specification, brand: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>Design:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.design}
                                                    onChange={event => setSpecification({ ...specification, design: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row form>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>Ram:</Label>
                                                <Input 
                                                    type="textarea"
                                                    value={specification.Ram}
                                                    onChange={event => setSpecification({ ...specification, Ram: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={6}>
                                                <FormGroup>
                                                <Label>CPU:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.cpu}
                                                    onChange={event => setSpecification({ ...specification, cpu: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row form>
                                            <Col xs={4}>
                                                <FormGroup>
                                                <Label>Storage:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.storage}
                                                    onChange={event => setSpecification({ ...specification, storage: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={4}>
                                                <FormGroup>
                                                <Label>Size:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.size}
                                                    onChange={event => setSpecification({ ...specification, size: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={4}>
                                                <FormGroup>
                                                <Label>Guarantee:</Label>
                                                <Input 
                                                    type="textarea" 
                                                    value={specification.guarantee}
                                                    onChange={event => setSpecification({ ...specification, guarantee: event.target.value })} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row className='my-3 py-2' style={{ borderBottom: '1px solid black' }}>
                                            <h2>Describe detail:</h2>
                                        </Row>

                                        <FormGroup>
                                            <Input 
                                                type="textarea" 
                                                value={product.detail}
                                                onChange={event => setProduct({ ...product, detail: event.target.value })} />
                                        </FormGroup>

                                        <div className="text-center">
                                            <Button color="primary" onClick={handleSaveEditProduct}>Save</Button>{' '}
                                            <Button color="secondary" onClick={() => history.goBack()}>Cancel</Button>
                                        </div><br></br>
                                    </Form>
                                </Container>
                            }

                        </Card>
                    </Col>
                </Row>

            </Container>

        </div >
    );
}

export default ProductDetail;