const mysql = require('mysql');
const config = require('../config');
const connection = mysql.createConnection(config.db);

connection.connect();

const table1 = `create table if not exists Admin (
				account varchar(15) unique,
				name varchar(15),
				password varchar(100), 
				primary key(account))
				charset=utf8`;

const table2 = `create table if not exists User (
				id int unsigned auto_increment,
				account varchar(8) unique,
				name varchar(15),
				password varchar(100),
				sex varchar(5),
				major varchar(25),
				mobile varchar(11),
				grade varchar(10),
				forbidden boolean default false,
				primary key(id))
				charset=utf8`;
				// active boolean default false, 

const table3 = `create table if not exists Experiment (
				id int unsigned auto_increment,
				name varchar(15),
				ip varchar(20),
				port varchar(10),
				address varchar(15),
				primary key(id))
				charset=utf8`;
				// status boolean default false,
				// door boolean default false,
				// fault boolean default false,

const table4 = `create table if not exists Tab (
				id int unsigned auto_increment,
				seat int unsigned,
				exp_id int unsigned,
				status boolean default false,
				fault boolean default false,
				primary key(id), 
				foreign key(exp_id) references Experiment(id))
				charset=utf8`;
				// power_status boolean default false,
/*status:
	0 电源关闭状态
	1 电源打开状态
*/
/*power_status:
	0 关闭状态
	1 打开状态
*/
const table5 = `create table if not exists Reserve (
				id int unsigned auto_increment,
				createAt datetime,
				date datetime,
				start int,
				end int,
				equipment varchar(30),
				approver varchar(15),
				status tinyint(1),
				user_id int unsigned,
				exp_id int unsigned,
				seat int unsigned,
				primary key(id))
				charset=utf8`;
				// complete_status boolean default false,
/*status:
	0 审核中
	1 审核通过
	2 执行中
	3 已执行
*/
/*complete_status:
	0 未完成
	1 执行中
	2 已执行
*/
const table6 = `create table if not exists Notification (
				id int unsigned auto_increment,
				title varchar(50),
				createAt datetime,
				msg longtext,
				primary key(id)
				)`;
				
connection.query(table1);
connection.query(table2);
connection.query(table3);
connection.query(table4);
connection.query(table5);
connection.query(table6);

module.exports = connection;