
import React, {Component} from "react";
import { Card, Select, Cascader, Table, Button, Input, Loading, Dialog, Form, Message, Switch, Tabs, ColorPicker, Upload } from 'element-react';

// 引入 ECharts 主模块
import echarts from 'echarts';

import axios from "./axios"
import 'element-theme-default';
import "./app.less";

class AppComponent extends Component {

    constructor(props){
        super(props);
        this.myChart = null;
        this.curr_sheet_data = null;
        this.form = {
            name: '',
            password: ''
        };
        this.is_landscape = true;
        this.is_maxPoint = true;
        this.getValue = true;
        this.elseYAxisUnit = "";
        this.titleRow = "";
        this.titleColumn = "";
        this.user = Number(localStorage.getItem("token")) === 1 ? "cxr" : ""; 
        this.curr_color = "#c23531";
        this.bar_data = [];
        this.figure_type = [{
            value: 1,
            label: '折线图/柱形图'
        },{
            value: 2,
            label: '双轴混合'
        }];

        this.state = {
            table_names: [],
            all_row: [],
            all_column: [],

            curr_table: [],
            curr_figure_type: "",
            curr_row: [],
            curr_column: [],
            table_columns: [],
            table_data: [],
            figure_title: "",
            yAxisUnit: "",
            fullscreen: true,
            dialogVisible: false,
            curr_column_name: [],
            curr_row_name: [],
            custom_color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        }
    }

    componentDidMount(){

        this.myChart = echarts.init(document.getElementById('main'));

        axios.get("/api/main/table").then(rs => {

            this.setState({
                table_names: rs.data.data,
                fullscreen: false,
            });
            
        });
    }

    generateFigure = () => {
        
        switch(this.state.curr_figure_type) {
            case 1:
            case 2:
                var series = [], 
                    xAxisData = this.state.curr_column_name.filter(item => item !== "num"),
                    yAxisData = this.state.curr_row_name,
                    yAxisOpt = [];

                let curr_column = this.state.curr_column.filter(item => item !== "num"),
                    curr_row = this.state.curr_row,
                    sheet = this.curr_sheet_data,
                    time_type = [];

                if(!this.is_landscape){
                    for(let i = 0, len = curr_column.length; i < len; i++){
                        let data = [];
                        time_type[i] = [];

                        for(let j = 0, length = curr_row.length; j < length; j++){
                            let unit_obj = sheet.data[`${curr_column[i]}${curr_row[j]}`];

                            if(/\d+\:\d+\:\d+/.test(unit_obj && unit_obj.w)){
                                time_type[i].push(unit_obj.w);
                            }

                            let output = this.getValue ? (unit_obj && unit_obj.v) : (/\d+/.exec((unit_obj && unit_obj.w)))[0];
                            data.push(output)
                        }

                        var opt = {
                            name: xAxisData[i],
                            type: 'line',
                            data,
                            yAxisIndex: 0,
                            smooth: false, //圆滑
                            label:{
                                position: "top",
                                distance: 15,
                                show: true
                            }
                        }

                        if(this.state.curr_figure_type === 2 && this.bar_data.find(data => data === curr_column[i])){
                            opt.type = "bar";
                            opt.yAxisIndex = 1;
                        }

                        if(time_type[i].length){
                            opt.label.formatter = item => {
                                return time_type[i][item.dataIndex];
                            };
                        }

                        if(this.is_maxPoint){
                            opt.markPoint = {
                                data: [
                                    {type: 'max'},
                                    {type: 'min'}
                                ]
                            }
                        }
                        series.push(opt)
                    }
                }else {
                    for(let i = 0, len = curr_row.length; i < len; i++){
                        let data = [];
                        time_type[i] = [];

                        for(let j = 0, length = curr_column.length; j < length; j++){
                            let unit_obj = sheet.data[`${curr_column[j]}${curr_row[i]}`];
                                
                            if(/\d+\:\d+\:\d+/.test(unit_obj && unit_obj.w)){
                                time_type[i].push(unit_obj.w);
                            }

                            let output = this.getValue ? (unit_obj && unit_obj.v) : (/\d+/.exec((unit_obj && unit_obj.w)))[0];
                            data.push(output);
                        }
    
                        var opt = {
                            name: yAxisData[i],
                            type: 'line',
                            data,
                            yAxisIndex: 0,
                            smooth: false, //圆滑
                            label:{
                                position: "top",
                                distance: 15,
                                show: true
                            }
                        }

                        if(this.state.curr_figure_type === 2 && this.bar_data.find(data => data === curr_column[i])){
                            opt.type = "bar";
                            opt.yAxisIndex = 1;
                        }
                            
                        if(time_type[i].length){
                            opt.label.formatter = item => {
                                return time_type[i][item.dataIndex];
                            };
                        }

                        if(this.is_maxPoint){
                            opt.markPoint = {
                                data: [
                                    {type: 'max'},
                                    {type: 'min'}
                                ]
                            }
                        }
                        series.push(opt)
                    }
                }

                console.log(series);
                
                
                yAxisOpt[0] = {
                    type: 'value',
                    axisLabel: {
                        formatter: time_type.some(single => single.length) ? value => {
                            value = value.toFixed(3);
                            const ONE_DAY_SECOND = 24 * 60 * 60;
                            let total_time = ONE_DAY_SECOND * value;

                            let hour = parseInt(total_time/3600);

                            let minute = parseInt((total_time - 3600 * hour) / 60);

                            let second = parseInt(total_time - 3600 * hour - 60 * minute);

                            return `${hour}:${minute}:${second}`
                        } : `{value} ${this.state.yAxisUnit}`
                    }
                }

                if(this.state.curr_figure_type === 2){
                    yAxisOpt[1] = {
                        type: 'value',
                        axisLabel: {
                            formatter: `{value} ${this.elseYAxisUnit}`
                        }
                    }
                }

                this.myChart.setOption({
                    color: this.state.custom_color,
                    title: {
                        text: this.state.figure_title || "请输入标题哦"
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: this.is_landscape ? yAxisData : xAxisData
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
                        boundaryGap: true,
                        data: this.is_landscape ? xAxisData : yAxisData,
                        axisLabel: {
                            interval: 0,
                            rotate: this.is_landscape ? (xAxisData.length > 6 ? -30 : 0) : (yAxisData.length > 6 ? -30 : 0)
                       }
                    },
                    yAxis: yAxisOpt,
                    series: series
                }, true);
                break;
            default:

                break
        }
    }

