import React, {Component} from 'react';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Text, TouchableOpacity} from 'react-native';

class DataTable extends Component {
  render() {
    let headerValues = [];
    let dataRows = [];
    if (this.props.headerData.length > 0) {
      this.props.headerData.map(data => {
        headerValues.push(
          <Col>
            <Text>{data}</Text>
          </Col>,
        );
      });
    }
    if (this.props.innerData.length > 0) {
      this.props.innerData.map(data => {
        dataRows.push(
          <Row style={{height: 40, marginTop: 10}}>
            <Col size={4}>
              <Text>{data.expenseName}</Text>
            </Col>
            <Col size={2}>
              <Text>{data.amount}</Text>
            </Col>
            <Col size={1}>
              <TouchableOpacity
                onPress={() =>this.props.viewDetailsHandler(data)}>
                <Text>Edit</Text>
              </TouchableOpacity>
            </Col>
            <Col size={1}>
              
              <TouchableOpacity
                onPress={() =>this.props.deleteDetailsHandler(data)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </Col>
          </Row>,
        );
      });
    }
    return (
      <Grid>
        <Row style={{height: 40, backgroundColor: '#ba9ffc'}}>
          <Col size={4} style={{justifyContent: 'center', marginLeft: 5}}>
            <Text>Expense Name</Text>
          </Col>
          <Col size={2} style={{justifyContent: 'center'}}>
            <Text>Amount</Text>
          </Col>
          <Col size={1}>
            <Text />
          </Col>
          <Col size={1}>
            <Text />
          </Col>
        </Row>
        {dataRows}
      </Grid>
    );
  }
}

export default DataTable;
