import mongoose from 'mongoose'

import User from './userprofile.model'

const mongoDBUri = process.env.MONGO_URL;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

mongoose.connect(mongoDBUri, options).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log("Mongo Connection Established");
        
    },
    err => { /** handle initial connection error */
        console.log("Mongo Connection ERR : " + err);
    }
  );

export default User;