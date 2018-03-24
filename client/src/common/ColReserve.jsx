import React, { Component } from 'react';
import moment from 'moment';
import { Table, message, Icon } from 'antd';
import config from '../config'
export default class ConReserve extends Component {
	state = {
		reserves: []
	}
	componentDidMount = () => {
		this.mounted = true;
		let complete = this.props.complete;
		fetch(`${config.server}/api/onereserves?complete=${complete}`, {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					reserves: json.reserves
				});
			}
		});
	}
	cancelReserve = (id) => {
		fetch(`${config.server}/api/reserve/${id}`, {
			method: 'delete',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				let reserves = this.state.reserves;
				reserves = reserves.filter(reserve => {
					return reserve.id != id;
				});
				this.setState({
					reserves: reserves
				});
				message.info(json.msg);
			} else {
				message.error(json.msg);
			}
		});
	} 
	render () {
		const columns = [{
			title: '序列',
			dataIndex: 'id',
			key: '1',
			render: text => text,
		}, {
			title: '实验室',
			dataIndex: 'exp_id',
			key: '2',
			render: text => `实验室${text}`
		}, {
			title: '座位',
			dataIndex: 'table_id',
			key: '3',
			render: text => `${text}`
		}, {
			title: '预约时间',
			dataIndex: 'id',
			key: '4',
			render: id => {
				let date = moment(this.state.reserves[id - 1] && this.state.reserves[id - 1].date)
				.format("YYYY-MM-DD");
				let start = this.state.reserves[id - 1] && this.state.reserves[id - 1].start;
				let end = this.state.reserves[id - 1] && this.state.reserves[id - 1].end;
				return `${date} ${start}-${end}时`
			}
		}, {
			title: '地点',
			dataIndex: 'address',
			key: '5',
			render: text => text
		}, {
			title: '其他设备',
			dataIndex: 'equipment',
			key: '6',
			render: text => text || '无'
		}, {
			title: '状态',
			dataIndex: 'status',
			key: '7',
			render: text => {
				if (text === 0)
					return '审核中'
				else
					return '通过'
			}
		}, {
			title: '操作',
			dataIndex: 'id',
			key: '8',
			render: (id) => {
				let handleCancel = () => {
					this.cancelReserve(id);
				};
				return (
					<a>
						<Icon onClick={handleCancel} type="delete" />
					</a>
				);
			}
		}];
		return (
			<div>
				<Table rowKey="id" columns={columns} bordered={true} dataSource={this.state.reserves} />
			</div>
		);
	}
}