import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useState } from 'react';

ChangeStatusModal.propTypes = {

};

function ChangeStatusModal(props) {
    const { orderid, orderstatus } = props

    const [modal, setModal] = useState(false);

    const [status, setStatus] = useState(orderstatus)

    const toggle = () => setModal(!modal);

    const handleChangeStatus = (e) => {
        e.preventDefault()
        console.log(e.target.value)
        setStatus(e.target.value)
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
                        <FormGroup className='row'>
                            <Label className='col'>
                                <Input type="radio" name="status" value='pending' onChange={handleChangeStatus} />{' '}
                                pending
                            </Label>
                            <Label className='col'>
                                <Input type="radio" name="status" value='processing' onChange={handleChangeStatus} />{' '}
                                processing
                            </Label>
                            <Label className='col'>
                                <Input type="radio" name="status" value='delivered' onChange={handleChangeStatus} />{' '}
                                delivered
                            </Label>
                            <Label className='col'>
                                <Input type="radio" name="status" value='cancelled' onChange={handleChangeStatus} />{' '}
                                cancelled
                            </Label>
                        </FormGroup>
                        {/* <FormGroup className='col' check>
                            <Label>
                                <Input type="radio" name="status" value='processing' />{' '}
                                processing
                            </Label>
                        </FormGroup>
                        <FormGroup className='col' check>
                            <Label>
                                <Input type="radio" name="status" value='delivered' />{' '}
                                delivered
                            </Label>
                        </FormGroup>
                        <FormGroup className='col' check>
                            <Label>
                                <Input type="radio" name="status" value='cancelled' />{' '}
                                cancelled
                            </Label>
                        </FormGroup> */}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Submit</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ChangeStatusModal;