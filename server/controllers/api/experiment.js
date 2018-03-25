const db = require('../../model/db');
exports.addExperiment = async (req, res) => {
	let body = req.body;
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = 'select * from Experiment where name=?';
			db.query(sql, [body.Name], (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps);
			});
		});
		if (exps.length > 0)
			return res.json({
				err: 1,
				msg: '该实验室已经存在'
			});
		await new Promise((resolve, reject) => {
			let sql = 'insert into Experiment(name, ip, address) values(?, ?, ?)';
			db.query(sql, [body.Name, body.IP, body.Address], (err) => {
				if (err)
					reject(err);
				else
					resolve();
			});
		});
		let exp_id = await new Promise((resolve, reject) => {
			let sql = 'select id from Experiment where name=?';
			db.query(sql, [body.Name], (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps[0].id);
			});
		});
		for (let i = 0; i < body.TableCount; i++)
			await new Promise((resolve, reject) => {
				let sql = 'insert into Tab(exp_id) values(?)';
				db.query(sql, [exp_id], err => {
					if (err)
						reject(err);
					else 
						resolve();
				});
			});
		res.json({
			err: 0,
			msg: '添加成功'
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.monitorExp = async (req, res) => {
	let id = req.params.id;
	try {
		let tables = await new Promise((resolve, reject) => {
			let sql = 'select * from Tab where exp_id=?';
			db.query(sql, [id], (err, tables) => {
				if (err) 
					reject(err);
				else
					resolve(tables);
			});
		});
		res.json({
			err: 0,
			tables
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showExps = async (req, res) => {
	try {
		let exps = await new Promise((resolve, reject) => {
			let sql = `select Experiment.id, ip, count(Tab.id) as tablesCount, 
			address, name from Experiment left join Tab on 
			Experiment.id=Tab.exp_id group by Experiment.id`;
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else
					resolve(exps);
			});
		});
		res.json({
			err: 0,
			exps
		});
	} catch (e) {
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.showRestExps = async (req, res) => {
	let body = req.body;
	try {
		let reserves = await new Promise((resolve, reject) => {
			let sql = 'select exp_id, table_id from Reserve where date=? and ((start<? and start>=?) or (end<=? and end>?) or (start=? and end=?))';
			db.query(sql, [body.Date, body.End, body.Start, body.End, body.Start, body.Start, body.End], (err, reserves) => {
				if (err) 
					reject(err);
				else
					resolve(reserves);
			});
		});
		let exps = await new Promise((resolve, reject) => {
			let sql = 'select Experiment.id, count(Tab.id) as tablesCount from Experiment left join Tab on Experiment.id=Tab.exp_id group by Experiment.id';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps);
			});
		});
		res.json({
			err: 0,
			reserves,
			exps
		});
	} catch (e) {
		console.log(e);
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};

exports.expsCount = async (req, res) => {
	try {
		let count = await new Promise((resolve, reject) => {
			let sql = 'select count(id) as count from Experiment';
			db.query(sql, (err, exps) => {
				if (err)
					reject(err);
				else 
					resolve(exps[0].count);
			});
		});
		res.json({
			err: 0,
			count
		});
	} catch (e) {
		res.json({
			err: 1,
			msg: '服务器出错了'
		});
	}
};