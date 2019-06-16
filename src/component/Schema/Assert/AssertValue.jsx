import React from "react";
import PropTypes from "prop-types";
import { Form,  Row, Col, Select, Input, InputNumber, Checkbox } from "antd";
import If from "component/Global/If";
import { getAssertion } from "./helpers";

const Option = Select.Option,
      FormItem = Form.Item;

export class AssertValue extends React.Component {

  state = {
    assertion: "",
    type: ""
  }

  static propTypes = {
    record: PropTypes.object.isRequired,
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired
    })
  }

  onSelectAssertion = ( value ) => {
    this.setState({
      assertion: value
    });
  }

  onSelectType = ( value ) => {
    this.setState({
      type: value
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form,
          { record } = this.props,
          assertion = this.state.assertion || getAssertion( record ).assertion || "equals",
          type = this.state.type || record.assert.type || "string",
          value = record.assert.value || "";
    return (
      <Row gutter={24}>

        <Col span={8} >
          <FormItem label="Result">
            { getFieldDecorator( "assert.assertion", {
              initialValue: assertion,
              rules: [{
                required: true
              }]
            })( <Select
              onSelect={ this.onSelectAssertion }>
              <Option value="equals">equals</Option>
              <Option value="contains">contains</Option>
            </Select> ) }
          </FormItem>
        </Col>

        <If exp={ assertion === "equals" }>
          <Col span={4} >
            <FormItem label="type">
              { getFieldDecorator( "assert.type", {
                initialValue: type,
                rules: [{
                  required: true
                }]
              })( <Select onSelect={ this.onSelectType }>
                <Option value="string">string</Option>
                <Option value="number">number</Option>
                <Option value="boolean">boolean</Option>
              </Select> ) }
            </FormItem>
          </Col>
        </If>

        <If exp={ assertion === "contains" }>
          <Col span={12} >
            <FormItem label="Value">
              { getFieldDecorator( "assert.value", {
                initialValue: value,
                rules: [{
                  required: true
                }]
              })(
                <Input />
              ) }
            </FormItem>
          </Col>
        </If>

        <If exp={ ( assertion === "equals" && !!type ) }>
          <Col span={12} >
            <If exp={ type === "boolean" }>
              <FormItem label="Value">
                { getFieldDecorator( "assert.value", {
                  initialValue: true,
                  valuePropName: ( value ? "checked" : "data-ok" )
                })(
                  <Checkbox>is true</Checkbox>
                ) }
              </FormItem>
            </If>
            <If exp={ type !== "boolean" }>
              <FormItem label="Value">
                { getFieldDecorator( "assert.value", {
                  initialValue: value
                })(
                  this.renderValueInput( type )
                ) }
              </FormItem>
            </If>
          </Col>
        </If>

      </Row> );
  }

  renderValueInput( type ) {
    switch ( true ) {
    case type === "number":
      return <InputNumber />;
    default:
      return <Input />;
    }
  }

}
