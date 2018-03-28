import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Menu, Layout, message, Icon } from 'antd';
import Header_c from '../../common/Header';
import Logo from '../../common/Logo';
import MonitorExp from './MonitorExp';
import MonitorUser from './MonitorUser';
import MonitorReserve from './MonitorReserve';
import Exps from './Exps';
import Notification from './Notification';
import './Admin.css';
const { Sider, Content } = Layout;

export default class Admin extends Component {
	state = {
		current: 'monitorexp'
	}
	handleClick = (e) => {
		this.setState({
			current: e.key
		});
	}
	handleBack = () => {
		this.setState({
			current: 'monitorexp'
		});
	}
	handleLogout = () => {
		delete localStorage.admin_token;
		this.props.history.push('/admin/login');
	}
	componentWillMount = () => {
		if (!localStorage.admin_token) {
			message.error('请先进行登陆');
			this.props.history.push('/admin/login');
		}
	}
	render () {
		return (
			<div className="Admin">
				<Layout>
					<Sider width={256}>
						<Link onClick={this.handleBack} to="/admin">
							<Logo/>
						</Link>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							theme="dark"
						>
							<Menu.Item key="monitorexp">
								<Link to={`${this.props.match.url}`}>
									<Icon type="global" />实验室监控
								</Link>
							</Menu.Item>
							<Menu.Item key="user">
								<Link to={`${this.props.match.url}/user`}>
									<Icon type="contacts" />用户管理
								</Link>
							</Menu.Item>
							<Menu.Item key="reserve">
								<Link to={`${this.props.match.url}/reserve`}>
									<Icon type="table" />预约管理
								</Link>
							</Menu.Item>
							<Menu.Item key="exps">
								<Link to={`${this.props.match.url}/exps`}>
									<Icon type="user" />我的实验室
								</Link>
							</Menu.Item>
							<Menu.Item key="notification">
								<Link to={`${this.props.match.url}/notification`}>
									<Icon type="notification" />公告
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Content>
						<Layout>
							<Header_c handleLogout={this.handleLogout}/>
							<Content>
								<Route exact path={`${this.props.match.url}`} component={MonitorExp} />
								<Route path={`${this.props.match.url}/user`} component={MonitorUser}/>
								<Route path={`${this.props.match.url}/reserve`} component={MonitorReserve}/>
								<Route path={`${this.props.match.url}/notification`} component={Notification}/>
								<Route path={`${this.props.match.url}/exps`} component={Exps}/>
							</Content>
						</Layout>
					</Content>
				</Layout>
			</div>
		);
	}
}