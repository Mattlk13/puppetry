import React from "react";
import { Table, Icon } from "antd";
import AbstractEditableTable from "component/AppLayout/Main/AbstractEditableTable";
//import { CommandTable } from "./TestTable/CommandTable";
import { EditableCell } from "component/AppLayout/Main/EditableCell";
import ErrorBoundary from "component/ErrorBoundary";
import { connectDnD } from "component/AppLayout/Main/DragableRow";

const recordPrefIcon = <Icon type="bars" title="Test" />;

@connectDnD
export class TestTable extends AbstractEditableTable {

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Test",
        dataIndex: "title",

        render: ( text, record ) => (
          <EditableCell
            prefixIcon={ recordPrefIcon }
            onSubmit={ this.onSubmit }
            className="input--title"
            record={ record }
            dataIndex="title"
            placeholder="Enter a test name"
            liftFormStateUp={ this.liftFormStateUp }
            updateRecord={ this.updateRecord }
          />
        )
      },
      this.getActionColumn()
    ];

  }

  fields = [ "title" ];

  model = "Stest";

  onExpand = ( isExpanded, record ) => {
    const expanded = { ...this.props.expanded };
    expanded[ record.groupId ].tests[ record.id ] = {
      key: record.key,
      value: isExpanded
    };
    this.props.action.setProject({
      groups: expanded
    });
  }

  renderExpandedTable = ( test ) => {
    const commands = test.commands
            ? Object.values( test.commands )
              .map( record => ({ ...record, entity: "command" }) )
            : [],
          targets = this.props.targets;
      return <div> commands </div>;

  }

  selectExpanded() {
    const { groupId, expanded } = this.props;
    if ( !expanded.hasOwnProperty( groupId ) ) {
      return [];
    }
    return Object.values( expanded[ groupId ].tests )
      .filter( item => Boolean( item.value ) )
      .map( item => item.key );
  }

  onRowClassName = ( record ) => {
    return `model--test${ record.disabled ? " row-disabled" : "" } ` + this.buildRowClassName( record );
  }

  render() {
    const { tests } = this.props,
          expanded = this.selectExpanded();
    return (
      <ErrorBoundary>
        <Table
          className="draggable-table"
          id="cSnippetTestTable"
          components={this.components}
          onRow={this.onRow}
          rowClassName={ this.onRowClassName }
          expandedRowRender={ this.renderExpandedTable }
          defaultExpandedRowKeys={ expanded }
          showHeader={ false }
          dataSource={ tests }
          columns={ this.columns }
          onExpand={ this.onExpand }
          pagination={ false }

        />
      </ErrorBoundary>
    );
  }
}