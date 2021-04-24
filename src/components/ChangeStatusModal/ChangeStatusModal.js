import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useState } from 'react';
import db from 'firebase/firebase.config';

ChangeStatusModal.propTypes = {

};

function ChangeStatusModal(props) {
    const { orderid, orderstatus } = props

    const [modal, setModal] = useState(false)

    const [status, setStatus] = useState(orderstatus)

    const toggle = () => setModal(!modal)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Submit: ", status)
        db.collection('Orders').doc(orderid).update({ status: status })
            .then(() => {
                console.log("Submit success")
            }).catch((error) => {
                console.log("Submmit Error: ", error)
            }).finally(() => {
                toggle()
            })
    }

    return (
        <div className='change-status-modal'>
            <div onClick={toggle}>Change Status</div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    <div>Change status</div>
                    {orderid && <div>Order: {orderid}</div>}
                </ModalHeader>
                <ModalBody>
                    <Form>
                        {/* {console.log("Status: ", status)} */}
                        <FormGroup className='row'>
                            {['processing', 'cancelled'].includes(orderstatus) &&
                                <Label className='col'>
                                    <Input
                                        type="radio"
                                        checked={status === 'pending'}
                                        name="status"
                                        value='pending'
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    {' '}
                                    pending
                                </Label>
                            }
                            {['pending', 'delivered', 'cancelled'].includes(orderstatus) &&
                                <Label className='col'>
                                    <Input
                                        type="radio"
                                        checked={status === 'processing'}
                                        name="status"
                                        value='processing'
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    {' '}
                                    processing
                                </Label>
                            }
                            {['processing', 'cancelled'].includes(orderstatus) &&
                                <Label className='col'>
                                    <Input
                                        type="radio"
                                        checked={status === 'delivered'}
                                        name="status"
                                        value='delivered'
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    {' '}
                                    delivered
                                </Label>
                            }
                            {['pending', 'processing', 'delivered'].includes(orderstatus) &&
                                <Label className='col'>
                                    <Input
                                        type="radio"
                                        checked={status === 'cancelled'}
                                        name="status"
                                        value='cancelled'
                                        onChange={(e) => setStatus(e.target.value)}
                                    />
                                    {' '}
                                    cancelled
                                </Label>
                            }
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit}>Submit</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ChangeStatusModal;