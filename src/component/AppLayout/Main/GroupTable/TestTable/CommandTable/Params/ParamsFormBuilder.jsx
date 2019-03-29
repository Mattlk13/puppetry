import React from "react";
import PropTypes from "prop-types";
import { ipcRenderer } from "electron";
import { Tabs, Form, Input, InputNumber, Checkbox, Row, Col, Select, Button, Collapse } from "antd";
import Tooltip from "component/Global/Tooltip";
import {
  FILEPATH, INPUT, INPUT_NUMBER, CHECKBOX, SELECT, TEXTAREA, OPTGROUP_SELECT
  } from "component/Schema/constants";
import { E_BROWSE_FILE, E_FILE_SELECTED } from "constant";
const FormItem = Form.Item,
      { Option, OptGroup } = Select,
      TabPane = Tabs.TabPane,
      Panel = Collapse.Panel,

      getLabel = ( desc, tooltip ) => (
        <span>
          { desc }
          <Tooltip
            title={ tooltip }
            icon="question-circle"
          />
        </span>
      );

export class ParamsFormBuilder extends React.Component {

  static propTypes = {
    form: PropTypes.shape({
      getFieldDecorator: PropTypes.func.isRequired,
      setFieldsValue: PropTypes.func.isRequired
    }),

    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
    schema: PropTypes.any
  }

  onClickSelectFile = ( e, item ) => {
    e.preventDefault();
    this.filepathName = item.name;
    ipcRenderer.send( E_BROWSE_FILE, "" );
  }

  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    ipcRenderer.on( E_FILE_SELECTED, ( ...args ) => {
      const selectedFile = args[ 1 ];
      console.log({selectedFile, name: this.filepathName });
      setFieldsValue({
        [ this.filepathName ]: selectedFile
      });
    });
  }

  onKeyPress = ( e, cb ) => {
    switch ( e.key ){
    case "Enter":
      cb( e );
      return;
    }
  }

  renderControl = ( item ) => {
    const { setFieldsValue } = this.props.form,
          { onSubmit } = this.props,
          onSelect = ( value ) => {
            setFieldsValue({ [ item.name ]: value });
            item.onChange && item.onChange( value, this.props.form );
          };

    switch ( item.control ) {
      case FILEPATH:
        return ( <Input onClick={ this.onClickSelectFile } disabled  /> );
      case INPUT:
        return ( <Input placeholder={ item.placeholder }
          onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
      case INPUT_NUMBER:
        return ( <InputNumber
          onKeyPress={ ( e ) => this.onKeyPress( e, onSubmit ) } /> );
      case TEXTAREA:
        return ( <Input.TextArea
          placeholder={ item.placeholder }
          rows={ 4 } /> );
      case SELECT:
        return ( <Select
          showSearch
          placeholder={ item.placeholder }
          optionFilterProp="children"
          onSelect={ onSelect }
          filterOption={( input, option ) => option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0}
        >
          {
            item.options.map( ( option, inx ) => {
              return typeof option === "string"
                ? ( <Option key={inx} value={ option }>{ option }</Option> )
                : ( <Option key={inx} value={ option.value }>{ option.description }</Option> );
            })

          }
        </Select> );
      case OPTGROUP_SELECT:
        return ( <Select
          placeholder={ item.placeholder }
          onSelect={ onSelect }
        >
          {
              item.groups.map( ( group, inx ) => (<OptGroup label={ group.label } key={ `optg_${ inx }` }>
              {
                group.options.map( ( option, inx ) => {
                  return typeof option === "string"
                    ? ( <Option key={inx} value={ option }>{ option }</Option> )
                    : ( <Option key={inx} value={ option.value }>{ option.description }</Option> );
                  })
              }
              </OptGroup>))
          }
        </Select> );
      case CHECKBOX:
        return ( <Checkbox>
          { item.label }
          { item.tooltip && ( <Tooltip
            title={ item.tooltip }
            icon="question-circle"
          /> )}

        </Checkbox> );
      default:
        return null;
    }
  }

  getInitialValue( item ) {
    const { record } = this.props,
          initialValue = item.control === CHECKBOX ? false : item.initialValue,
          key = item.name.replace( /^params\./, "" );

    return ( ( record.params && record.params.hasOwnProperty( key ) )
      ? record.params[ key ]
      : initialValue );
  }

  renderFormItem = ( item, inx ) => {
    const { getFieldDecorator } = this.props.form,
          labelNode = item.tooltip ? getLabel( item.label, item.tooltip ) : item.label,
          initialValue = this.getInitialValue( item ),
          decoratorOptions =  {
            initialValue,
            rules: item.rules
          };

    if ( item.control === CHECKBOX ) {
      decoratorOptions.valuePropName = ( initialValue ? "checked" : "data-ok" );
      decoratorOptions.initialValue = true;
    }

    return (
      <FormItem
        label={ item.control !== CHECKBOX ? labelNode : "" }
        key={ `item${inx}` }>
        { getFieldDecorator( item.name, decoratorOptions )( this.renderControl( item ) ) }
        { item.description ? <div className="command-opt-description">{ item.description }</div> : "" }
        { item.control === FILEPATH && <Button
        onClick={ ( e ) => this.onClickSelectFile( e, item ) }>Select file</Button>
    }
      </FormItem> );
  }


  // DEPRICATED
  renderTabGroup = ( item, inx ) => {
    return (  <Tabs key={ `tabs${ inx }` } animated={ false }>
      { item.tabs.map(( tab, inx ) => (<TabPane tab={ tab.label } key={ `tab${ inx }` }>
        { tab.items.map( this.renderFormItem ) }
      </TabPane>)) }
    </Tabs>) ;
  }

  // DEPRICATED
  renderFormItemOrTabGroup = ( item, inx ) => {
    return item.type === "tabs"
      ? this.renderTabGroup( item, inx )
      : this.renderFormItem( item, inx );
  }


  renderRow = ( row, inx ) => {

    const rowNode = (
      <Row gutter={24} key={ `row${inx}` } className={ row.inline ? "ant-form-inline edit-command-inline" : null }>
        <Col span={ row.span || 24} >
          { row.items.map( this.renderFormItem ) }
        </Col>
      </Row> );

    if ( row.collapse && row.legend )  {
      return <Collapse key="1">
        <Panel header={ row.legend } key="2">
           { row.description && ( <p>{ row.description }</p> )}
           { rowNode }
        </Panel>
      </Collapse>
    }

    return row.legend ? (
      <fieldset className="command-form__fieldset"  key={ `fs${inx}` }>
        <legend>
          <span>{ row.legend }</span>
          { row.tooltip && ( <Tooltip
            title={ row.tooltip }
            icon="question-circle"
          /> )}
        </legend>
        { row.description && ( <p>{ row.description }</p> )}
        { rowNode }
      </fieldset> ) : rowNode;
  }

  render() {
    const { schema } = this.props;

    return (
      <React.Fragment>
        { schema.params.map( this.renderRow ) }
      </React.Fragment>
    );
  }
}