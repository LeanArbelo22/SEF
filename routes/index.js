const vendedoresRouter = require('./sellersRouter');


function routerApi(app){
app.use('/vendedores', vendedoresRouter);
}


module.exports = routerApi;