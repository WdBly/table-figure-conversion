
import React, {Component} from "react";
import { Card, Select, Cascader, Table } from 'element-react';
import axios from "./axios"
import 'element-theme-default';
import "./app.less";


class AppComponent extends Component {

    constructor(props){
        super(props);

        this.state = {
            table_names: [],
            all_row: [],
            all_column: [],
            figure_type: [{
                value: 1,
                label: '折线图'
            }, {
                value: 2,
                label: '漏斗图'
            }],
            curr_table: [],
            curr_figure_type: "",
            curr_row: [],
            curr_column: [],
            table_columns: [],
            table_data: []
        }
    }

    componentDidMount(){
        axios.get("/api/main/table").then(rs => {

            this.setState({
                table_names: rs.data.data 
            });

            console.log(rs.data.data);
            
        });
    }

    fetchAarticleList = () => {

    }

    getCurrSheetData = (value, fn) => {
        this.state.table_names.length && this.state.table_names.map(table => {
            if(table.value === value[0]){
                table.children.map(sheet => {
                    if(sheet.value === value[1]){
                        fn(sheet);
                    }
                })
            }
        })
    }

    handleTableChange = value => {
        this.setState({curr_table: value});

        this.getCurrSheetData(value, sheet => {
            let row = [];
            for(let i = 0, len = sheet.row > 10 ? 10 : sheet.row; i < len; i++){
                row.push({
                    value: i+1,
                    label: `第${i+1}行`,
                })
            }

            sheet.column.push("num");

            this.setState({
                all_column: sheet.column.map(column => ({value: column, label: column})),
                all_row: row
            })
        });
    }

    handleRowChange = value => {
        this.setState({curr_row: value});

        this.getCurrSheetData(this.state.curr_table, sheet => {
            let data = [],
                curr_column = this.state.curr_column;

            if(curr_column.length){
                for(let i = 0, len = value.length; i < len; i++){
                    let obj = {};

                    for(let j = 0, length = curr_column.length; j < length; j++){
                        curr_column[j] === "num" ? obj["num"] = `第${value[i]}行` :
                        obj[curr_column[j]] = sheet.data[`${curr_column[j]}${value[i]}`] && sheet.data[`${curr_column[j]}${value[i]}`].v
                    }
                    data.push(obj);
                }
            }

            data.length ? this.setState({ table_data: data }) : '';
        });
    }

    handleColumnChange = value => {

        this.setState({ curr_column: value });
        
        this.getCurrSheetData(this.state.curr_table, sheet => {
            let data = [], 
                curr_row = this.state.curr_row;

            if(curr_row.length){
                for(let i = 0, len = curr_row.length; i < len; i++){
                    let obj = {};

                    for(let j = 0, length = value.length; j < length; j++){
                        value[j] === "num" ? obj["num"] = `第${curr_row[i]}行` :
                        obj[value[j]] = sheet.data[`${value[j]}${curr_row[i]}`] && sheet.data[`${value[j]}${curr_row[i]}`].v
                    }
                    data.push(obj);
                }
            }
            
            this.setState({
                table_columns: value.map(column => column === "num" ? ({
                    prop: column, label: column, fixed: 'left', width: 80
                }) : ({prop: column, label: column})),
                table_data: data,
            })
        });
    }


    render() {

        return (
            <div className="main-content">
                <Card className="box-card table-select-card">
                    <Cascader
                        placeholder="请选择表格"
                        className="select-table-figure"
                        options={this.state.table_names}
                        value={this.state.curr_table}
                        onChange={this.handleTableChange}/>

                    <Select value={this.state.curr_figure_type} placeholder="请选择图类型" className="select-table-figure">
                        {
                            this.state.figure_type.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select>
                    <Select onChange={this.handleRowChange} value={this.state.curr_row} multiple={true} placeholder="请选择行" className="select-table-figure">
                        {
                            this.state.all_row.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select>
                    <Select onChange={this.handleColumnChange} value={this.state.curr_column} multiple={true} placeholder="请选择列" className="select-table-figure">
                        {
                            this.state.all_column.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select>
                </Card>
                <Card className="box-card table-select-card full-width">
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.table_columns}
                        maxHeight={2000}
                        data={this.state.table_data}
                    />
                </Card>
            </div>
        );
    }
}


export default AppComponent;