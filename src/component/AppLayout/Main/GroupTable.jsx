import React from "react";
import { Table, Icon, Button } from "antd";
import AbstractEditableTable from "./AbstractEditableTable";
import { connectDnD } from "./DragableRow";
import ErrorBoundary from "component/ErrorBoundary";
import { TestTable } from "./GroupTable/TestTable";
import { EditableCell } from "./EditableCell";
import { ipcRenderer } from "electron";
import { E_DELEGATE_RECORDER_SESSION, E_OPEN_RECORDER_WINDOW } from "constant";

const recordPrefIcon = <Icon type="idcard" title="Group" />;

@connectDnD
export class GroupTable extends AbstractEditableTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Group",
        dataIndex: "title",
        render: ( text, record ) => {
          const ref = this.registerRef( record.id, "title" );
          return (
            <EditableCell
              ref={ ref }
              prefixIcon={ recordPrefIcon }
              record={ record }
              onSubmit={ this.onSubmit }
              className="input--title"
              dataIndex="title"
              placeholder="Enter a group name"
              model={ this.model }
              updateRecord={ this.updateRecord }
            />
          );
        }
      },
      this.getActionColumn()
    ];

  }

  fields = [ "title" ];

  model = "Group";

  componentDidMount() {
    ipcRenderer.removeAllListeners( E_DELEGATE_RECORDER_SESSION );
    ipcRenderer.on( E_DELEGATE_RECORDER_SESSION, ( ev, data ) => {
      this.props.action.createSuiteByRecording( data );
    });
  }

  onClickRecord = ( e ) => {
    e.preventDefault();
    ipcRenderer.send( E_OPEN_RECORDER_WINDOW );
  }

  onExpand = ( isExpanded, record ) => {
    const expanded = { ...this.props.expanded };
    expanded[ record.id ] = {
      key: record.key,
      value: isExpanded,
      tests: {}
    };
    this.props.action.setProject({
      groups: expanded
    });
  }

  renderExpandedTable = ( group ) => {
    const tests = this.props.selector.getTestDataTable( group ),
          targets = Object.values( this.props.targets );
    return ( <TestTable
      expanded={ this.props.expanded }
      targets={ targets }
      tests={ tests }
      groupId={ group.id }
      selector={ this.props.selector }
      action={ this.props.action } /> );
  }

  onRowClassName = ( record ) => {
    return `model--group${ record.disabled ? " row-disabled" : "" } ` + this.buildRowClassName( record );
  }

  shouldComponentUpdate( nextProps ) {
    if ( this.props.groups !== nextProps.groups
      || this.props.expanded !== nextProps.expanded
      || this.props.targets !== nextProps.targets ) {
      return true;
    }
    return false;
  }

  render() {
    const groups = this.props.groups,
          expanded = Object.values( this.props.expanded )
            .filter( item => Boolean( item.value ) )
            .map( item => item.key );

    return (
      <div className="box-margin-vertical group-table">
        <ErrorBoundary>
          <Table
            id="cGroupTable"
            className="draggable-table"
            components={this.components}
            onRow={this.onRow}
            rowClassName={ this.onRowClassName }
            showHeader={false}
            defaultExpandedRowKeys={ expanded }
            dataSource={ groups }
            columns={this.columns}
            pagination={false}
            onExpand={this.onExpand}
            expandedRowRender={ this.renderExpandedTable }
            footer={() => ( <div className="ant-table-footer__toolbar">
              <Button
                icon="experiment" id="cGroupTableRecordBtn"
                onClick={ this.onClickRecord }>Record</Button>
            </div> )}
          />
        </ErrorBoundary>
      </div>
    );
  }
}