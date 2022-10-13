const connectionReady = (cb = () => {}) => {
    console.log('Listo para escuchar mensajes')
    console.log('Client is ready!');
    cb()
}
module.exports = {connectionReady}