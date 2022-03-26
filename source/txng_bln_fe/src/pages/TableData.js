import Page from 'components/Page';
import React, { useEffect, useRef, useState } from 'react';
import NotificationSystem from 'react-notification-system';
import { Button, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap';
import { addBlock, getBlocks } from '../services';
import { formatTime, isNullOrEmpty } from '../utils';
import Form from './formCreateData/form';

const tableTypes = ['hover'];

const TableData = props => {
  const [isShowModalCreate, showModalCreate] = useState(false);
  const [tableData, setTableData] = useState([]);
  const myNotification = useRef(null);

  useEffect(async () => {
    getAllBlock();
  }, []);
  const renderRightHeaderComponent = () => {
    return <Button onClick={() => onClickCreateData()}>Thêm mới</Button>;
  };

  async function getAllBlock() {
    const blocks = await getBlocks();

    if (blocks.status !== 5000) {
      setTableData(JSON.parse(blocks.results));
    } else {
      // myNotification.current.addNotification({
      //   message: 'Lỗi trong quá trình lấy dữ liệu',
      //   level: 'error',
      // });
      getAllBlock();
    }
  }

  function onClickCreateData() {
    showModalCreate(true);
  }

  function openModalCreate() {
    showModalCreate(!isShowModalCreate);
  }

  function closeModalCreate() {
    showModalCreate(false);
  }

  function onSubmit(payload) {
    addBlock(payload)
      .then(res => {
        getAllBlock();
        closeModalCreate();
        myNotification.current.addNotification({
          message: 'Thành công!',
          level: 'success',
        });
      })
      .catch(err => {
        myNotification.current.addNotification({
          message: 'Tạo dữ liệu thất bại !',
          level: 'error',
        });
      });
  }

  function renderModalCreate() {
    return (
      <Modal
        isOpen={isShowModalCreate}
        toggle={() => openModalCreate()}
        className={props.className}
        size="lg"
      >
        <ModalHeader primary>Thêm mới dữ liệu</ModalHeader>
        <ModalBody>
          <Form
            onHandelSubmitData={payload => onSubmit(payload)}
            onHandelCloseModal={() => closeModalCreate()}
          />
        </ModalBody>
      </Modal>
    );
  }

  return (
    <Page
      title="Data"
      breadcrumbs={[{ name: 'tables', active: true }]}
      className="TablePage"
      rightHeaderComponent={renderRightHeaderComponent()}
    >
      <>
        {renderModalCreate()}
        <NotificationSystem ref={myNotification} />
        {tableTypes.map((tableType, index) => (
          <Row key={index}>
            <Table {...{ [tableType || 'default']: true }}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Author</th>
                </tr>
              </thead>
              <tbody>
                {!isNullOrEmpty(tableData)
                  ? tableData.map((el, i) => {
                      return (
                        <tr key={i + 'child'}>
                          <th scope="row">
                            {el && el.Record ? el.Record.id : ''}
                          </th>
                          <td>{el && el.Record ? el.Record.title : ''}</td>
                          <td>
                            {el && el.Record ? formatTime(el.Record.date) : ''}
                          </td>
                          <td>
                            {el && el.Record ? el.Record.description : ''}
                          </td>
                          <td>{el && el.Record ? el.Record.author : ''}</td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </Row>
        ))}
      </>
    </Page>
  );
};

export default TableData;
