import React from "react";
import { Table, Icon, Button, Divider, Popconfirm } from "antd";
import AbstractDnDTable from "../../AbstractDnDTable";
import { connectDnD } from "../../DragableRow";
import { CommandRowLabel } from "./CommandRowLabel";
import ErrorBoundary from "component/ErrorBoundary";
import { RowDropdown } from "component/AppLayout/Main/RowDropdown";
import { confirmDeleteEntity } from "service/smalltalk";
import { remote } from "electron";
import classNames from "classnames";
import { SNIPPETS_GROUP_ID } from "constant";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as selectors from "selector/selectors";

const { Menu, MenuItem } = remote,
      // Mapping state to the props
      mapStateToProps = ( state ) => ({
        snippets: selectors.getSnippets( state.snippets )
      }),
      // Mapping actions to the props
      mapDispatchToProps = () => ({
      });

@connect( mapStateToProps, mapDispatchToProps )
@connectDnD
export class CommandTable extends AbstractDnDTable {

  state = {
    contextMenuAnchor: null
  }

  constructor( props ) {
    super( props );
    this.columns = [
      {
        title: "Comand",
        dataIndex: "target",

        render: ( text, record ) => ( <CommandRowLabel record={ record } snippets={ props.snippets } /> )
      },
      this.getActionColumn()
    ];

  }

  model = "Command";

  updateSuiteModified() {
    this.props.action.updateSuite({
      modified: true
    });
  }

  onContextMenu = ( e, record  ) => {
    e.preventDefault();
    const menu = new Menu();

    this.setState({ contextMenuAnchor: record.id });
    menu.on( "menu-will-close", () => {
      this.setState({ contextMenuAnchor: null });
    });

    menu.append( new MenuItem({
      label: "Edit",
      click: () => this.onEditCommand( record )
    }) );

    menu.append( new MenuItem(
      record.disabled ? {
        label: "Enable",
        click: () => this.updateRecord({ id: record.id, disabled: false })
      } : {
        label: "Disable",
        click: () => this.updateRecord({ id: record.id, disabled: true })
      }
    ) );

    menu.append( new MenuItem({
      label: "Insert",
      click: () => this.insertRecord( record )
    }) );

    menu.append( new MenuItem({
      label: "Insert Snippet",
      click: () => this.insertRecord({ ...record, isRef: true  })
    }) );

    menu.append( new MenuItem({
      label: "Clone",
      click: () => this.cloneRecord( record )
    }) );

    menu.append( new MenuItem({
      type: "separator"
    }) );

    menu.append( new MenuItem({
      label: "Copy",
      click: () => this.copyClipboard( record )
    }) );


    menu.append( new MenuItem({
      label: "Paste",
      click: () => this.pasteClipboard( record ),
      enabled: this.validClipboard( record )
    }) );

    menu.append( new MenuItem({
      type: "separator"
    }) );

    menu.append( new MenuItem({
      label: "Delete",
      click: async () => {
        await confirmDeleteEntity( "command" ) && this.removeRecord( record.id );
      }
    }) );

    menu.popup({
      x: e.x,
      y: e.y
    });
  }

  updateRecord = ( options ) => {
    const update = this.props.action[ `update${this.model}` ];
    update( this.extendActionOptions( options  ) );
    this.updateSuiteModified();
  }

  removeRecord = ( id ) => {
    const update = this.props.action[ `remove${this.model}` ];
    update( this.extendActionOptions({ id }) );
    this.updateSuiteModified();
  }

  addRecord = () => {
    const update = this.props.action[ `add${this.model}` ];
    update( this.extendActionOptions({ target: "", method: "" }) );
  }


  componentDidUpdate( prevProps ) {
    // Only when we add a new command to the list, so we can edit it in the modal
    if ( prevProps.commands.length !== this.props.commands.length ) {
      const newlyAdded = this.props.commands.find( command => !command.target && !command.method && !command.ref );
      newlyAdded && this.onEditCommand( newlyAdded );
    }
  }

  onEditCommand( record ) {
    const { setApp } = this.props.action;
    if ( record.ref || record.isRef ) {
      setApp({
        snippetModal: {
          isVisible: true,
          record
        }
      });
      return;
    }

    setApp({
      commandModal: {
        isVisible: true,
        record,
        targets: this.props.targets,
        commands: this.props.commands
      }
    });
  }

  toggleEnable( record ) {
    this.updateRecord({ id: record.id, disabled: !record.disabled });
  }

  getActionColumn() {
    return {
      title: "Action",
      dataIndex: "action",
      width: 160,
      className: "table-actions-cell",
      render: ( text, record ) => ( <span className="table-actions" role="status" >
        <a className="link--action"
          tabIndex={-1} role="button"
          onClick={ () => this.onEditCommand( record ) }>Edit</a>

        <Divider type="vertical" />

        <Popconfirm title="Sure to delete?" onConfirm={() => this.removeRecord( record.id )}>
          <a className="link--action" tabIndex={-2} role="button">Delete</a>
        </Popconfirm>

        <Divider type="vertical" />

        <RowDropdown
          record={ record }
          validClipboard={ this.validClipboard }
          isNotTargetTable={ true }
          toggleEnable={ this.toggleEnable }
          insertRecord={ this.insertRecord }
          insertSnippet={ this.insertRecord }
          cloneRecord={ this.cloneRecord }
          copyClipboard={ this.copyClipboard }
          pasteClipboard={ this.pasteClipboard }
        />

      </span> )
    };
  }

  onRowClassName = ( record ) => {
    return classNames({
      "model--command" : true,
      "row-disabled": record.disabled,
      "row-failure": record.failure
    }) + ` ` + this.buildRowClassName( record );
  }

  shouldComponentUpdate( nextProps ) {
    if ( this.props.commands !== nextProps.commands ) {
      return true;
    }
    return false;
  }

  addSnippet = ( record ) => {
    const { setApp } = this.props.action;
    setApp({
      snippetModal: {
        isVisible: true,
        record: {
          groupId: this.props.groupId,
          testId: this.props.testId
        }
      }
    });
  }

  render() {
    const { snippets } = this.props,
          // When click Add record, it creates new temporary record, that shall not display, but
          // still needed in the data
          commands = this.props.commands
            .filter( command => ( command.ref || ( command.target && command.method ) ) );

    return ( <ErrorBoundary>
      <Table
        className="draggable-table"
        id="cCommandTable"
        components={ this.components }
        rowClassName={ this.onRowClassName }
        onRow={ this.onRow }
        showHeader={ false }
        dataSource={ commands }
        columns={ this.columns }
        pagination={ false }
        footer={() => ( <div className="ant-table-footer__toolbar">
          <Button
            id="cCommandTableAddBtn"
            onClick={ this.addRecord }><Icon type="plus" />Add a command/assertion</Button>

         { ( this.props.groupId !== SNIPPETS_GROUP_ID && Object.keys( snippets ).length ) ? <Button
            id="cCommandTableAddSnippetBtn"
            type="dashed"
            onClick={ this.addSnippet }><Icon type="plus" />Add a reference</Button> :  null }

          </div> )}
      />
    </ErrorBoundary> ); //groupId
  }
}