import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Headers/Header';
import { useRouteMatch } from 'react-router';
import { Card, Col, Container, Row, Spinner } from 'reactstrap';
import { useEffect } from 'react';
import db from 'firebase/firebase.config';
import { useState } from 'react';

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


    const statusColor = (status) => {
        if (status.toLowerCase() === 'pending') return 'red'
        else if (status.toLowerCase() === 'processing') return 'orange'
        else if (status.toLowerCase() === 'delivered') return 'green'
        else if (status.toLowerCase() === 'cancelled') return 'gray'
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
                                        <Col lg='9'>
                                            <div><b>Order: </b>{order.orderid}</div>
                                            <div>Placed on {order.orderTime}</div>
                                        </Col>
                                        <Col lg='1'>
                                            <div><b>Total</b></div>
                                            <div>
                                                {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}$
                                            </div>
                                        </Col>
                                        <Col lg='2'>
                                            <div><b>Status</b></div>
                                            <div style={{ color: `${statusColor(order.status)}` }}>{order.status}</div>
                                        </Col>
                                    </Row>

                                    {order.items.map((item) => (
                                        <Row key={item.productid} className='my-4'>
                                            <Col lg='2' className='px-1'>
                                                <img src={item.img} alt={item.title} style={{ maxWidth: '150px' }} />
                                            </Col>
                                            <Col lg='7' className='px-1'>
                                                <div>{item.title}</div>
                                                <div>ID: {item.productid}</div>
                                                <div>Quantity: {item.quantity}</div>
                                            </Col>
                                            <Col lg='1' className='px-1'>
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