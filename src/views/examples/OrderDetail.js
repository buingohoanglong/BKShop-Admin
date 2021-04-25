import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Headers/Header';
import { useRouteMatch } from 'react-router';
import { Button, Card, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import { useEffect } from 'react';
import db from 'firebase/firebase.config';
import { useState } from 'react';
import { firebase } from 'firebase/firebase.config'

OrderDetail.propTypes = {

};

function OrderDetail(props) {
    const match = useRouteMatch()
    const [order, setOrder] = useState(null)

    useEffect(() => {
        const orderid = match.params.id
        db.collection('Orders').doc(orderid).get().then((orderDoc) => {
            const { items, userid, orderTime, deliverTime, status, address, phone, receiver } = orderDoc.data()

            const itemsPromise = items.map((item) => {
                // get item title, image
                return db.collection('Products').doc(item.productid).get().then((productDoc) => (
                    {
                        title: productDoc.data().title,
                        img: productDoc.data().img,
                        price: item.price,
                        quantity: item.quantity,
                        productid: productDoc.id,
                        totalQuantity: productDoc.data().quantity,
                        sales: productDoc.data().sales
                    }
                )).catch((error) => {
                    console.log("Get item error: ", error)
                })
            })

            // set order
            Promise.all(itemsPromise).then((newItems) => {
                // get user
                db.collection('Users').doc(userid).get().then((userDoc) => {
                    const newOrder = {
                        // order info
                        orderid: orderDoc.id,
                        orderTime: orderTime,
                        deliverTime: deliverTime,
                        status: status,
                        items: [...newItems],
                        // receiver info
                        receiver: receiver,
                        receiverAddress: address,
                        receiverPhone: phone,
                        // orderer info
                        orderer: userDoc.data().displayName,
                        ordererEmail: userDoc.data().email,
                        ordererPhone: userDoc.data().phone,
                    }
                    console.log("Order: ", newOrder)
                    setOrder(newOrder)
                }).catch((error) => {
                    console.log('Get user error: ', error)
                })
            }).catch((error) => {
                console.log("Get item list error", error)
            })
        }).catch((error) => {
            console.log('Load order error: ', error)
        })

    }, [])

    const [modal, setModal] = useState(false)

    const toggle = () => setModal(!modal)


    const statusColor = (status) => {
        if (status.toLowerCase() === 'pending') return 'red'
        else if (status.toLowerCase() === 'processing') return 'orange'
        else if (status.toLowerCase() === 'delivered') return 'green'
        else if (status.toLowerCase() === 'cancelled') return 'gray'
    }

    const handleFinish = (e) => {
        e.preventDefault()
        db.collection('Orders').doc(order.orderid).update({ status: 'delivered' })
            .then(() => {
                order.items.forEach((item) => {
                    db.collection('Products').doc(item.productid).update({
                        sales: (item.sales ? item.sales : 0) + item.quantity
                    }).then(() => {
                        console.log("Increment sales success")
                    }).catch((error) => {
                        console.log("Increment slaes error: ", error)
                    })
                })
                console.log("Submit success")
            }).catch((error) => {
                console.log("Submmit Error: ", error)
            }).finally(() => {
                toggle()
            })
    }

    const handleConfirm = (e) => {
        e.preventDefault()
        db.collection('Orders').doc(order.orderid).update({ status: 'processing' })
            .then(() => {
                order.items.forEach((item) => {
                    db.collection('Products').doc(item.productid).update({
                        quantity: item.totalQuantity - item.quantity
                    }).then(() => {
                        console.log("Decrement quantity success")
                    }).catch((error) => {
                        console.log("Decrement quantity error", error)
                    })
                })
                console.log("Submit success")
            }).catch((error) => {
                console.log("Submmit Error: ", error)
            }).finally(() => {
                toggle()
            })
    }

    return (
        <div className='order-detail'>
            <Header />
            <Container className='mt--7' fluid>
                <Row>
                    <Col>
                        <Card className='shadow'>
                            {order === null
                                ? <Spinner color='primary' />
                                : <Container fluid >
                                    <Row className='my-3'>
                                        <Col>
                                            <div><b>Billing Address:</b></div>
                                            <div>{order.orderer}</div>
                                            <div>{order.ordererEmail}</div>
                                            <div>{order.ordererPhone}</div>
                                        </Col>
                                        <Col>
                                            <div><b>Shipping Address:</b></div>
                                            <div>{order.receiver}</div>
                                            <div>{order.receiverAddress}</div>
                                            <div>{order.receiverPhone}</div>
                                        </Col>
                                    </Row>
                                    <Row className='my-3 py-2' style={{ borderBottom: '1px solid black' }}>
                                        <Col lg='7'>
                                            <div><b>Order: </b>{order.orderid}</div>
                                            <div>Placed on {order.orderTime}</div>
                                        </Col>
                                        <Col lg='2'>
                                            <div><b>Total</b></div>
                                            <div>
                                                {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}$
                                            </div>
                                        </Col>
                                        <Col lg='2'>
                                            <div><b>Status</b></div>
                                            <div style={{ color: `${statusColor(order.status)}` }}>{order.status}</div>
                                        </Col>
                                        <Col lg='1'>
                                            <div></div>
                                            {(order.status === 'pending' || order.status === 'processing') &&
                                                <Button color='primary' onClick={toggle}>{order.status === 'pending' ? 'Confirm' : 'Finish'}</Button>
                                            }
                                            <Modal isOpen={modal} toggle={toggle}>
                                                <ModalHeader toggle={toggle}>
                                                    <div style={{ color: 'red', fontSize: '2em', fontWeight: '700' }}>Nonresetable operation !</div>
                                                </ModalHeader>
                                                <ModalBody>
                                                    This action will change order <b>STATUS</b> to <b>{(order.status === 'pending' ? 'processing' : 'delivered').toUpperCase()}</b>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button color="primary" onClick={order.status === 'pending' ? handleConfirm : handleFinish}>Continue</Button>{' '}
                                                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </Col>
                                    </Row>

                                    {order.items.map((item) => (
                                        <Row key={item.productid} className='my-4'>
                                            <Col lg='2' className='px-1'>
                                                <img src={item.img} alt={item.title} style={{ maxWidth: '150px' }} />
                                            </Col>
                                            <Col lg='5' className='px-1'>
                                                <div>{item.title}</div>
                                                <div>ID: {item.productid}</div>
                                                <div>Quantity: {item.quantity}</div>
                                            </Col>
                                            <Col lg='2' className='px-1'>
                                                <div>{item.price}$</div>
                                            </Col>
                                        </Row>
                                    ))}
                                </Container>
                            }

                        </Card>
                    </Col>
                </Row>

            </Container>

        </div >
    );
}

export default OrderDetail;