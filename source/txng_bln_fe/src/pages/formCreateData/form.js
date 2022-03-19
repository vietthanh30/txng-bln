import React from 'react';
import { Form, FormGroup, Label, Input, Row, Col, Button } from 'reactstrap';
import { withFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
const FormCreateData = props => {
  return (
    <Form>
      <Row>
        <Col>
          <FormGroup>
            <Label for="exampleEmail">
              Id <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="id"
              id="id"
              disabled
              value={props.values.id}
            />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="exampleEmail">
              Title<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Input title here"
              value={props.values.title}
              onChange={props.handleChange}
            />
            <p className="text-danger">{props.errors.title}</p>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup>
            <Label for="exampleEmail">
              Date<span className="text-danger">*</span>
            </Label>
            <Input
              type="date"
              name="date"
              id="date"
              value={props.values.date}
              onChange={props.handleChange}
            />
            <p className="text-danger">{props.errors.date}</p>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="exampleEmail">
              Author<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              name="author"
              id="author"
              value={props.values.author}
              onChange={props.handleChange}
              placeholder="Input author"
            />
            <p className="text-danger">{props.errors.author}</p>
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label for="exampleEmail">
          Description<span className="text-danger">*</span>
        </Label>
        <Input
          type="textarea"
          name="description"
          id="description"
          placeholder="Input description"
          value={props.values.description}
          onChange={props.handleChange}
        />
        <p className="text-danger">{props.errors.description}</p>
      </FormGroup>
      <FormGroup>
        <Row>
          <div className="float-right col-md-6">
            <Button
              className=" mr-2"
              disabled={!props.dirty || !props.isValid}
              onClick={() => props.onHandelSubmitData(props.values)}
            >
              Submit
            </Button>
            <Button onClick={() => props.onHandelCloseModal()}>Cancel</Button>
          </div>
        </Row>
      </FormGroup>
    </Form>
  );
};

export default withFormik({
  mapPropsToValues() {
    // Init form field
    return {
      id: 'a' + Math.floor(Math.random() * 1000000000),
      date: moment().format('YYYY-MM-DD'),
      description: '',
      title: '',
      author: '',
    };
  },
  validationSchema: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    date: Yup.string().required('Date is required'),
    author: Yup.string().required('Author is required'),
    description: Yup.string().required('Description is required'),
  }),
})(FormCreateData);
