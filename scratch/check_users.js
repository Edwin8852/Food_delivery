const models = require('./backend/src/models');
models.User.findAll({ raw: true }).then(u => {
    console.log(JSON.stringify(u.map(x => ({id:x.id, name:x.name, role:x.role})), null, 2));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
