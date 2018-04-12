const moment = require('moment');
const redis = require('../model/redis');
const execTask = require('./handlesocket').execTask;

let timer;
exports.addTask = async (option) => {
    clearTimeout(timer);
    let res = await new Promise((resolve, reject) => {
        redis.get('task', (err, res) => {
            if (err) 
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(res);
    let current_res = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_res) {
        let current_task = JSON.parse(current_res);
        tasks.push(current_task);
    }
    tasks.push(option);
    tasks = tasks.sort((pretask, nexttask) => {
        let a = moment(pretask.date).add(pretask.hours, 'h').valueOf();
        let b = moment(nexttask.date).add(nexttask.hours, 'h').valueOf();
        return a - b;
    });
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('task', str, err => {
            if (err) 
                reject(err);
            else
                resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del("current_task", err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        return;
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
        return;
    }
};

exports.cancelTask = async (id) => {
    clearTimeout(timer);
    let res = await new Promise((resolve, reject) => {
        redis.get('task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(res);
    let current_res = await new Promise((resolve, reject) => {
        redis.get('current_task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    if (current_res) {
        let current_task = JSON.parse(current_res);
        tasks.unshift(current_task);
    }
    tasks = tasks.filter(task => {
        return task.id != id;
    });
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('task', str, err => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del("current_task", err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        return;
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
        return;
    }
};

async function nextTask () {
    clearTimeout(timer);
    let res = await new Promise((resolve, reject) => {
        redis.get('task', (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });
    let tasks = JSON.parse(res);
    let task = tasks.shift();
    await new Promise((resolve, reject) => {
        let str = JSON.stringify(tasks);
        redis.set('task', str, err => {
            if (err)
            reject();
            else
            resolve();
        });
    });
    if (!task) {
        await new Promise((resolve, reject) => {
            redis.del('current_task', err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        return;
    } else {
        await new Promise((resolve, reject) => {
            let str = JSON.stringify(task);
            redis.set("current_task", str, err => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        let time = moment(task.date).add(task.hours, 'h').diff(moment(), 'milliseconds');
        exec_timer_task(time, task);
        return;
    }
};

async function exec_timer_task(time, task) {
    timer = setTimeout(async () => {
        await execTask(task);
        await nextTask();
    }, time);
    return;
};