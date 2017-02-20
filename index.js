const app = require('./app');

app()
    .catch( (e)=>{
            console.error(e);
            console.error(e.stack);
        }
    );