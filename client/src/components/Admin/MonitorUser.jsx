import React, { Component } from 'react';
import { Table, message, Card, Popconfirm} from 'antd';
import config from '../../config';
export default class ManageUser extends Component {
	state = {
		users: []
	}
	componentDidMount = () => {
		fetch(`${config.server}/api/admin/users`, {
			method: 'get',
			headers: {
				'x-access-token': localStorage.admin_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					users: json.users
				});
			}
		});
	}
	handleSwitch = (account, e) => {
		let body = {
			account,
			forbidden: e
		};
		fetch(`${config.server}/api/admin/monitoruser`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.admin_token
			},
			body: JSON.stringify(body)
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				let users = this.state.users;
				users = users.map(user => {
					if (user.account === account) {
						user.forbidden = e;
					}
					return user;
				});
				this.setState({
					users: users
				});
				message.info(json.msg);
			} else {
				message.error(json.msg);
			}
		});
	}
	render () {
		const columns = [
			{
				title: '学号',
				dataIndex: 'account',
				key: '1',
				render: text => text,
			}, {
				title: '姓名',
				dataIndex: 'name',
				key: '2',
				render: text => text,
			}, {
				title: '性别',
				dataIndex: 'sex',
				key: '3',
				render: text => {
					if (text === 'man') {
						return '男'
					} else if (text === 'woman') {
						return '女'
					}
				},
			}, {
				title: '专业',
				dataIndex: 'major',
				key: '4',
				render: text => text,
			}, {
				title: '年级',
				dataIndex: 'grade',
				key: '5',
				render: text => text,
			}, {
				title: '手机号码',
				dataIndex: 'mobile',
				key: '6',
				render: text => text,
			}, {
				title: '预约权限',
				dataIndex: 'forbidden',
				key: '7',
				render: text => {
					if (text)
						return '无';
					else
						return '有';
				}
			}, {
				title: '预约权限控制',
				dataIndex: 'account',
				key: '8',
				render: (account, record) => {
					let forbidden = record.forbidden;
					let handleChange = () => {
						this.handleSwitch(account, !forbidden);
					}
					if (!forbidden) {
						return (
							<Popconfirm title="确定禁止?" onConfirm={handleChange} okText="Yes" cancelText="No">
								<a>禁止</a>
							</Popconfirm>
						);
					} else {
						return (
							<Popconfirm title="确定允许?" onConfirm={handleChange} okText="Yes" cancelText="No">
								<a>允许</a>
							</Popconfirm>
						);
					}
				}
			}
		];
		return (
			<div className="ManageUser Container">
				<Card
					title="用户管理"
				>
					<Table pagination={false} rowKey="account" columns={columns} bordered={true} dataSource={this.state.users}/>
				</Card>
			</div>
		);
	}
}