    handleTableChange = value => {

        axios.post("/api/main/sheet",value).then(rs => {

            this.setState({curr_table: value, figure_title: value[1]});

            this.curr_sheet_data = rs.data.data;

            let row = [],
            max_row = this.curr_sheet_data.row;
            for(let i = 0; i < max_row; i++){
                let row_title = this.curr_sheet_data.data[`A${i+1}`];
                row.push({
                    value: i+1,
                    label: (row_title && row_title.v) || `第${i+1}行`,
                })
            }

            this.curr_sheet_data.column.push("num");

            this.curr_sheet_data.column = this.curr_sheet_data.column.map((column, index) => {
                let column_title = this.curr_sheet_data.data[`${column}1`];
                
                return {
                    value: column,
                    label: (column_title && column_title.v) || column
                }
            })

            this.setState({
                all_column: this.curr_sheet_data.column,
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

    handleCurColumnName = (value, index) => {
        this.state.curr_column_name[index] = value;
        this.generateFigure();
    }

    handleCurRowName = (value, index) => {
        this.state.curr_row_name[index] = value;
        this.generateFigure();
    }

    handleTitleRowChange = value => {
        let curr_column = this.state.curr_column,
            sheet = this.curr_sheet_data,
            data = [];
            
        for(let i = 0, len = curr_column.length; i < len; i++){
            
            if(curr_column[i] !== "num"){
                data.push(sheet.data[`${curr_column[i]}${value}`] && sheet.data[`${curr_column[i]}${value}`].v);
            }
        }

        console.log(data);

        this.state.curr_column_name = data;
        this.setState({curr_column_name: data});
        this.generateFigure();
    }

    handleTitleColumnChange = value => {
        let curr_row = this.state.curr_row,
            sheet = this.curr_sheet_data,
            data = [];
        for(let i = 0, len = curr_row.length; i < len; i++){
            data.push(sheet.data[`${value}${curr_row[i]}`] && sheet.data[`${value}${curr_row[i]}`].v);
        }
        
        console.log(data);
        
        this.state.curr_row_name = data;
        this.setState({curr_row_name: data});
        this.generateFigure();
    }
    
    login = () => {
    
        axios.post("/api/main/login",this.form).then(rs => {
            this.user = "";
            if(rs.data.data === 1){
                Message({
                    message: '登陆成功',
                    type: 'success'
                });   
                this.user = "cxr";
            }else {
                Message({
                    message: '登陆失败',
                    type: 'error'
                });
            }
            localStorage.setItem("token", rs.data.data);

            this.setState({ dialogVisible: false });
        })
    }

    handleRowChange = value => {
        this.titleColumn = "";
        this.state.curr_row_name = value.map(item => {
            let name = "";
            this.state.all_row.map(obj => {
                if(obj.value === item){
                    name = obj.label;
                }
            })

            return name;
        });

        this.setState({curr_row: value, curr_row_name: this.state.curr_row_name});

        let data = [],
            curr_column = this.state.curr_column,
            sheet = this.curr_sheet_data;

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
    }

    handleColumnChange = value => {
        this.titleRow = "";
        let table_columns = [];
        this.state.curr_column_name = value.map(item => {
            let name = "", column_obj = {};
            if(item === "num"){
                column_obj = {prop: item, fixed: 'left', width: 100}
            }else {
                column_obj = {prop: item}
            }
            this.state.all_column.map(obj => {
                if(obj.value === item){
                    name = obj.label;
                    column_obj.label = name;
                }
            })

            table_columns.push(column_obj);
            return name;
        });

        this.setState({ curr_column: [...value, "num"],curr_column_name: this.state.curr_column_name });
        let data = [], 
            curr_row = this.state.curr_row,
            sheet = this.curr_sheet_data;

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
        
        this.setState({table_columns})
        value.length ? this.setState({table_data: data}) : ''
    }

    handleColorChange = value => {
        this.state.custom_color.push(value);
        this.setState({custom_color: this.state.custom_color});
        this.generateFigure();
    }

    deleteSelectColor = (e, value) => {
        this.state.custom_color = this.state.custom_color.filter(item => item !== value);
        this.setState({custom_color: this.state.custom_color});
        this.generateFigure();
    }

    handleDirectionChange = value => {
        this.is_landscape = value;
        this.setState({curr_figure_type: this.state.curr_figure_type})
    }

    handleFileUpload = value => {
        if(value.response.code === 200){
            Message({
                message: '上传成功',
                type: 'success'
            });   
        }else {
            Message({
                message: '上传失败',
                type: 'error'
            });  
        }
    }

    render() {

        const header = {
            Authorization: Number(localStorage.getItem("token")) === 1 ? "cxrloginsuccess" : ""
        }

        return (
            <div className="root-content">
                {this.state.fullscreen && <Loading fullscreen={true} text="别着急，加载中"/>}
                <Card className="header-box-card">
                    <div className="flex-box">
                        <h2> Excel Echarts Conversion System </h2>
                        <div className="file-upload-btn">
                            {
                                this.user === "cxr" ? "cxr" : <Button type="primary" onClick={ () => this.setState({ dialogVisible: true }) }>登陆</Button>
                            }
                            {
                                this.user === "cxr" ?
                                <Upload
                                    className="upload-demo"
                                    action="/api/main/upload"
                                    onChange={this.handleFileUpload}
                                    headers= {header}
                                >
                                    <Button size="small" type="primary">点击上传</Button>
                                </Upload>
                            : 
                            ""
                            }
                        </div>
                    </div>
                </Card>
                <div className="main-content">
                    <Card className="box-card table-select-card">
                        <Cascader
                            placeholder="请选择表格"
                            className="select-table-figure"
                            options={this.state.table_names}
                            value={this.state.curr_table}
                            onChange={this.handleTableChange}/>

                        <Select onChange={this.handleFigureTypeChange} filterable={true} value={this.state.curr_figure_type} placeholder="请选择图类型" className="select-table-figure">
                            {
                                this.figure_type.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>
                        <Select onChange={this.handleRowChange} filterable={true} value={this.state.curr_row} multiple={true} placeholder="请选择行" className="select-table-figure">
                            {
                                this.state.all_row.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>
                        <Select onChange={this.handleColumnChange} filterable={true}  value={this.state.curr_column} multiple={true} placeholder="请选择列" className="select-table-figure">
                            {
                                this.state.all_column.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                        </Select>

                        {
                            this.state.curr_figure_type === 2 ? 
                            <Select onChange={value => this.bar_data = value} filterable={true}  value={this.bar_data} multiple={true} placeholder="请选择柱状数据来源" className="select-table-figure">
                            {
                                !this.is_landscape ? 
                                this.state.all_column.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                                :
                                this.state.all_row.map(el => {
                                    return <Select.Option key={el.value} label={el.label} value={el.value} />
                                })
                            }
                            </Select>
                            : ""
                        }
  

                        <div className="generate-figure">
                            <Input placeholder="请输入图表标题" value={this.state.figure_title} onChange={this.handleTitleChange}/>
                            <Input placeholder="请输入y轴单位" value={this.state.yAxisUnit} onChange={this.handleUnitChange}/>
                            <Input placeholder="请输入新增y轴单位" defaultValue={this.elseYAxisUnit} onChange={value => this.elseYAxisUnit = value}/>
                            <div className="is-landscape">
                                <Switch
                                    value={this.is_landscape}
                                    onChange={this.handleDirectionChange}
                                    onColor="#13ce66"
                                    onText="横向"
                                    offText="纵向"
                                    offColor="#ff4949">
                                </Switch>
                                <div className="max-point">
                                    <span>max point</span>
                                    <Switch
                                        value={this.is_maxPoint}
                                        onChange={value => this.is_maxPoint = value}
                                        onColor="#13ce66"
                                        onText="on"
                                        offText="off"
                                        offColor="#ff4949">
                                    </Switch>
                                </div>
                                <Switch
                                    value={this.getValue}
                                    onChange={value => this.getValue = value}
                                    onColor="#13ce66"
                                    onText="v"
                                    offText="w"
                                    offColor="#ff4949">
                                </Switch>
                            </div>
                            <div className="customer-row-number">

                            </div>
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
                    <div className="figure-box">
                        <div id="main" className="charts-box" style={{ width: 1000, height: 600 }}></div>

                        <Tabs type="border-card" activeName="1" style={{maxwidth: "300px"}}>
                            <Tabs.Pane label="坐标管理(列)" name="1">
                                {
                                    this.state.curr_column_name.filter(item => item !== "num").map((value, index) => {
                                        return <Input style={{marginTop: "5px"}} key={value} defaultValue={value} onChange={value => this.handleCurColumnName(value,index)} />
                                    })
                                }

                                <Select value={this.titleRow} onChange={this.handleTitleRowChange} placeholder="请选择标题行" className="select-table-figure title-row-select">
                                    {
                                        this.state.all_row.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>

                            </Tabs.Pane>
                            <Tabs.Pane label="坐标管理(行)" name="2">
                                {
                                    this.state.curr_row_name.map((value, index) => {
                                        return <Input style={{marginTop: "5px"}} key={value} defaultValue={value} onChange={value => this.handleCurRowName(value,index)} />
                                    })
                                }

                                <Select value={this.titleColumn} onChange={this.handleTitleColumnChange} placeholder="请选择标题列" className="select-table-figure title-row-select">
                                    {
                                        this.state.all_column.map(el => {
                                            return <Select.Option key={el.value} label={el.label} value={el.value} />
                                        })
                                    }
                                </Select>

                            </Tabs.Pane>
                            <Tabs.Pane label="颜色管理" name="3">
                                
                                <div className="block color-picker-box">
                                    <ColorPicker style={{widht: "400px"}} value={this.curr_color} 
                                        onChange={this.handleColorChange}></ColorPicker>
                                </div>

                                <div className="curr-select-color">
                                    <h3>点击方块移除该颜色</h3>
                                    {
                                        this.state.custom_color.map(color => {
                                            return <div key={color} style={{background: color}} onClick={e => this.deleteSelectColor(e, color)}></div>
                                        })
                                    }
                                </div>

                            </Tabs.Pane>
                        </Tabs>

                    </div>
                </Card>

                <Dialog
                    title="登陆"
                    visible={ this.state.dialogVisible }
                    onCancel={ () => this.setState({ dialogVisible: false }) }
                >
                    <Dialog.Body>
                        <Form model={this.form}>
                            <Form.Item label="用户名" labelWidth="120">
                                <Input defaultValue={this.form.name} onChange={value => this.form.name = value}></Input>
                            </Form.Item>
                            <Form.Item label="密码" labelWidth="120">
                                <Input defaultValue={this.form.password} onChange={value => this.form.password = value}></Input>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={ () => this.setState({ dialogVisible: false }) }>取 消</Button>
                        <Button type="primary" onClick={ this.login }>登陆</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}


export default AppComponent;