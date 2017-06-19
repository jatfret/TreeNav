import React from 'react';
import ECharts from '../../lib/echarts.min';

export default class EchartsSankey extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			isFetching: true
		}

		this.getChartOptions = this.getChartOptions.bind(this);
		this.handleChartData = this.handleChartData.bind(this);
	}
	componentDidMount(){
    	this.loadData();
  	}
  	loadData(){
	    fetch("/api/path_data").then(response=>{return response.json()})
	      .then(pathData=>{this.setState({isFetching: false, pathData})})
	      .catch(err=>{console.log(err)});
	}
	getChartOptions(){
		const chartData = this.handleChartData();
		const options = {
			title: {
            	text: '路径分析'
	        },
	        tooltip: {
	            trigger: 'item',
	            triggerOn: 'mousemove',
	            backgroundColor: 'rgba(86, 103, 121, 0.9)',
	            padding: 14
	        },
	        label: {
	        	normal: {
	        		formatter: function(params){
	        			return params.name.replace(/to|from/g, "");
	        		}
	        	},
	        	emphasis: {
	        		formatter: function(params){
	        			return params.name.replace(/to|from/g, "");
	        		}
	        	}
	        },
	        series: [
	            {
	                type: 'sankey',
	                top: 60,
	                right: '10%',
	                bottom: 60,
	             	left: '10%',
	                nodeWidth: 80,
	                tooltip: {
	                	formatter: function(params){
	                		console.log(params);
	                		if(params.dataType === 'node'){
	                			return `<p style="font-size: 14px; color: #fff; width: 188px;">${params.data.tooltipData.source.replace(/from|to/g, "")}</p>\
		                				<p style="font-size: 12px;">流向${params.data.tooltipData.target.replace(/to|from/g, "")}占比：${params.data.tooltipData.value}%</p>\
		                				<p style="font-size: 12px;">流向${params.data.tooltipData.target.replace(/to|from/g, "")}人数：${params.data.tooltipData.usernum}人</p>`
	                		}else if(params.dataType === 'edge'){
		                		return `<p style="font-size: 14px; color: #fff; width: 188px;">${params.data.source.replace(/from|to/g, "")}</p>\
		                				<p style="font-size: 12px;">流向${params.data.target.replace(/to|from/g, "")}占比：${params.data.value}%</p>\
		                				<p style="font-size: 12px;">流向${params.data.target.replace(/to|from/g, "")}人数：${params.data.usernum}人</p>`;
	                		}
	                	}
	                },
	                data: chartData.nodes,
	                links: chartData.links,
	                itemStyle: {
	                    normal: {
	                        borderWidth: 0
	                    }
	                },
	                lineStyle: {
	                    normal: {
	                        color: '#eeeeee',
	                        opacity: 1,
	                        curveness: 0.5
	                    }
	                }
	            }
	        ]
		}
		return options;
	}
	handleChartData(){
		let { pathData } = this.state;
		let chartData = {
			nodes: [],
			links: []
		};
		if(pathData){
			chartData.nodes.push({
				name: pathData.data.name,
				itemStyle: {
					normal: {
						position: 'inside',
						color: '#5faee3'
					}
				},
				label: {
					normal: {
						position: 'inside',
						textStyle: {
	            			color: '#fff'
	            		}
					}
				},
				tooltip: {
					show: false
				}
			});
			pathData.data.from.map(f=>{
				chartData.nodes.push({
					name: f.name,
					tooltipData: {
						source: f.name,
						target: pathData.data.name,
						value: f.value,
						usernum: 3234,
					},
					itemStyle: {
						normal: {
							color: '#64ccb1',
						},
						emphasis: {
							color: '#2ba787',
						}
					},
					label: {
						normal: {
							position: 'left',
							textStyle: {
		            			color: '#6a7181'
		            		}
						}
					}
				});
				chartData.links.push({
					source: f.name,
					target: pathData.data.name,
					value: f.value,
					usernum: 3234,
					lineStyle: {
	                    emphasis: {
	                    	color: '#b1e5d8'
	                    }
					}
				});
			});
			pathData.data.to.map(t=>{
				chartData.nodes.push({
					name: t.name,
					tooltipData: {
						source: t.name,
						target: pathData.data.name,
						value: t.value,
						usernum: 3234,
					},
					itemStyle: {
						normal: {
							color: '#6c85bd',
						},
						emphasis: {
							color: '#47619c',
						}
					},
					label: {
						normal: {
							position: 'right',
							textStyle: {
		            			color: '#6a7181'
		            		}
						}
					}
				});
				chartData.links.push({
					source: pathData.data.name,
					target: t.name,
					value: t.value,
					usernum: 3234,
					lineStyle: {
	                    emphasis: {
	                    	color: '#b5c2de'
	                    }
					}
				});
			})
		}

		return chartData;
	}
	render(){
		return (
			<div>
				{
					this.state.isFetching
					?
					<h3>Loading...</h3>
					:
					<div className="chart-wrap">
						<SankeyChart options={this.getChartOptions()}/>
					</div>
				}
			</div>
		)
	}
}

class SankeyChart extends React.Component {
	constructor(props) {
		super(props);

	}
	componentDidMount() {
		let { options } = this.props;
		const chart = ECharts.init(document.getElementById('main'));
		console.log(1);

		chart.setOption(options);
	}
	componentWillReceiveProps(nextProps) {
		let { options } = nextProps;
		const chart = ECharts.getInstanceByDom(document.getElementById('main'));
		console.log(2);
		chart.setOption(options);
	}
	render(){
		return (
			<div className="chart-wrap">
				<div id="main" style={{width: '1080px', height: '624px'}}></div>
			</div>
		)
	}
}
