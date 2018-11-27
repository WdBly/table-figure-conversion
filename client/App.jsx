
import React, {Component} from "react";
import { Card, Select, Cascader, Table, Button, Input, Loading } from 'element-react';

// 引入 ECharts 主模块
import echarts from 'echarts';

import axios from "./axios"
import 'element-theme-default';
import "./app.less";

class AppComponent extends Component {

    constructor(props){
        super(props);
        this.myChart = null;

        this.state = {
            table_names: [],
            all_row: [],
            all_column: [],
            figure_type: [{
                value: 1,
                label: '折线图/柱形图'
            }],
            curr_table: [],
            curr_figure_type: "",
            curr_row: [],
            curr_column: [],
            table_columns: [],
            table_data: [],
            figure_title: "",
            yAxisUnit: "",
            fullscreen: true,
        }
    }

    componentDidMount(){

        this.myChart = echarts.init(document.getElementById('main'));

        axios.get("/api/main/table").then(rs => {

            this.setState({
                table_names: rs.data.data,
                fullscreen: false,
            });

            console.log(rs.data.data);
            
        });
    }

    generateFigure = () => {
        console.log(this.state);
        
        switch(this.state.curr_figure_type) {
            case 1:

                var series = [], xAxisData = this.state.curr_column.filter(item => item !== "num");
                this.getCurrSheetData(this.state.curr_table, sheet => {

                    let curr_column = this.state.curr_column,
                        curr_row = this.state.curr_row;

                    for(let i = 0, len = curr_row.length; i < len; i++){
                        let data = [];
                        for(let j = 0, length = curr_column.length; j < length; j++){
                            if(curr_column[j] !== "num"){
                                data.push(sheet.data[`${curr_column[j]}${curr_row[i]}`] && sheet.data[`${curr_column[j]}${curr_row[i]}`].v)
                            }
                        }

                        series.push({
                            name: "test"+curr_row[i],
                            type: 'line',
                            data
                        })
                    }
                });

                this.myChart.setOption({
                    title: {
                        text: this.state.figure_title || "请输入标题哦"
                    },
                    legend: {
                        data:this.state.curr_row.map(item => "test"+item)
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: `{value} ${this.state.yAxisUnit}`
                        }
                    },
                    series: series
                });
                break;
            case 2:
                break;
            default:

                break
        }
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
        this.setState({curr_table: value, figure_title: value[1]});

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

    handleTitleChange = value => {
        this.setState({figure_title: value});
    }

    handleFigureTypeChange = value => {
        this.setState({curr_figure_type: value});
    }

    handleUnitChange = value => {
        this.setState({yAxisUnit: value});
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
                    prop: column, label: column, fixed: 'left', width: 100
                }) : ({prop: column, label: column}))
            })
            value.length ? this.setState({table_data: data,}) : ''
        });
    }


    render() {

        return (
            <div className="root-content">
                {this.state.fullscreen && <Loading fullscreen={true} text="别着急，加载中"/>}
                <Card className="header-box-card">
                    <h2> Excel Echarts Conversion System</h2>
                </Card>
                <div className="main-content">
                    <Card className="box-card table-select-card">
                        <Cascader
                            placeholder="请选择表格"
                            className="select-table-figure"
                            options={this.state.table_names}
                            value={this.state.curr_table}
                            onChange={this.handleTableChange}/>

                        <Select onChange={this.handleFigureTypeChange} value={this.state.curr_figure_type} placeholder="请选择图类型" className="select-table-figure">
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

                        <div className="generate-figure">
                            <Input placeholder="请输入图表标题" value={this.state.figure_title} onChange={this.handleTitleChange}/>
                            <Input placeholder="请输入y轴单位" value={this.state.yAxisUnit} onChange={this.handleUnitChange}/>
                            <Button type="info" className="generate-figure-btn" onClick={this.generateFigure}>生成图</Button>
                        </div>

                    </Card>
                    <Card className="box-card table-select-card full-width">
                        <Table
                            style={{width: '100%'}}
                            columns={this.state.table_columns}
                            data={this.state.table_data}
                            border={true}
                            maxHeight={550}
                        />
                    </Card>
                </div>
                <Card className="charts-box-card">
                    <div id="main" className="charts-box" style={{ width: 1000, height: 600 }}></div>
                </Card>
            </div>
        );
    }
}


export default AppComponent;