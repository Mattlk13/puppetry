import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, Input, InputNumber } from "antd";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertNumber extends React.Component {

  static propTypes = {
    record: PropTypes.object.isRequired,
    targets: PropTypes.arrayOf( PropTypes.object ),
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  onSelectAssertion = ( value ) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ operator: value });
  }


  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assert = typeof record.assert === "object" ? record.assert : {},
          operator = assert.operator || "gt",
          value = assert.value || "";
    return (
      <Row gutter={24}>
        <Col span={8} >
          <FormItem label="Result">
            { getFieldDecorator( "assert.assertion", {
              initialValue: "number",
              rules: [{
                required: true
              }]
            })( <Input readOnly /> ) }
          </FormItem>
        </Col>

        <Col span={4} >
          <FormItem label="is">
            { getFieldDecorator( "assert.operator", {
              initialValue: operator,
              rules: [{
                required: true
              }]
            })( <Select >
              <Option value="gt">&gt;</Option>
              <Option value="lt">&lt;</Option>
            </Select> ) }
          </FormItem>
        </Col>

        <Col span={12} >
          <FormItem label="Value">
            { getFieldDecorator( "assert.value", {
              initialValue: value,
              rules: [{
                required: true
              }]
            })( <InputNumber /> )
            }
          </FormItem>
        </Col>

      </Row> );
  }

}
